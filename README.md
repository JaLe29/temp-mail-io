# 📧 temp-mail-io

[![npm version](https://badge.fury.io/js/temp-mail-io.svg)](https://badge.fury.io/js/temp-mail-io)

temp-mail-io is a powerful Node.js/Typescript application that harnesses the API of [temp-mail.io](https://temp-mail.io/) to provide a seamless temporary email experience. With just a few lines of code, you can create disposable email addresses, retrieve messages with attachments, and delete accounts effortlessly.

## ✨ Features

- 🔮 Generate temporary email addresses on the fly
- 📥 Fetch incoming emails, including attachments
- 🗑️ Clean up by deleting temporary accounts
- 🚀 Fast and efficient API integration
- 🛡️ Privacy-focused solution for testing and verification purposes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
   ```
   npm install temp-mail-io
   ```

### Usage

```javascript
import { newEmail, fetchEmails, deleteEmail } from 'temp-mail-io';

async function main() {
	console.log("Creating new email")
	const r = await newEmail();
	console.log(r)

	console.log("Fetching emails")
	// or you can use await fetchTempEmailsWithWait(tempEmail.email, 1, 30000) to wait for the email
	const emails = await fetchEmails(r.email);
	console.log(emails)

	console.log("Deleting email")
	deleteEmail(r.email, r.token);
}

main().catch(console.error);
```

## 🤝 Contributing

We welcome contributions!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [temp-mail.io](https://temp-mail.io/) for providing the awesome API
- All the contributors who have helped shape temp-mail-io

---

Made with ❤️ by JaLe