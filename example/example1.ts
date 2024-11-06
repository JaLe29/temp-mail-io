import { newEmail, fetchEmails, deleteEmail } from '../src';

const start = async (): Promise<void> => {
	console.log("Creating new email")
	const r = await newEmail();
	console.log(r)

	console.log("Fetching emails")
	// or you can use await fetchTempEmailsWithWait(tempEmail.email, 1, 30000) to wait for the email
	const emails = await fetchEmails(r.email);
	console.log(emails)

	console.log("Deleting email")
	deleteEmail(r.email, r.token);

	try {
		 await fetchEmails(r.email);
	} catch (e) {
		if (e.toString().includes('Email not found')) {
			console.log('Email not found, that is good! Because we deleted it.')
		} else {
			console.error(e)
		}
	}
};

start().catch(console.error);
