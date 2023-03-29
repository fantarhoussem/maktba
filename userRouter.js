const router = require('express').Router();
const usercontroller = require('../controllers/userController');
//const auth = require('../middelware/auth');

router.post('/register', usercontroller.register);

router.post('/login', usercontroller.login);

router.get('/logout', usercontroller.logout);

router.get('/refresh_token', usercontroller.refreshToken);

//router.get('/infor', auth, usercontroller.getUser);

//router.patch('/addcart', auth, usercontroller.addCart);
module.exports = router;


