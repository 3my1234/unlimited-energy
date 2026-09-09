# Unlimited Energy Systems

Public website for Unlimited Energy Systems Limited.

## Local development

Requires Node.js 22.13 or newer.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production check

```powershell
npm run build
npm run start
```

## Coolify deployment

Use the **Dockerfile** build pack with branch `main`, Dockerfile `/Dockerfile`,
and exposed port `3000`. Add both `https://unlimitedenergysystems.com` and
`https://www.unlimitedenergysystems.com`. The image includes a health check
using `/api/health` and listens on `0.0.0.0:3000`.

## Contact email

The site currently directs enquiries to `info@unlimitedenergysystems.com`.
Create that mailbox before launch. Keep credentials for a future contact form
in Coolify environment variables; never commit them to Git.
