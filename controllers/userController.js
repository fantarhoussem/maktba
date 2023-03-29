const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const { create } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const usercontroller = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: 'the email already exists.' });
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: 'password is at least 6 characters long.' });

      //Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });
      //save mongodb
      await newUser.save();
      ///create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
      });

      res.json({ accesstoken });
      ///res.json({ msg: 'register success' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      /////
      if (!user) return res.status(400).json({ msg: 'User does not exist' });
      const isMatch = await bcrypt.compare(password, user.password);
      /////
      if (!isMatch) return res.status(400).json({ msg: 'Incorrect Password' });
      ///if login success create access token and refresh token
      /* res.json({ msg: 'Login success <3 ' });*/
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.meassage });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
      return res.json({ msg: 'logged out' });
    } catch (err) {
      return res.status(500).json({ msg: err.meassage });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: 'please Login or Register' });
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: 'please Login or Register' });
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.meassage });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('-password');
      if (!user) return res.status(400).json({ msg: 'User does not exist.' });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: 'User is not exist' });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: 'Added to your cart' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

////Accesstoken + Refreshtoken
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = usercontroller;
