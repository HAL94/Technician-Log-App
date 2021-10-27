const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');
// const upload = require('../middleware/file-upload');


router.post('/signup', UsersController.signup);

router.post('/login', UsersController.login);

router.get('/user-profile/:userId', checkAuth,  UsersController.get_profile);

router.put('/user-profile/:userId', checkAuth,  UsersController.update_profile);

router.patch('/user-profile/upload/:userId', checkAuth, UsersController.upload_profileImg);

module.exports = router;
