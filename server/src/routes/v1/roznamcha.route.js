const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const roznamchaValidation = require('../../validations/roznamcha.validation');
const roznamchaController = require('../../controllers/roznamcha.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageTransactions'), validate(roznamchaValidation.createRoznamcha), roznamchaController.createRoznamcha)
  .get(auth('getTransactions'), validate(roznamchaValidation.getRoznamchas), roznamchaController.getRoznamchas);

router
  .route('/:roznamchaId')
  .get(auth('getTransactions'), validate(roznamchaValidation.getRoznamcha), roznamchaController.getRoznamcha)
  .patch(auth('manageTransactions'), validate(roznamchaValidation.updateRoznamcha), roznamchaController.updateRoznamcha)
  .delete(auth('manageTransactions'), validate(roznamchaValidation.deleteRoznamcha), roznamchaController.deleteRoznamcha);

module.exports = router;
