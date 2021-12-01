const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const tagService = require('./tag.service');
const upload = require('../../_helpers/uploadFile');

// routes
router.post('/', [authorize.authorizeAdminRole(), upload.single('image')], create);
router.get('/', authorize.authorize(), searchTag);

module.exports = router;

function create(req, res, next) {
    tagService.create(req)
        .then(tag => res.json({ data: tag, message: "Create success!" }))
        .catch(next);
}

function searchTag(req, res, next) {
    tagService.searchTag(req.body)
        .then(tags => res.json({ data: tags, message: "Get success!" }))
        .catch(next);
}