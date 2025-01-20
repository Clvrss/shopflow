const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isEmail(value) {
  return typeof value === 'string' && EMAIL_REGEX.test(value);
}

function isStrongPassword(value) {
  return typeof value === 'string' && value.length >= 8;
}

module.exports = { isEmail, isStrongPassword, EMAIL_REGEX };
