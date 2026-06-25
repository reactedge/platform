import { SitemapEntry } from "./types";

export class SitemapReader {
    async read(siteMapUrl: string): Promise<SitemapEntry[]> {
        let xml: string;

        try {

            const response = await fetch(siteMapUrl);

            if (!response.ok) {
                throw new Error(
                    `Unable to fetch sitemap: ${response.status}`
                );
            }

            xml = await response.text();

        } catch (e) {

            throw new Error(
                `Failed to retrieve sitemap: ${e instanceof Error ? e.message : e
                }`
            );
        }

        const matches =
            [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];

        if (matches.length === 0) {
            throw new Error(
                'No URLs found in sitemap.'
            );
        }

        return matches.map(match => {

            const url = match[1];

            return {
                id: this.extractId(url),
                url,
                label: this.extractLabel(url)
            };

        });
    }

    private extractLabel(
        url: string
    ): string {

        const pathname =
            new URL(url).pathname;

        const segments =
            pathname
                .split('/')
                .filter(Boolean);

        if (segments.length === 0) {
            return 'home';
        }

        return segments
            .at(-1)!
            .replace('.html', '');
    }

    private extractId(url: string): string {

        const pathname =
            new URL(url).pathname;

        if (pathname === '/') {
            return 'home';
        }

        return pathname
            .replace(/^\/+/, '')
            .replace(/\.html$/, '');
    }
}