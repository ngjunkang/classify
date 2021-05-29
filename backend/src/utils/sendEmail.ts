import nodemailer from "nodemailer";
import "dotenv-safe/config";

interface sendEmailProps {
  subject: string;
  to: string;
  body: string;
}

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail({ subject, to, body }: sendEmailProps) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Classify" <classify.page@gmail.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: body, // plain text body
  });
}

export default sendEmail;
