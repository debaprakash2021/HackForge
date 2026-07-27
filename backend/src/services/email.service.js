import transporter from "../config/mail.js";

export const sendEmailService = async ({
  to,
  subject,
  html,
}) => {

  return await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};