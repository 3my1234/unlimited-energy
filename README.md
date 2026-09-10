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

Keep website assets under a separate `website/` prefix. The authenticated
`/admin` dashboard uploads with short-lived presigned URLs, keeping AWS
credentials on the server. Add every variable from `.env.example` to Coolify.
`SITE_MEDIA_PUBLIC_BASE_URL` must be the HTTPS bucket or CloudFront base URL
without a trailing slash.

Generate `ADMIN_SESSION_SECRET` with:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Give the website IAM user only `s3:GetObject` and `s3:PutObject` for
`arn:aws:s3:::YOUR_BUCKET/website/*`. Configure S3 CORS to allow `PUT` from
`https://unlimitedenergysystems.com` and
`https://www.unlimitedenergysystems.com`, with `Content-Type` allowed as a
request header. Removing an item in the dashboard does not delete its S3 object.

## Contact email

The site currently directs enquiries to `info@unlimitedenergysystems.com`.
Create that mailbox before launch. Keep credentials for a future contact form
in Coolify environment variables; never commit them to Git.
