const decodeJWT = require('./utils/decodeJWT');

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = decodeJWT(token);

            if (!decoded) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if(decoded.role !== role) {
                return res.status(403).json({message: 'No access'})
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized" })
        }
    }
}

