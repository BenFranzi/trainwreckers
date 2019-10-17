import {default as config} from './config.mjs';
import {default as runner} from './logic/scriptStream.mjs';
const {TrainStates} = config;

/**
 * Socket Class
 * Manages the socket server and maintains the machine vision execution
 */
export const socket = (io) => {
    // Spawn - used to hold the reference to the running machine vision instance
    let spawn = null;
    // connections - holds list of current active socket connections
    let connections = new Set([]);
    // detectedInEpoch - holds list of items detected within a given epoch period
    let detectedInEpoch = new Set([]);
    // epoch - holds the value of the current epoch (in seconds)
    let epoch = 0;
    // counter - holds the count for amount of items detected consecutively
    let counter = {};
    // prevCounter - copy of previous counter iteration
    let prevCounter = {};

    /**
     * Determines what state to send to the frontend based on history
     */
    const determineState = () => {
        if (!!counter['RR']) {
            // If Red lights are seen in 5 epochs, stop the train
            if (counter['RR'] >= 5) {
                return TrainStates.STOP;
            // If Red lights are seen in 4 epochs, slow the train
            } else if (counter['RR'] >= 3) {
                return TrainStates.DECEL;
            }
        }
        // Otherwise continue
        return TrainStates.CONTINUE;
    }

    /**
     * Connection - Manages the socket connection, handles business logic
     */
    io.on('connection', (socket) => {
        console.log('client connected');
        // On a connection, add the user to the connections list
        connections.add(socket);

        // If there is no current instance of machine vision running, start machine vision
        if (spawn == null) {
            spawn = runner('url', machineVisionHandler);   
        }
    
        // Handle user disconnect
        socket.on('disconnect', function(){
            console.log('client disconnected');
            if (connections.has(socket)) {
                // Remove user from active connections list
                connections.delete(socket);
            }

            // If all users have disconnected, kill active machine vision
            if (connections.size == 0) { 
                console.log('All clients disconnected, killing process');
                spawn.kill(1);
                spawn = null;
                // Reset to default values
                detectedInEpoch.clear();
                epoch = 0;
                counter = {};
                prevCounter = {};
            } 
        }); 
    })

    /**
     * Override handling from front end
     */
    io.on('train_override', (msg) => {
        socket.emit('train_override', JSON.stringify({ logic: msg }))
    })

    /**
     * Machine Vision Handler
     * Handles business logic for managing between epoch counts
     * @param data - returned json from machine vision
     */
    const machineVisionHandler = (data) => {
        // Is the new data from the same epoch?
        if (Math.floor(data.epoch) != epoch) { 
            // If the epoch has changed, perform business logic

            Object.keys(counter).forEach((item) => {
                // If the current count of an item has not changed, reset the counter
                if (counter[item] == prevCounter[item]) {
                    counter[item] = 0;
                }
            });

            // Prepare object for sending to frontend
            const outp = {
                data: Array.from(detectedInEpoch), 
                epoch: epoch, 
                url: 'http://trains.benfranzi.com:8080/media/train-test.jpg',
                logic: determineState(),
            } 

            // Emit message to all active connections
            connections.forEach((connection) => {
                connection.emit('train-data', JSON.stringify(outp))
            });

            // Copy current counter to previous counter for later comparison
            Object.assign(prevCounter, counter);
            
            // Clear detected in epoch list for next epoch
            detectedInEpoch.clear();

            console.log(outp);
        }

        // If the data has not been added to the current detectedInEpoch list, add it so it is not duplicated
        if (!detectedInEpoch.has(data.detected)) {
            detectedInEpoch.add(data.detected);
            // If no record exists for the detected data
            if (!counter[data.detected])
            {
                // Add its first entry
                counter[data.detected] = 1;
            } else { 
                // It already exists, increment current count
                counter[data.detected] = counter[data.detected] + 1;
            }
        }
        epoch = Math.floor(data.epoch);
    }
}

