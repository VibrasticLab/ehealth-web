const jwt = require("jsonwebtoken");
const initParam = require("../helpers/init");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.status(401).json({
      message: "Not authenticated.",
    });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, initParam.SECRETE_USER_API_KEY);
  } catch (err) {
    res.status(500).json({
      message: "Token cannot to be verified.",
    });
  }
  if (!decodedToken) {
    res.status(401).json({
      message: "Not authenticated.",
    });
  }else{
    req.userId = decodedToken.userId;
    next();
  }
};
