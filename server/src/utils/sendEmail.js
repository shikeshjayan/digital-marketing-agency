import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  ...(process.env.NODE_ENV !== "production" && {
    tls: { rejectUnauthorized: false },
  }),
});

const sendEmail = async ({ to, subject, html }) => {

  try {
    const info = await transporter.sendMail({
      from: `"Digital Marketing Agency" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent successfully! Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Nodemailer failed to send email:", error.message);
    throw error;
  }
};

export default sendEmail;
