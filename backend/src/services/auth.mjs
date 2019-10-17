import jwt from 'jsonwebtoken';
import { default as User, UserRole, getRole } from '../models/users.mjs';
import {default as config} from '../config.mjs';

/**
 * Auth Service
 * Service functions for Auth routes
 */


/**
 * Is Authorised
 * Check if a user is authorised
 * @param email 
 * @param password 
 * @param cb
 */
export const isAuthorised = async (email, password, cb) => {

    // Find the user
    return User.findOne({email}, async (err, user) => {
        if (!!user) {
            // Check their password
            const result = await user.validatePassword(password);
            return cb(result);
        }
        return cb(false);
    })
};

/**
 * Make Token with email
 * Make token using email address
 * @param email 
 * @param cb 
 */
export const makeTokenWithEmail = (email, cb) => {
    // Find the user
    User.findOne({email}, async (err, user) => {
        if (!user) {
            // If not found, return nothing
            return cb(null);
        } else {
            // Make the token
            return cb(jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    updated_at: user.updated_at,
                    role: user.role
                },
                config.JWT.SECRET,
                {expiresIn: config.JWT.TIMEOUT},
            ));
        }

        
    });
    
 };

/**
 * Verify Token
 * Used to verify token
 * @param token JWT auth token
 */
export const verifyToken = (token) =>{
    jwt.verify(token, config.JWT.SECRET, function(err, decoded) {
        return err;
    });
}