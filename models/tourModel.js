const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal 40 characters.'],
      minlength: [5, 'A tour must have less or equal 5 characters.']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: {
      type: String
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult.'
      }
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above or equal 1.0.'],
      max: [5, 'Rating must be below or equal 5.0.'],
      set: val => Math.round(val * 10) / 10
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
      set: val => Math.round(val * 10) / 10
    },
    priceDiscount: {
      type: Number,
      // "this" points to current document on new document creation
      //will not work on updates
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Discount price {{VALUE}} should be below regular prices.'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary.']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.']
    },
    images: {
      type: [String]
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: {
      type: [Date]
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      // Longitude and Latitude
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.index({ slug: 1 });

tourSchema.index({
  price: 1,
  ratingAverage: -1
});

tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// QUERY MIDDLEWARE: runs before a query is executed i.e.
// A "find" query in this case
// "this" points to the query to be executed
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATE MIDDLEWARE: runs before aggregation pipeline
// "this" points to the Aggregate object
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// "this" points to new document to be saved
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
// next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
