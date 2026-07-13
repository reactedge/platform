import { ZodError } from 'zod';
import {HealthIssue} from "../types";

export function mapZodError(error: ZodError): HealthIssue[] {
    return error.issues.map(issue => {

        switch (issue.code) {

            case 'too_big':
                return {
                    type: 'string.max_length',
                    target: issue.path.join('.'),
                    details: {
                        maximum: issue.maximum
                    }
                };

            case 'invalid_type':
                return {
                    type: 'type.invalid',
                    target: issue.path.join('.'),
                    details: {
                        expected: issue.expected
                    }
                };

            default:
                return {
                    type: 'validation.failed',
                    target: issue.path.join('.'),
                    details: {
                        code: issue.code
                    }
                };
        }
    });
}