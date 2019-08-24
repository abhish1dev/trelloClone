import jwt from 'jsonwebtoken';
import settings from '../../env';

const debug = require('debug')('trelloClone:Helpers/AuthJWT');

class Auth {
    constructor() {
        this.tokenKey = settings.APP_SECRET;
        this.tokenOptions = {
          expiresIn: settings.TOKEN_LIFE
        };
        this.payload = null;
    }

    generateToken() {
        const token = jwt.sign(this.payload, this.tokenKey, this.tokenOptions);
        debug(token);
        const returnData = {
          token: `JWT ${token}`
        };
        return returnData;
    }
}

export default Auth;
