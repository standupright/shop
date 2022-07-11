const jwt = require('jsonwebtoken');

module.exports = function (token) {
    if (!token) {
        return undefined;
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
}
