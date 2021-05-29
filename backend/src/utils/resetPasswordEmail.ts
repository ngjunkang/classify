interface ResetPasswordEmailProps {
  username: string;
  token: string;
}

function resetPasswordEmail({
  username,
  token,
}: ResetPasswordEmailProps): string {
  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Classify Reset Password</title>
    </head>
    <body>
      <div>
          <h1>Hello ${username},</h1>
          <a href="${process.env.CORS_ORIGIN}/reset-password/${token}">Click here to reset password</a>
      </div>
    </body>
  </html>
  `;
}

export default resetPasswordEmail;
