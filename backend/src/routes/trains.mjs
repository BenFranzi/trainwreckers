import express from 'express';
import * as TrainsService from '../services/trains.mjs';
import checkAPIs from 'express-validator';
const { check, param, validationResult } = checkAPIs;

/**
 * Trains Route
 * Handles all trains requests
 */

const router = express.Router();

/**
 * Get all trains 
 * Returns a list of all trains
 */
router.get('/', async (req, res) => {
    const trains = await TrainsService.getTrains((err, trains) => {
        if (!!err) {
            return res.status(500).json({
                error: `Failed to get trains: ${e}`,
            });
        }
        res.json({
            trains: trains,
            count: trains.length
        });
    });
});

/**
 * Create train
 * Make a new train
 */
router.post('/create',
[
    check('number_carriages').exists(),
    check('route_id').exists(),
    check('weather').exists(),
    check('headlights').exists(),
    check('youtubeId').exists(),
    check('train_name').exists(),
    check('route_name').exists()
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
        // Create train
        const train = await TrainsService.createTrain(
            req.body.number_carriages, 
            req.body.route_id, 
            req.body.weather, 
            req.body.headlights, 
            req.body.youtubeId, 
            req.body.train_name, 
            req.body.route_name, (err, train) => {
            if (err) {
                console.log('failed to save train', err)
            }
            return res.send({id: train.id});
        });
        
    } catch (e) {
        return res.status(500).json({
            error: `Failed to create train: ${e}`,
        });
    }
    
});

/**
 * Get train
 * Get trains details by its id
 */
router.get('/:id',
async (req, res) => {
    const trains = await TrainsService.getTrain(req.params.id, (err, train) => {
        if (!!err) {
            return res.status(500).json({
                error: `Failed to get train`,
            });
        }
        res.json(train);
    });
});

export default router;