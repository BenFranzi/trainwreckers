import { default as User, UserRole, getRole } from '../models/users.mjs';

/**
 * Users Service
 * Service functions for user routes
 */

/**
 * Create User
 * Creates a new user
 * @param name 
 * @param email 
 * @param password 
 * @param role 
 */
export const createUser = (name, email, password, role) => {
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = getRole(role);
    
    // Save a new user
    //Note: will throw error if role doesn't exist
    user.save((err) => {
        if (err) {
            console.log('failed to save user', err)
            throw new Error('Failed to save user to the database', err);
        }
    });
    return user;
}

/**
 * Get All Users
 * Gets the list of all users
 * @param cb 
 */
export const getUsers = (cb) => {
    User.find({},['name', 'email', 'role'], cb);
}

/**
 * Get User By Email
 * Gets a users details by their email address
 * @param email 
 * @param cb 
 */
export const getUserByEmail = (email, cb) => {
    User.findOne({email: email}, cb);
};

/**
 * Get User
 * Gets a user by its id
 * @param id 
 * @param cb 
 */
export const getUser = (id, cb) => {
    User.findById(id,['name', 'email', 'role'], cb);
}

/**
 * Set User Password
 * Set a users password
 * @param password 
 * @param user 
 */
export const setPassword = (password, user) => {
    user.password = password;
    user.save(err => {
        if (err) {
            throw new Error('Failed to save user password to the database', err);
        }
    });
}

/**
 * Set User Name
 * Set a users name
 * @param name 
 * @param user 
 */
export const setName = (name, user) => {
    user.name = name;
    user.save(err => {
        if (err) {
            throw new Error('Failed to save user name to the database', err);
        }
    });
}

/**
 * Set User Role
 * Set a users role
 * @param role 
 * @param user 
 */
export const setRole = (role, user) => {
    user.role = role;
    user.save(err => {
        if (err) {
            throw new Error('Failed to save user role to the database', err);
        }
    });
}

/**
 * Check Role
 * Check the users role (DEPRECIATED)
 * @param role 
 */
export const checkRole = (role) => {
    if (!role) throw new Error('No role specified');
    // if (!(role === UserRole.OPERATOR || role === UserRole.ADMIN))
    //     throw new Error('Invalid role specified');
    return true;
}