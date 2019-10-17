import {spawn} from 'child_process'

/**
 * Script Stream
 * Used to manage the running machine vision model
 */

const ML_PATH = '/Users/benfranzi/Projects/old_projects/STB/TrainWreck.B-alt/src/ml/ml.py'

/**
 * Spawn Process
 * Used to spawn a machine vision process and emit events through the callback 
 */
export default (youtubeUrl, stdout) => {

    const py = spawn('python', ['-u', ML_PATH, youtubeUrl]);
    // After 20 minutes, timeout by default
    setTimeout(() => py.kill(1), 20*60*1000) 

    // On data received
    py.stdout.on('data', (data) => {
        // Get JSON data from console
        data.toString().split('{').forEach((startOfLine) => {
            if (startOfLine.length > 8) { 
                const single = '{' + startOfLine.split('}')[0] +'}';

                // If valid input
                if (IsJson(single)) {
                    // trigger callback
                    stdout(JSON.parse(single));
                } else {
                    console.log('not json', trimmed);
                }
            }
        });
    });

    // On error, log
    py.stderr.on('data', (data) => {
        console.log('RUNNER-ERR: ' + data);
    });

    // On exit, log
    py.on('exit', (code) => {
        console.log('RUNNER-EXIT: ' + code);
    });
      
    return py;
}

/**
 * Check for valid JSON string
 * @param str 
 */
const IsJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        console.log(e.message);
        return false;
    }
    return true;
}