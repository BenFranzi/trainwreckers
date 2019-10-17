//NOTE: Doesn't check if the user already exists
import mongoose from 'mongoose';
import { default as User } from './src/models/users.mjs';
import {default as config} from './src/config.mjs';
import { UserRole } from './src/models/users.mjs';

/**
 * Create a single user in the database
 */
mongoose.connect(
    config.DB.URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    const user = new User();
    user.name = "root account";
    user.email = "root@mail.com";
    user.password = "thecakeisalie";
    user.role = UserRole.ADMIN;
    user.save((err) => {
        if (err) {
            console.log('failed to save user', err)
            throw new Error('Failed to save user to the database', err);
        }
        process.exit();
    });
  })
  .catch(err => console.log(err));