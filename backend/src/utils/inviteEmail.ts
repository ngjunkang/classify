import "dotenv-safe/config";

interface InviteEmailProps {
  username: string;
  slug: string;
  groupName: string;
}

function inviteEmail({ username, slug, groupName }: InviteEmailProps): string {
  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Classify Clique Invite</title>
    </head>
    <body>
      <div>
          <h1>Hello ${username},</h1>
          <h3>You are invited to ${groupName}</h3>
          <a href="${process.env.CORS_ORIGIN}/login?next=/class/cliques/${slug}">Click here to join clique</a>
      </div>
    </body>
  </html>
  `;
}

export default inviteEmail;
