const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const cactchaSync = require("../ultil/cactchAsync");
//REGISTER
router.post(
  "/register",
  cactchaSync(async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(201).json({
      status: "success",
      data: user,
    });

    next();
  })
);

//LOGIN
router.post(
  "/login",
  cactchaSync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(400).json("don't have email exits!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");

    const { password, ...others } = user._doc;
    res.status(200).json(others);
    next();
  })
);

module.exports = router;
