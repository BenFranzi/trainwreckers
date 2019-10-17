import mongoose from 'mongoose';

/**
 * Train Database Model
 */

/**
 * Trains Schema
 */
const trainsSchema = mongoose.Schema({
  'number_carriages'  : {type: Number,  required:true},
  'train_name'        : {type: String,  required:true},
  'route_id'          : {type: String,  required:true},
  'route_name'        : {type: String,  required:true},
  'weather'           : {type: String,  required:true},
  'headlights'        : {type: Boolean, required:true},
  'youtube_id'        : {type: String,  required:true}
});

export default mongoose.model('Trains', trainsSchema);
