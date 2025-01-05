const fs = require('fs');
const Tour = require('./models/tourModel')

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

// no loner needed as this taken care of by mongoose schema validation
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

exports.getAllTours = async (req, res) => {
  
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err,
    });
  }


};

exports.getTour = async (req, res) => {

  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err
    });
  }
  
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save() here save method is available in the prototype chain

  // OR
  
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });

  } catch (err) { 
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
};

exports.updateTour = async(req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,
       { 
        new: true, // return the new tour
        runValidators: true,
      });
    res.status(201).json({
      status: 'success',
      data: {
        tour
      }
    });

  } catch (err) { 
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
};

exports.deleteTour = async(req, res) => {
  
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Deleted successfully',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
  
};
