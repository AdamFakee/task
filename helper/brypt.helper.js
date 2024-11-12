const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUND);

module.exports.genPass = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return {salt, hash};
}

module.exports.comparePass = (passwordInput, passwordInDB, salt) => {
    const hash = bcrypt.hashSync(passwordInput, salt);
    return hash == passwordInDB;
}