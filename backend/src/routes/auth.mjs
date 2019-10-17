import express from 'express';
import checkAPIs from 'express-validator';
import * as AuthService from '../services/auth.mjs';
import requireAuth from '../middleware/requireAuth.mjs';
const { check, validationResult } = checkAPIs;

/**
 * Auth Route
 * Handles all authorisation requests
 */

const router = express.Router();

/**
 * Refresh
 * Used to renew a token using a previous unexpired token. 
 * Expecting token in Auth header.
 */
router.post('/refresh', requireAuth,
async (req, res) => {
    // Make token
    const token = AuthService.makeTokenWithEmail(req.user.email, (token) => {
        if (!token) {
            // Send token
            return res.status(401).send({
                error: 'token could not be generated'
            });
        } else {
            // If makeTokenWithEmail failed, the user is not authorised, return error
            return res.status(200).send({
                message: 'success', 
                token: token
            });
        }
    });   
});

/**
 * Login
 * Handles login and confirming user information.
 * Expects Email and Password from user
 */
router.post('/login', 
[
    check('email').isEmail(),
    check('password').isLength({ min: 5 })
], 
async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            error: 'invalid username or password',
        });
    }    

    // Check if the provided user details are authorised
    await AuthService.isAuthorised(req.body.email, req.body.password, async (isAuthorised) => {
        if (!isAuthorised) {
            return res.status(400).send({
                error: 'incorrect credentials',
            });
        } else {
            // User verification was successful, return auth token
            const token = await AuthService.makeTokenWithEmail(req.body.email, (token) => {
                if (!token) {
                    return res.status(500).send({
                        error: 'failed to make token'
                    });
                } else {
                    return res.status(200).send({
                        token: token
                    });
                }
            });
            
        }
    }); 
});

export default router;