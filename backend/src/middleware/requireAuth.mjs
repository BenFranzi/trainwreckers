import jwt from 'jsonwebtoken';
import {default as config} from '../config.mjs';
import { default as User } from '../models/users.mjs';

/**
 * Auth Middleware
 * Used to verify user Auth JWT Token and add user to request body
 */
export default (req, res, next) => {
    const { authorization } = req.headers;

    // Return error if not authorised
    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.' });
    }

    // Get token
    const token = authorization.replace('Bearer ', '');

    // Verify token
    jwt.verify(token, config.JWT.SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' });
        }
        const user = await User.findById(payload._id, ['_id', 'name', 'email', 'role', 'updated_at']);
        // Compare updated at from token with user profile
        req.user = user;
        next();
    });
};