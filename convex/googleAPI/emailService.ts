'use node'

import nodemailer from 'nodemailer';
import { internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { emailsAddresses } from '../../constants/emails';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }, 
});

export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    text: v.optional(v.string()),
    html: v.optional(v.string()),
  },
  handler: async (ctx, { to, subject, text, html }) => {
    await transporter.sendMail({
      from: emailsAddresses.MANAGER_EMAIL,
      to,
      subject,
      text,
      html
    });
  }
});