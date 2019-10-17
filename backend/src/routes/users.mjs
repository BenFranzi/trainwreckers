import express from 'express';
import checkAPIs from 'express-validator';
import {default as Users} from '../models/users.mjs';
const { param, check, validationResult } = checkAPIs;
import * as UsersService from '../services/users.mjs';

/**
 * Users Route
 * Handles all user requests
 * Requires authentication to access
 */

const router = express.Router();

/**
 * Get Users
 * Returns list of all users
 */
router.get('/',
async (req, res) => {
    const users = await UsersService.getUsers((err, users) => {
        if (!!err) {
            return res.status(500).json({
                error: `Failed to create user: ${e}`,
            });
        }

        // If get users was successful, return list
        res.json({
            users: users,
            count: users.length
        });
    });
});

/**
 * Get Me
 * Get my own details
 */
router.get('/me',
async (req, res) => {
    return res.status(200).json(req.user);
});

/**
 * Create User
 * Creates a new user
 */
router.post('/create',
[
    check('name').exists(),
    check('email').isEmail(),
    check('password').isLength({min: 8}),
    check('role').custom(role => UsersService.checkRole(role)),
],
async (req, res) => {

    // Verify sent fields are valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.errors.map(err => {
                return {
                    msg: err.msg,
                    param: err.param,
                };
            })
        });
    }
    try {
        // Check if the email address already exists
        UsersService.getUserByEmail(req.body.email, async (err, existingUser) => {
            if (!existingUser) {
                // If the user does not already exist, create a new user
                const user = await UsersService.createUser(req.body.name, req.body.email, req.body.password, req.body.role);
                return res.send({id: user.id});
            }
            return res.status(500).json({
                error: `User already exists`,
            });
        })
    } catch (e) {
        return res.status(500).json({
            error: `Failed to create user: ${e}`,
        });
    }
    
});

/**
 * Update users password
 * Used to change the users password
 */
router.put('/password/:id',
[
    check('password').isLength({min: 8}),
    param('id').isLength({min: 24, max: 24}),
],
async (req, res) => {

    // Verify sent fields are valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.errors.map(err => {
                return { msg: err.msg };
            })
        });
    }
    try {
        UsersService.getUser(req.params.id, async (err, user) => {
            if (!user) {
                return res.status(400).json({
                    error: `User does not exist`,
                });
            }

            // Update password
            await UsersService.setPassword(req.body.password, user);
            return  res.send({msg: 'success'});
        });    
    } catch (e) {
        return res.status(500).json({
            error: `Failed to set password: ${e}`,
        });
    }
});

/**
 * Update users role
 * Used to update users role
 */
router.put('/role/:id',
[
    param('id').isLength({min: 24, max: 24}),
],
async (req, res) => {
    // Verify sent fields are valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.errors.map(err => {
                return { msg: err.msg };
            })
        });
    }
    try {
        UsersService.getUser(req.params.id, async (err, user) => {
            if (!user) {
                return res.status(400).json({
                    error: `User does not exist`,
                });
            }

            // If user is found and is authorised, update user role
            await UsersService.setRole(req.body.role, user);
            return  res.send({msg: 'success'});
        });    
    } catch (e) {
        return res.status(500).json({
            error: `Failed to set role: ${e}`,
        });
    }
});

/**
 * Update the users name
 * Used to update the users name
 */
router.put('/name/:id',
[
    param('id').isLength({min: 24, max: 24}),
],
async (req, res) => {

    // Verify sent fields are valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.errors.map(err => {
                return { msg: err.msg };
            })
        });
    }

    try {
        UsersService.getUser(req.params.id, async (err, user) => {
            if (!user) {
                return res.status(400).json({
                    error: `User does not exist`,
                });
            }
            // If user is found and is authorised, update user name
            await UsersService.setName(req.body.name, user);
            return  res.send({msg: 'success'});
        });    
    } catch (e) {
        return res.status(500).json({
            error: `Failed to set name: ${e}`,
        });
    }
});

/**
 * Delete user
 * Used to delete a user
 */
router.delete('/remove/:id',
[
    param('id').isLength({min: 24, max: 24}),
],
async (req, res) => {

    // Verify sent fields are valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.errors.map(err => {
                return { msg: err.msg };
            })
        });
    }
    
    const user = await UsersService.getUser(req.params.id, (err, user) => {
        if (!!err) {
            return res.status(404).json({
                error: `User not found`,
            });
        }

        // If the user is found, delete it
        user.remove();
        return res.send({message: 'Deleted User'});
    });
});

/**
 * Get user
 * Get a users detail by its id
 */
router.get('/:id',
[
    param('id').isLength({min: 24, max: 24}),
],
async (req, res) => {

    // Verify sent fields are valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.errors.map(err => {
                return {
                    msg: err.msg,
                    param: err.param,
                };
            }),
        });
    }

    try {
        // Get the user by the id
        UsersService.getUser(req.params.id, async (err, user) => {
            if (!user) {
                res.status(400).json({
                    error: `User does not exist ${err}`,
                });
            }
            return res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        });
    } catch (e) {
        return res.status(500).json({
            error: `Could not get user ${e}`,
        });
    }
});

export default router;