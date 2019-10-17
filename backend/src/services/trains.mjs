import { default as Train } from '../models/trains.mjs';

/**
 * Trains Service
 * Service functions for train routes
 */

/**
 * Get Trains
 * Gets list of all trains
 * @param cb 
 */
export const getTrains = (cb) => {
    Train.find({},['_id', 'number_carriages', 'route_id', 'weather', 'headlights', 'youtube_id', 'train_name', 'route_name'], cb);
}

/**
 * Get Train
 * Get train by id
 * @param id train id
 * @param cb 
 */
export const getTrain = (id, cb) => {
    Train.findOne({_id: id},['_id', 'number_carriages', 'route_id', 'weather', 'headlights', 'youtube_id', 'train_name', 'route_name'], cb);
}

/**
 * Create Train
 * Creates a new train
 * @param number_carriages 
 * @param route_id 
 * @param weather 
 * @param headlights 
 * @param youtubeId 
 * @param train_name 
 * @param route_name 
 * @param cb 
 */
export const createTrain = (number_carriages, route_id, weather, headlights, youtubeId, train_name, route_name, cb) => {
    const train = new Train();
    train.number_carriages = number_carriages;
    train.route_id = route_id;
    train.weather = weather;
    train.headlights = headlights;
    train.youtube_id = youtubeId;
    train.train_name = train_name;
    train.route_name = route_name;
    train.save(cb);
}