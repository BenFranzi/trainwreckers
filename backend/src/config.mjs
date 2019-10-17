/**
 * Config for JSON Web Tokens used for authentication
 */
const JWTConfig = {
    SECRET: 'thecakeisalie',
    TIMEOUT: '2d'
}

/**
 * Config for URL of hosted MongoDB
 */
const DBConfig = {
    // ALT: 'mongodb://localhost:27017/trainwreckers'
    URL: 'mongodb+srv://root:thecakeisalie@cluster0-uuqge.mongodb.net/test?retryWrites=true&w=majority'
}

/**
 * Config for web socket
 */
const WSConfig = {
    PATH: '/ws',
    PORT: 8081
}

/**
 * States of train
 */
const TrainStates = {
    STOP: "STOP",
    CONTINUE: "CONTINUE",
    ACCEL: "ACCEL",
    DECEL: "DECEL"
}

export default {
    JWT: JWTConfig,
    DB: DBConfig,
    WS: WSConfig,
    TrainStates: TrainStates
}