import {
    readFileSync,
    readdirSync,
    existsSync
} from "node:fs";
import {basename, join, relative, resolve} from "node:path";

export interface InvalidWorkspaceUrl {
    file: string;
    path: string;
    url: string;
}

export interface DeploymentCheck {
    valid: boolean;
    path: string;
    errors: string[];
    files?: string[];
}

export interface SsrDeploymentCheck extends DeploymentCheck {
    required: boolean;
    artifacts: string[];
}

export interface DeploymentValidationResult {
    instance: string;
    widget?: string;
    valid: boolean;
    manifest: DeploymentCheck;
    release: DeploymentCheck;
    ssr: SsrDeploymentCheck;
}

export interface StoreWorkspaceValidationResult {
    store: string;
    valid: boolean;
    error?: string;
    invalidUrls: InvalidWorkspaceUrl[];
    deployments: DeploymentValidationResult[];
    deploymentErrors: string[];
    invalidHost?: string;
    expectedHost?: string;
    suggestedFix?: string;
}

type JsonObject = Record<string, unknown>;

type UrlWalkContext = {
    storeRoot: string;
    targetHost: string;
    invalidUrls: InvalidWorkspaceUrl[];
};

function checkUrl(value: string, file: string, path: string, context: UrlWalkContext): void {
    if (!value.startsWith("http://") && !value.startsWith("https://")) return;
    try {
        const url = new URL(value);
        if (url.hostname !== context.targetHost) {
            context.invalidUrls.push({file: relative(context.storeRoot, file), path, url: value});
        }
    } catch {
        // Not a valid URL.
    }
}

function walkValue(value: unknown, file: string, path: string, context: UrlWalkContext): void {
    if (typeof value === "string") {
        checkUrl(value, file, path, context);
        return;
    }
    if (Array.isArray(value)) {
        value.forEach((item, index) => walkValue(item, file, `${path}[${index}]`, context));
        return;
    }
    if (value !== null && typeof value === "object") {
        for (const [key, child] of Object.entries(value)) {
            walkValue(child, file, path ? `${path}.${key}` : key, context);
        }
    }
}

export class StoreWorkspaceValidator {
    private readonly repositoryRoot: string;

    constructor(repositoryRoot: string) {
        this.repositoryRoot = repositoryRoot;
    }

    validate(store: string, targetSiteUrl: string): StoreWorkspaceValidationResult {
        const storeRoot = resolve(
            this.repositoryRoot,
            "workspace",
            store,
        );

        if (!existsSync(storeRoot)) {
            return {
                store,
                valid: false,
                error: `Unknown store: ${store}`,
                invalidUrls: [],
                deployments: [],
                deploymentErrors: [],
            };
        }

        const invalidUrls =
            this.validateUrls(storeRoot, targetSiteUrl);

        const {
            deployments,
            errors: deploymentErrors,
        } = this.validateDeployments(storeRoot);

        const result: StoreWorkspaceValidationResult = {
            store,
            valid:
                invalidUrls.length === 0 &&
                deploymentErrors.length === 0 &&
                deployments.every(deployment => deployment.valid),
            invalidUrls,
            deployments,
            deploymentErrors,
        };

        if (invalidUrls.length === 0) {
            return result;
        }

        const invalidHost =
            new URL(invalidUrls[0].url).origin;

        const expectedHost =
            new URL(targetSiteUrl).origin;

        return {
            ...result,
            invalidHost,
            expectedHost,
            suggestedFix: `find workspace/${store} -type f -exec sed -i 's|${invalidHost}|${expectedHost}|g' {} +`,
        };
    }

    private validateDeployments(
        storeRoot: string,
    ): {
        deployments: DeploymentValidationResult[];
        errors: string[];
    } {
        const manifestsRoot = join(storeRoot, "manifests");

        if (!existsSync(manifestsRoot)) {
            return {
                deployments: [],
                errors: ["Deployment manifest directory is missing."],
            };
        }

        const manifestFiles = readdirSync(manifestsRoot)
            .filter(file => file.endsWith(".json"))
            .sort((a, b) => a.localeCompare(b));

        if (manifestFiles.length === 0) {
            return {
                deployments: [],
                errors: ["No deployment manifests were found."],
            };
        }

        return {
            deployments: manifestFiles.map(file =>
                this.validateDeployment(
                    storeRoot,
                    join(manifestsRoot, file),
                )
            ),
            errors: [],
        };
    }

    private validateDeployment(storeRoot: string, manifestPath: string): DeploymentValidationResult {
        const instance = basename(manifestPath, ".json");
        const manifestErrors: string[] = [];
        const manifest = this.readJsonObject(manifestPath, manifestErrors);
        const manifestCheck = this.validateManifest(instance, manifestPath, manifest, manifestErrors);

        if (!manifest || !manifestCheck.valid) return this.blockedDeployment(instance, manifestCheck);

        const widget = manifest.widget as string;
        const src = manifest.src as string;
        const release = this.validateRelease(manifest, widget, src);
        const ssr = this.validateSsr(storeRoot, instance, manifest);
        return {
            instance,
            widget,
            valid: release.valid && ssr.valid,
            manifest: manifestCheck,
            release,
            ssr,
        };
    }

    private validateManifest(
        instance: string,
        manifestPath: string,
        manifest: JsonObject | null,
        errors: string[],
    ): DeploymentCheck {
        if (manifest && manifest.id !== instance) {
            errors.push(`Manifest id "${String(manifest.id)}" does not match instance "${instance}".`);
        }
        if (manifest && (typeof manifest.widget !== "string" || manifest.widget.length === 0)) {
            errors.push("Manifest widget is missing.");
        }
        if (manifest && (typeof manifest.src !== "string" || manifest.src.length === 0)) {
            errors.push("Manifest src is missing.");
        }
        return {valid: errors.length === 0, path: relative(this.repositoryRoot, manifestPath), errors};
    }

    private blockedDeployment(instance: string, manifest: DeploymentCheck): DeploymentValidationResult {
        const blocked = ["Cannot validate deployment artifacts without a valid manifest."];
        return {
            instance,
            valid: false,
            manifest,
            release: {valid: false, path: "", errors: blocked},
            ssr: {required: false, valid: false, path: "", errors: blocked, artifacts: []},
        };
    }

    private validateRelease(manifest: JsonObject, widget: string, src: string): DeploymentCheck {
        const releaseRoot = resolve(this.repositoryRoot, "workspace", "release", "source", widget);
        const errors: string[] = [];
        const files: string[] = [];
        if (!existsSync(releaseRoot)) {
            errors.push("Release directory is missing.");
            return {valid: false, path: relative(this.repositoryRoot, releaseRoot), errors, files};
        }

        this.validateReleaseSources(releaseRoot, manifest, src, files, errors);
        this.validateBuildManifest({releaseRoot, manifest, widget, src, files, errors});
        return {valid: errors.length === 0, path: relative(this.repositoryRoot, releaseRoot), errors, files};
    }

    private validateReleaseSources(
        releaseRoot: string,
        manifest: JsonObject,
        src: string,
        files: string[],
        errors: string[],
    ): void {
        const sourcePath = join(releaseRoot, src);
        files.push(relative(this.repositoryRoot, sourcePath));
        if (!existsSync(sourcePath)) errors.push(`Release source is missing: ${src}`);

        if (typeof manifest.css !== "string" || manifest.css.length === 0) return;
        const cssPath = join(releaseRoot, manifest.css);
        files.push(relative(this.repositoryRoot, cssPath));
        if (!existsSync(cssPath)) errors.push(`Release CSS is missing: ${manifest.css}`);
    }

    private validateBuildManifest(options: {
        releaseRoot: string;
        manifest: JsonObject;
        widget: string;
        src: string;
        files: string[];
        errors: string[];
    }): void {
        const {releaseRoot, manifest, widget, src, files, errors} = options;
        const manifestPath = join(releaseRoot, `widget-${widget}.manifest.json`);
        files.push(relative(this.repositoryRoot, manifestPath));
        if (!existsSync(manifestPath)) {
            errors.push("Release build manifest is missing.");
            return;
        }

        const manifestErrors: string[] = [];
        const buildManifest = this.readJsonObject(manifestPath, manifestErrors);
        errors.push(...manifestErrors);
        if (!buildManifest) return;
        if (buildManifest.filename !== src) {
            errors.push(`Release build manifest filename "${String(buildManifest.filename)}" does not match deployment src "${src}".`);
        }
        const deployedCss = typeof manifest.css === "string" ? manifest.css : undefined;
        const releaseCss = typeof buildManifest.cssFilename === "string" ? buildManifest.cssFilename : undefined;
        if (deployedCss !== releaseCss) {
            errors.push(`Release CSS "${String(releaseCss)}" does not match deployment CSS "${String(deployedCss)}".`);
        }
    }

    private validateSsr(
        storeRoot: string,
        instance: string,
        manifest: JsonObject,
    ): SsrDeploymentCheck {
        const ssr =
            manifest.ssr !== null &&
            typeof manifest.ssr === "object"
                ? manifest.ssr as JsonObject
                : undefined;

        const strategy =
            typeof ssr?.strategy === "string"
                ? ssr.strategy
                : "disabled";

        const required = strategy !== "disabled";
        const ssrRoot = join(storeRoot, "ssr", instance);

        if (!required) {
            return {
                required: false,
                valid: true,
                path: relative(this.repositoryRoot, ssrRoot),
                errors: [],
                artifacts: [],
            };
        }

        const errors: string[] = [];

        if (!existsSync(ssrRoot)) {
            errors.push("SSR directory is missing.");

            return {
                required: true,
                valid: false,
                path: relative(this.repositoryRoot, ssrRoot),
                errors,
                artifacts: [],
            };
        }

        const artifacts = readdirSync(ssrRoot)
            .filter(file => file.startsWith("output") && file.endsWith(".json"))
            .sort((a, b) => a.localeCompare(b));

        if (artifacts.length === 0) {
            errors.push("No SSR output artifacts were found.");
        }

        for (const artifact of artifacts) {
            const artifactPath = join(ssrRoot, artifact);
            const artifactErrors: string[] = [];
            const content = this.readJsonObject(
                artifactPath,
                artifactErrors,
            );

            errors.push(
                ...artifactErrors.map(error => `${artifact}: ${error}`),
            );

            if (!content) {
                continue;
            }

            if (typeof content.html !== "string") {
                errors.push(`${artifact}: SSR html is missing.`);
            }
        }

        return {
            required: true,
            valid: errors.length === 0,
            path: relative(this.repositoryRoot, ssrRoot),
            errors,
            artifacts,
        };
    }

    private readJsonObject(
        file: string,
        errors: string[],
    ): JsonObject | null {
        try {
            const value: unknown = JSON.parse(
                readFileSync(file, "utf8"),
            );

            if (value === null || typeof value !== "object" || Array.isArray(value)) {
                errors.push("Expected a JSON object.");
                return null;
            }

            return value as JsonObject;
        } catch (error) {
            errors.push(
                error instanceof Error
                    ? error.message
                    : "Unable to read JSON file.",
            );
            return null;
        }
    }

    private validateUrls(storeRoot: string, targetSiteUrl: string): InvalidWorkspaceUrl[] {
        const context = {
            storeRoot,
            targetHost: new URL(targetSiteUrl).hostname,
            invalidUrls: [] as InvalidWorkspaceUrl[],
        };
        const walkDirectory = (directory: string): void => {
            for (const entry of readdirSync(directory, {withFileTypes: true})) {
                const entryPath = join(directory, entry.name);
                if (entry.isDirectory()) {
                    walkDirectory(entryPath);
                    continue;
                }
                if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
                const content = JSON.parse(readFileSync(entryPath, "utf8"));
                walkValue(content, entryPath, "", context);
            }
        };
        walkDirectory(storeRoot);
        return context.invalidUrls;
    }

}
