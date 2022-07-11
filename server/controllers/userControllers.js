const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../error/ApiError');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
}

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, role } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Email or password are incorrect'));
            }

            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return next(ApiError.badRequest('User with this email is already registered'));
            }

            const hashPassword = await bcrypt.hash(password, 5);

            const user = await User.create({ email, role, password: hashPassword });
            const basket = await Basket.create({ userId: user.id });

            const token = generateJwt(user.id, user.email, user.role);

            return res.json({ token: token });
        } catch (error) {
            return next(ApiError.badRequest(error));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.internal('User not found'));
            }

            const comparePassword = bcrypt.compareSync(password, user.password);

            if (!comparePassword) {
                return next(ApiError.internal('Password is not correct'));
            }

            const token = generateJwt(user.id, user.email, user.role);

            return res.json({ token: token });
        } catch (error) {
            return next(ApiError.badRequest(error));
        }
    }

    async getUser(req, res, next) {
        const user = req.user;
        return res.json({
            id: user.id,
            email: user.email,
            role: user.role,
        })
    }
};

module.exports = new UserController();
