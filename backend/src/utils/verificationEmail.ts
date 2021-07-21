import "dotenv-safe/config";

interface VerificationEmailProps {
  username: string;
  token: string;
}

function verificationEmail({
  username,
  token,
}: VerificationEmailProps): string {
  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Classify Verify Email</title>
    </head>
    <body>
      <div>
          <h1>Hello ${username},</h1>
          <a href="${process.env.CORS_ORIGIN}/verify-email/${token}">Click here to verify your email</a>
      </div>
    </body>
  </html>
  `;
}

export default verificationEmail;
