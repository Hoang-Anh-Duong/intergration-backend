const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const settingService = require("./setting.service");

// routes
router.post(
  "/update-setting",
  settingSchema,
  authorize.authorize(),
  updateSetting
);
router.get("/get-setting", authorize.authorize(), getSetting);

module.exports = router;

function settingSchema(req, res, next) {
  const schema = Joi.object({
    trelloKeyApi: Joi.string().required(),
    trelloToken: Joi.string().required(),
    dropboxToken: Joi.string().required(),
    slackToken: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function updateSetting(req, res, next) {
  const data = {
    user: req.user,
    setting: req.body,
  };
  settingService
    .updateSetting(data)
    .then((setting) => res.json({ code: 200, data: setting }))
    .catch(next);
}

function getSetting(req, res, next) {
  settingService
    .getSetting(req.user)
    .then((setting) => res.json({ code: 200, data: setting }))
    .catch(next);
}
