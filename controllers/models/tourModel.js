const mongoose = require('mongoose');

// definig the schema
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      reqired: [true, 'A tour must have a name'],
      unique: [true, 'A tour must have a unique name']
    }, 
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    }
  });
  
  // creating model out of the schema
  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour;