const fs = require("fs");
const Tour = require("../models/tourModel");
const ApiFeature = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getBestCheapTourAlias = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage";
  next();
};

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

// no loner needed as this taken care of by mongoose schema validation
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    /************************************************************************************************
     * ALL THE COMMENTED LOGIC HAS BEEN MOVED TO THE API FEARURES CLASS
     */

    // // 1) Filtering tquery
    // const queryObject = {...req.query};
    // const excludedParams = ['page', 'sort', 'limit', 'fields'];
    // excludedParams.forEach(param => delete queryObject[param]);

    // // 2) Advance filtering
    // let queryString = JSON.stringify(queryObject);
    // // add $ so that it cats as an mongo db operator
    // // /tours?difficulty=medium&duration[gte]=9 -- this will be the url
    // queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    //   // create query object
    //   let query = Tour.find(JSON.parse(queryString));  // find method here returns query object.

    //   // 3) Sorting the data
    //   // endpoint - ......sort=price,ratingsQuantity
    // if (req.query.sort) {
    //       const sortBy = req.query.sort.split(',').join(' ');
    //       query = query.sort(sortBy);
    //   } else {
    //   query = query.sort('-createdAt'); // pagination may not work as expected if this data is same
    //   }

    //   // 4) Limiting the fields -- PROJECTION
    //   if(req.query.fields) {
    //     const fields = req.query.fields.split(',').map(field => field.trim());
    //     query = query.select(fields);
    //   } else {
    //     query = query.select('-__v');
    //   }

    //   // 5) PAGINATION
    //   const page = req.query.page * 1|| 1;
    //   const limit = req.query.limit * 1 || 10;
    //   const skip = (page - 1) * limit;

    //   query = query.skip(skip).limit(limit);

    //   if(req.query.page) {
    //     const totTours = await Tour.countDocuments();
    //       if (skip >= totTours) {
    //         throw new Error('Page limit exceeded');
    //       }
    //   }

    // execute query
    // Tour.find() will return a query object
    // ApiFeature can noe be used with any kind of models
    const features = new ApiFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    const tours = await features.query; // fire the modified query for this instance

    // OR

    // const tours = await Tour.find().where('difficulty').equals('medium');

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err,
    });
  }
};

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found", 404)); // passing argument to next will take it to global error handler
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });

  // try {
  //   const tour = await Tour.findById(req.params.id);
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       tour
  //     }
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failure',
  //     message: err
  //   });
  // }
});

// exports.createTour = async (req, res) => {
//   // const newTour = new Tour({});
//   // newTour.save() here save method is available in the prototype chain

//   // OR

//   try {
//     const newTour = await Tour.create(req.body)
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour
//       }
//     });

//   } catch (err) {
//     res.status(400).json({
//       status: 'failed',
//       message: err
//     });
//   }
// };

// FROM THE ABOVE COMMNENTED METHOF WE HAVE REMOVE THE TRY CATCH BLOCK AND DELEGATE THE
// CATCH TO catchAsync method for glonbal handling

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the new tour
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError("No tour found", 404)); // passing argument to next will take it to global error handler
  }
  res.status(201).json({
    status: "success",
    data: {
      tour,
    },
  });
  // try {
  //   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,
  //      {
  //       new: true, // return the new tour
  //       runValidators: true,
  //     });
  //   res.status(201).json({
  //     status: 'success',
  //     data: {
  //       tour
  //     }
  //   });

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err
  //   });
  // }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found", 404)); // passing argument to next will take it to global error handler
  }

  res.status(204).json({
    status: "Deleted successfully",
    data: null,
  });
  // try {
  //   await Tour.findByIdAndDelete(req.params.id);
  //   res.status(204).json({
  //     status: "Deleted successfully",
  //     data: null,
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: "failed",
  //     message: err,
  //   });
  // }
});
