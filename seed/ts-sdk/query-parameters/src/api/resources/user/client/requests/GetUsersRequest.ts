/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface GetUsersRequest {
    limit: number;
    id: string;
    date: string;
    deadline: Date;
    bytes: string;
    optionalString?: string;
    filter: string | string[];
}
