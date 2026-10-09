import type {Application} from 'express';
import {setupJsonBodyParse} from './jsonParser';

export default function setupAccess(app: Application): void {
    setupJsonBodyParse(app);
}
