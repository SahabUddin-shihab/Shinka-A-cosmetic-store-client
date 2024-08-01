import mailer from "nodemailer";
import prisma from "../config/db.config.js";

const mail_credentials = await prisma.email.findFirst({});

const send_mail = () => mailer.createTransport({
  service: 'gmail',
  auth: {
    user: mail_credentials.smtp_username,
    pass: mail_credentials.smtp_password
  }
});
export default send_mail;
