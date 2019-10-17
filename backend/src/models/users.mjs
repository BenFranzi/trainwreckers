import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * Train Database Model
 */

export const UserRole = {
    OPERATOR: 'operator',
    ADMIN: 'admin'
}

/**
 * Get Role
 * Get the users role
 * @param role 
 */
export const getRole = (role) => {
    switch (role) {
        case 'operator':
            return UserRole.OPERATOR;
        case 'admin':
            return UserRole.ADMIN;
        default:
            throw Error('invalid');
    }
}
/**
 * Users Schema
 */
const usersSchema = mongoose.Schema({
    'name': {type: String, required: true},
    'email': {type: String, required: true},
    'password': {type: String, required: true},
    'salt': {type: String},
    'role': {
        type: String,
        enum: [UserRole.OPERATOR, UserRole.ADMIN],
        default: UserRole.OPERATOR,
        required: true
    },
    'updated_at': {type: Date, default: Date.now()}
});
/**
 * Make Salt
 * Makes a password salt for hashing
 */
const makeSalt = async () => {
    return await crypto.randomBytes(16).toString('base64');
}

/**
 * Hash Password
 * Hashes password for database storage
 * @param password 
 * @param currSalt 
 */
const hashPassword = async (password, currSalt) => {
    console.log(currSalt);
    const salt = Buffer.from(currSalt, 'base64');
    return await crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

}

/**
 * Prior to saving, hash users password
 */
usersSchema.pre('save', async function (next) {
    this.updated_at = Date.now();

    if (!this.isModified('password')) return next();
    try {
        const salt = await makeSalt();
        this.salt = salt;
        this.password = await hashPassword(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

/**
 * Validate password
 * Ensure enter password is correct
 */
usersSchema.methods.validatePassword = async function (attempt) {
    const salt = await Buffer.from(this.salt, 'base64');
    const hashed = await crypto.pbkdf2Sync(attempt, salt, 10000, 64, 'sha512').toString('base64');
    return this.password === hashed;

};

export default mongoose.model('Users', usersSchema);