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

## S3-managed website media

Set `SITE_MEDIA_MANIFEST_URL` in Coolify to the public HTTPS URL of a JSON
manifest stored in S3 or served through CloudFront. Use
`docs/site-media.example.json` as the schema. The site refreshes that manifest
about every five minutes, so replacing the referenced media and updating the
manifest does not require a new deployment.

Keep website assets under a separate `website/` prefix. The site only needs
public read URLs; never provide AWS access keys to the browser. Perform uploads
through the AWS console or a separately authenticated presigned-upload tool.

## Contact email

The site currently directs enquiries to `info@unlimitedenergysystems.com`.
Create that mailbox before launch. Keep credentials for a future contact form
in Coolify environment variables; never commit them to Git.
