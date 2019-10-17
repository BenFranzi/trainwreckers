import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import socketio from "socket.io";
import * as http from 'http';
import {default as authRouter} from './src/routes/auth.mjs';
import {default as usersRouter} from './src/routes/users.mjs';
import {default as trainsRouter} from './src/routes/trains.mjs';
import {default as config} from './src/config.mjs';
import {socket} from './src/socket.mjs'
import requireAuth from './src/middleware/requireAuth.mjs';
import path from 'path';
import variables from './src/logic/cjs.js';
const {__dirname} = variables;

/**
 * Setup express middleware
 */

// Get app from express
const app = express();
// Morgan is used to log requests to server
app.use(morgan('dev'));
// Express app is expecting JSON 
app.use(express.json());
// Allow cross origin resource sharing
app.use(cors());
// Use middleware to parse urlencoded bodies (only querystring library) https://expressjs.com/en/api.html
app.use(express.urlencoded({ extended: false }));

/**
 * Connect to database
 */

mongoose.connect(
    config.DB.URL,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

/**
 * Define routes
 */

const prefix = '/api';
const port = process.env.PORT || 8080;

// serving authRouter under /api/auth
app.use(`${prefix}/auth`, authRouter);
// serving usersRouter under /api/users
app.use(`${prefix}/users`, requireAuth, usersRouter);
// serving trainsRouter under /api/trains
app.use(`${prefix}/trains`, requireAuth, trainsRouter);

app.use('/media', express.static(path.resolve(__dirname, '../../media')));

/**
 * Setup socket connection
 */

// Configure separate server for socket serving
const httpVar = http.Server(app);
// Create new socketio instance
const io = socketio(httpVar, {path: config.WS.PATH});
// Pass socket server instance to 'socket' class
socket(io);

/**
 * Serve
 */

// Serve socket
httpVar.listen(config.WS.PORT);

// Serve REST endpoints
app.listen(port, () => { console.log(`running :${port}`)});