import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testSMTP = async () => {
  console.log('Starting SMTP diagnostic test...');
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`SMTP_PASS length: ${process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0} chars`);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('Attempting to verify connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection verified successfully! Credentials are correct.');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER,
      subject: 'VisitHub - SMTP Test Email',
      text: 'This is a diagnostic email from your VisitHub application. If you receive this, SMTP is working perfectly!',
    });

    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('❌ SMTP DIAGNOSTIC FAILED!');
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    if (error.code) console.error(`Error code: ${error.code}`);
    if (error.command) console.error(`Failed SMTP command: ${error.command}`);
    if (error.response) console.error(`SMTP response: ${error.response}`);
    console.error('\nTroubleshooting advice:');
    console.error('1. Double check that your Gmail address matches SMTP_USER in server/.env exactly.');
    console.error('2. Make sure the 16-character App Password (SMTP_PASS) has no typos.');
    console.error('3. Check your Gmail inbox for a "Suspicious sign-in blocked" email from Google and authorize it.');
  }
};

testSMTP();
