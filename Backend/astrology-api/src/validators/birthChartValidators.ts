import Joi from "joi";
import { supportedChartTypes } from "../config/vedicAstroConfig";

export const chartGenerationSchema = Joi.object({
  chartName: Joi.string().min(2).max(100),
  chartType: Joi.string()
    .valid(...supportedChartTypes)
    .default("horoscope-chart-svg-code"),
});

export const guestChartSchema = Joi.object({
  name:        Joi.string().min(2).max(100).required(),
  gender:      Joi.string().valid("male", "female", "other").required(),
  dateOfBirth: Joi.date().max("now").required(),
  timeOfBirth: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  city:        Joi.string().required(),
  state:       Joi.string().allow(""),
  country:     Joi.string().required(),
  latitude:    Joi.number().min(-90).max(90),
  longitude:   Joi.number().min(-180).max(180),
});

export const birthDetailsUpdateSchema = Joi.object({
  dateOfBirth: Joi.date().max("now"),
  timeOfBirth: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
}).min(1);
