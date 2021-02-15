const User = require("../models/user");
const initParam = require("../helpers/init");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    let loadedUser;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        res
          .status(401)
          .json({ message: "A user with this email could not be found." });
      } else {
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          res.status(401).json({ message: "Wrong password!" });
        } else {
          const token = jwt.sign(
            {
              email: loadedUser.email,
              userId: loadedUser._id.toString(),
            },
            initParam.SECRETE_USER_API_KEY,
            { expiresIn: "12h" }
          );
          let decodedToken = jwt.verify(token, initParam.SECRETE_USER_API_KEY);
          res.status(200).json({
            token: "Bearer " + token,
            userId: loadedUser._id.toString(),
            expired: decodedToken.exp,
          });
        }
      }
    } catch (err) {
      console.log(err);
      // next(err);
      // res.status(500).json({ message: "internal server error" });
    }
  };