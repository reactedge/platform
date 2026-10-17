import type {Application} from 'express';
import {setupGolfCourseRoutes} from './golf-course-router';
import {setupStatusRoutes} from './status-router';

export default (app: Application): void => {
    setupStatusRoutes(app);
    setupGolfCourseRoutes(app);
};
