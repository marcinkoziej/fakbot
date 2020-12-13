# Fakbot - the Faktura (Invoice) bot

This is a bot that fetches invoices from services. 🤖  🧾

It exists because providers suck and do not send invoices via email, nor provide APIs to get them.

If you are annoyed to click through every month to fetch invoice PDFs - fakbot is for you.


## Usage

Install it:
```
npm i fakbot@0.1.0-beta.1
```

Run with:
```
fakbot [options] [servicename]
```

### Options:

- `-u` - username, can also be provided with FOO_USERNAME for foo service
- `-p` - password, can also be provided with FOO_PASSWORD for foo service
- `-s` - show the automated browser window
- `-v` - verbose logging

Supported service names are:
- innogy
- pgnig
