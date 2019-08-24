/** helpers */
import Encrypt from './Encrypt';

const debug = require('debug')('trelloClone:Helpers/Auth');

class PasswordManager {
    constructor() {
        this.inputedPassword = null;
        this.salt = null;
        this.existingPassword = null;
        this.txtPassword = null;
    }
    
    /**
    * Verifies the inputedPassword with the existingPassword
    * @param {*} existingPassword
    * @param {*} salt
    * @param {*} inputedPassword
    * @return Boolean
    */
    verifyPassword() {
        const self = this;
        const encrypt = new Encrypt(self.inputedPassword);
        return encrypt.verifyPassword(self.salt, self.existingPassword);
    }

    /**
    * Creates the password hash and salt
    * @param {*} txtPassword
    * @return JSON Object passwordObject
    */
    createPasswordHash() {
        const self = this;
        const encrypt = new Encrypt(self.txtPassword);
        const passwordStr = encrypt.hashPassword();
        const hashedPassword = passwordStr.passwordHash;
        const salt = passwordStr.salt;
        const passwordObject = {
          password: hashedPassword,
          salt
        };
        return passwordObject;
    }
}

export default PasswordManager;
