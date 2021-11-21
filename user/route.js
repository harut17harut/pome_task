const express = require('express');
let router = express.Router();
const { User } = require('./controller');
const validation = require('./validation');
const { auth } = require("../middlewares/auth");

router.post('/', validation.create, User.create);
router.post('/signin', validation.signin, User.signin);
router.post('/activate/:authorization', User.activateUser);
router.post('/upload', auth, User.upload);
router.put('/:id', auth, validation.update, User.update);
router.delete('/:id', auth, User.destroy);

module.exports = { router };