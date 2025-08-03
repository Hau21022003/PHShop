import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export default class EmailHelper {
  static sendMail = async (
    email: string,
    subject: string,
    data_html: string,
    data_text: string = '',
  ) => {
    const msg = {
      to: email,
      from: `"Chatbot Project" <${process.env.MAIL_FROM}>`,
      subject: subject,
      text: data_text,
      html: data_html,
    };
    return new Promise((resolve, reject) => {
      const settings = {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        port: 465,
        secure: true,
        tls: {
          rejectUnauthorized: false,
        },
      };
      const transporter = nodemailer.createTransport(settings);

      transporter.sendMail(msg, (error, response) => {
        transporter.close();
        if (error) {
          Logger.error(error);
          //resolve(false);
          reject(error);
        } else {
          resolve(true);
          //reject(false)
        }
      });
    });
  };
}
