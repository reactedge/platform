import express from 'express';
import type {Application} from 'express';
import path from 'node:path';
import {mkdir, realpath} from 'node:fs/promises';
import {config} from '../config';

export const storageDirectory = (): string => {
    if (!config.cdnFolder || path.isAbsolute(config.cdnFolder) || config.cdnFolder.split(/[\\/]/).includes('..')) {
        throw new Error('CDN_FOLDER must be a relative folder inside ROOT_DIR.');
    }
    const directory = path.resolve(config.rootDir, config.cdnFolder);
    if (directory === path.resolve(config.rootDir)) throw new Error('CDN_FOLDER must name a storage folder.');
    return directory;
};

export const prepareStorageAccess = async (): Promise<string> => {
    const root = await realpath(config.rootDir);
    const directory = storageDirectory();
    let current = root;
    for (const segment of path.relative(path.resolve(config.rootDir), directory).split(path.sep)) {
        const next = path.join(current, segment);
        try { await mkdir(next); }
        catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; }
        current = await realpath(next);
        const relative = path.relative(root, current);
        if (!relative || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
            throw new Error('Storage folder must stay inside ROOT_DIR.');
        }
    }
    return current;
};

export const setupStaticFileAccess = (app: Application): void => {
    // The API and static access share this configured directory, as in cache-warmer.
    app.use(`/${config.cdnFolder}`, express.static(app.locals.storageDirectory as string, {
        index: false,
        dotfiles: 'deny',
        setHeaders: response => { response.setHeader('Cache-Control', 'no-store'); },
    }));
};
