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

	const response = await fetch(url, {
		method: 'POST',
	});
	const data = await response.json() as NewResponse;

	return data;
};

/**
 * Fetch emails from the temp-mail.io service using the email address
 *
 * @param email email address
 * @returns list of emails
 */
export const fetchEmails = async (email: string) => {
	const url = `${BASE_API}/api/v3/email/${email}/messages`;
	const response = await fetch(url);
	const data = await response.json()

	if (data.code === 101) {
		throw new Error('Email not found');
	}

	const transformedResponse = (data as FetchEmailsPureResponse[]).map(
		email =>
			({
				...email,
				bodyText: email.body_text,
				bodyHtml: email.body_html,
				createdAt: new Date(email.created_at),
				attachments: email.attachments.map(attachment => ({
					name: attachment.name,
					size: attachment.size,
					id: attachment.id,
					url: `${BASE_API}/api/v3/attachment/${attachment.id}?download=1`,
				})),
			}) as FetchEmailsResponse,
	);

	return transformedResponse;
};

/**
 * Fetch emails from the temp-mail.io service using the email address with a timeout
 *
 * @param email email address
 * @param expectedEmails expected number of emails
 * @param timeout timeout in milliseconds
 * @returns list of emails
 */
export const fetchEmailsWithWait = async (email: string, expectedEmails: number, timeout: number = 30000): Promise<FetchEmailsResponse[]> => {
	let emails: FetchEmailsResponse[] = [];
	let currentTimeout = 0;

	while (emails.length < expectedEmails) {
		emails = await fetchEmails(email);
		await new Promise(resolve => setTimeout(resolve, 1000));
		currentTimeout += 1000;

		if (currentTimeout >= timeout) {
			throw new Error('Timeout while waiting for emails');
		}
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
	await fetch(url, {
		method: 'DELETE',
		body: JSON.stringify({ token }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

/**
 * Get all domains from the temp-mail.io service
 *
 * @returns list of domains
 */
export const getDomains = async () => {
	const url = `${BASE_API}/api/v3/domains`;
	const response = await fetch(url);
	const data = (await response.json()).domains as {
		name: string;
		type: string;
		forward_available: boolean;
		forward_max_seconds: number;
	}[];

	return data.map(domain => ({
		name: domain.name,
		type: domain.type,
		forwardAvailable: domain.forward_available,
		forwardMaxSeconds: domain.forward_max_seconds,
	}));
};
