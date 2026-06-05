//joi Server Side Scheama validation
const Joi = require("joi");

const ListingSchema = Joi.object({
  Listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

const ReviewSchema = Joi.object({
  reviews: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    Comment: Joi.string().required(),
  }).required(),
});

module.exports = { ListingSchema, ReviewSchema };
