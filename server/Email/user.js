/* eslint-disable max-len */
/* eslint linebreak-style: ["error", "windows"] */

import hat from 'hat';
import Mail from './Mail';
import env from '../../env';
import db from '../../config/db';

const debug = require('debug')('trelloClone:Email/User');

class UserEmail {
  registration(userDetail) {
    const token = hat() + Date.now();
    const content = `<p>Hello ${userDetail.first_name}</p>
  <br/>
  <p>Congratulations !! Your account has been created.</p>
  <p>Please click on the below link for verifying your account</p>
  <p><a href=${env.DOMAIN_IP}users/${token}>Verify Email</a></p>
  <br/>
  <p>
  Best Regards,<br/>
  Trello Clone
  </p>`;
    const mailDetail = {
      name: userDetail.first_name,
      from: env.MAIL_ID,
      to: userDetail.email,
      subject: 'Welcome To Trello',
      text: 'Trello',
      html: content
    };
    Mail(mailDetail, (response) => {
      if (response.status === true) {
        this.verificationToken(userDetail.user_id, token);
      }
    });
  }

  inviteUser(email, invitedBy, token) {
    const content = `<p>Hello</p>
  <br/>
  <p>You are invited by ${invitedBy} to a board.</p>
  <p>Please click on the below link for accepting the invitation</p>
  <p><a href=${env.DOMAIN_IP}users/invite/${token}>Accepting Invitation</a></p>
  <br/>
  <p>
  Best Regards,<br/>
  Trello Clone
  </p>`;
    const mailDetail = {
      name: email,
      from: env.MAIL_ID,
      to: email,
      subject: 'Invitation to Trello',
      text: 'Trello',
      html: content
    };
    Mail(mailDetail, (response) => {
      if (response.status === true) {
        this.verificationToken(userDetail.user_id, token);
      }
    });
  }

  async verificationToken(userId, token) {
    await db.Users.update({
      verification_token: token
    }, {
      where: {
        user_id: userId
      }
    });
  }
}
export default UserEmail;
