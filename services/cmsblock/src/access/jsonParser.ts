import type {Application} from 'express';
import express from 'express';

export function setupJsonBodyParse(app: Application): void {
    app.use(express.json({limit: '120kb'}));
}
