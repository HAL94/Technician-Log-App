const jwt = require('jsonwebtoken');

// a middleware function to check authentication
module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('Authorization Header Not Set');
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('user data', decoded);
    req.userData = decoded;
    // console.log(req);
    next();
  } catch(error) {
    console.log(error);
    res.status(401).json({
      message: 'authentication failed'
    })
  }
};
