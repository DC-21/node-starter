import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
}

export function generateOtp(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export const generateTokens = (id: string) => {
  const accessToken = jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: "7d",
  });
  const refreshToken = jwt.sign({ id }, `${process.env.JWT_REFRESH}`, {
    expiresIn: "14d",
  });
  return { accessToken, refreshToken };
};
