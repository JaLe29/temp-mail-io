interface NewResponse {
    email: string;
    token: string;
}
interface FetchEmailsResponse {
    id: string;
    from: string;
    to: string;
    cc: string;
    subject: string;
    bodyText: string;
    bodyHtml: string;
    createdAt: Date;
    attachments: {
        id: string;
        name: string;
        size: number;
        url: string;
    }[];
}
/**
 * Create a new email address using the temp-mail.io service
 *
 * @returns email and token
 */
export declare const newEmail: () => Promise<NewResponse>;
/**
 * Fetch emails from the temp-mail.io service using the email address
 *
 * @param email email address
 * @returns list of emails
 */
export declare const fetchEmails: (email: string) => Promise<FetchEmailsResponse[]>;
/**
 * Delete an email from the temp-mail.io service
 *
 * @param email email address
 * @param token from newEmail response
 */
export declare const deleteEmail: (email: string, token: string) => Promise<void>;
export {};
