import nodemailer from 'nodemailer';
import env from '../../env';

const debug = require('debug')('trelloClone:Email/Mail');

function Mail(mailDetail, cb) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 25,
    auth: {
      user: env.MAIL_ID,
      pass: env.MAIL_PASS
    }
  });
  const mailOptions = {
    from: mailDetail.from,
    to: mailDetail.to,
    bcc: mailDetail.bcc,
    subject: mailDetail.subject,
    text: mailDetail.text,
    html: mailDetail.html
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      const msg = {
        status: false
      };
      return cb(msg);
    }
    const msg = {
      status: true
    };
    debug('Message %s sent: %s', info.messageId, info.response);
    return cb(msg);
  });
}

export default Mail;
