import axios from 'axios';

interface NewResponse {
	email: string;
	token: string;
}

interface FetchEmailsPureResponse {
	id: string;
	from: string;
	to: string;
	cc: string;
	subject: string;
	body_text: string;
	body_html: string;
	created_at: string;
	attachments: { id: string; name: string; size: number }[];
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
	attachments: { id: string; name: string; size: number; url: string }[];
}

const BASE_API = 'https://api.internal.temp-mail.io';

/**
 * Create a new email address using the temp-mail.io service
 *
 * @returns email and token
 */
export const newEmail = async () => {
	const url = `${BASE_API}/api/v3/email/new`;

	const data = await axios.post(url);
	const response = data.data as NewResponse;

	return response;
};

/**
 * Fetch emails from the temp-mail.io service using the email address
 *
 * @param email email address
 * @returns list of emails
 */
export const fetchEmails = async (email: string) => {
	const url = `${BASE_API}/api/v3/email/${email}/messages`;
	const data = await axios.get(url);
	const response = data.data as FetchEmailsPureResponse[];
	const transformedResponse = response.map(
		email =>
			({
				...email,
				bodyText: email.body_text,
				bodyHtml: email.body_html,
				createdAt: new Date(email.created_at),
				attachments: email.attachments.map(attachment => ({
					...attachment,
					url: `${BASE_API}/api/v3/attachment/${attachment.id}?download=1`,
				})),
			}) as FetchEmailsResponse,
	);

	return transformedResponse as FetchEmailsResponse[];
};

/**
 * Fetch emails from the temp-mail.io service using the email address with a timeout
 *
 * @param email email address
 * @param expectedEmails expected number of emails
 * @param timeout timeout in milliseconds
 * @returns list of emails
 */
export const fetchEmailsWithWait = async (email: string, expectedEmails: number, timeout: number = 30000) => {
	let emails: FetchEmailsResponse[] = [];
	let currentTimeout = 0;
	while (emails.length < expectedEmails && currentTimeout < timeout) {
		emails = await fetchEmails(email);
		await new Promise(resolve => setTimeout(resolve, 1000));
		currentTimeout += 1000;
	}

	return emails;
};

/**
 * Delete an email from the temp-mail.io service
 *
 * @param email email address
 * @param token from newEmail response
 */
export const deleteEmail = async (email: string, token: string) => {
	const url = `${BASE_API}/api/v3/email/${email}`;
	await axios.delete(url, { data: { token } });
};
