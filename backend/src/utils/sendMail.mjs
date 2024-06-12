import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Retrieve MAIL_SERVER, MAIL_USERNAME, and MAIL_PASSWORD from environment variables
const { MAIL_SERVER, MAIL_USERNAME, MAIL_PASSWORD } = process.env;

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  host: MAIL_SERVER,
  port: 587,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Error verifying transporter:', error);
  } else {
    console.log('Transport is ready.');
    console.log(success);
  }
});

// Function to send email
const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email. Please try again later.');
  }
};

export default sendEmail;
