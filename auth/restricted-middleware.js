module.exports = (req, res, next) => {
  if (req.session && req.session.username) {
    next()
  } else {
    res.status(401).json({ message: 'Please login to access this resource' });
  }
};

//trusting the login process places the username there and we just want to check for that, 
//this is how i know you logged in because i found the username saved as part of the session.

//trusting that the login process works!