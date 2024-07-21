import { newEmail, fetchEmails, deleteEmail } from '../src';

const start = async (): Promise<void> => {
	console.log("Creating new email")
	const r = await newEmail();
	console.log(r)

	console.log("Fetching emails")
	const emails = await fetchEmails(r.email);
	console.log(emails)

	console.log("Deleting email")
	deleteEmail(r.email, r.token);
};

start().catch(console.error);
