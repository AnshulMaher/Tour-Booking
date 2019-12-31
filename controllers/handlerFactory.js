const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

//----------------- Generic Handlers-----------------//

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.collection.collectionName;
    // To Allow For Nested GET Reviews Of A Tour
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }
    /************************************/
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const documents = await features.query;

    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        [modelName]: documents
      }
    });

    // try {
    // above code goes here
    // } catch (err) {
    //   res.status(404).json({
    //     status: 'fail',
    //     message: err
    //   });
    // }
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    let modelName = Model.collection.collectionName;
    modelName = modelName.substring(0, modelName.length - 1);
    const data = { ...req.body };
    const document = await Model.create(data);
    res.status(201).json({
      status: 'success',
      data: {
        [modelName]: document
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let modelName = Model.collection.collectionName;
    modelName = modelName.substring(0, modelName.length - 1);
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const document = await query;
    if (!document) {
      return next(new AppError(404, 'No document found with that ID'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        // data: document
        [modelName]: document
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    let modelName = Model.collection.collectionName;
    modelName = modelName.substring(0, modelName.length - 1);
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!document) {
      return next(new AppError(404, 'No document found with that ID'));
    }
    res.status(200).json({
      status: 'success',
      data: {
        [modelName]: document
      }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError(404, 'No document found with that ID'));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

//----------------- End -----------------//
