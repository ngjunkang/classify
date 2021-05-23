import nodemailer from "nodemailer";

interface sendEmailProps {
  subject: string;
  to: string;
  body: string;
}

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(email: sendEmailProps) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "classify.page@gmail.com", // generated ethereal user
      pass: "postgres", // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Classify" <classify.page@gmail.com>', // sender address
    to: email.to, // list of receivers
    subject: email.subject, // Subject line
    html: email.body, // plain text body
  });
}

export default sendEmail;
