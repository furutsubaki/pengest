import type { ZodIssue } from 'zod';

export const createResponse = (response: object, statusCode = 200) => {
    return new Response(JSON.stringify(response), { status: statusCode });
};

interface Error {
    [key: string]: string | boolean | undefined;
    message: string;
}

export const createBadRequest = (errors: Error[] | ZodIssue[]) => {
    const response = {
        errors,
    };
    return createResponse(response, 400);
};
export const createInvalidCredentials = (errors: Error[] | ZodIssue[]) => {
    const response = {
        errors,
    };
    return createResponse(response, 401);
};
export const createNotFound = (errors: Error[] | ZodIssue[]) => {
    const response = {
        errors,
    };
    return createResponse(response, 404);
};

export const createInternalServerError = (errors: Error[] | ZodIssue[]) => {
    const response = {
        errors,
    };
    return createResponse(response, 500);
};
