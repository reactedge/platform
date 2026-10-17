import type {Application} from 'express';
import {setupJsonBodyParse} from './jsonParser.js';

export default (app: Application): void => {
    setupJsonBodyParse(app);
};
