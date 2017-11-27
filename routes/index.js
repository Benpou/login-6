const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Bring the model
let User = require('../models/user');

// Home page
router.get('/', ensureAuthenticated, (req, res, next) => {
  res.render('index');
});

// Login form
router.get('/login', (req, res, next) => {
  res.render('login');
});


// Register form
router.get('/register', (req, res, next) => {
  res.render('register');
});


// Logout
router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logout');
  res.redirect('/login');
});


// Register Process
router.post('/register', (req, res, next) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email must be a valid Email address').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Password does not match').equals(req.body.password);
  
  let errors = req.validationErrors();
  
  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password
    });
    
    User.registerUser(newUser, (err, user) => {
      if (err) throw err;
      req.flash('success_msg', 'You are registerd');
      res.redirect('/login');
    });
  }
});

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
  // Call getuser from User model
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return done(null, false, {message: 'Incorect username'});
    }
  
    // call comparePassword from User model
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'Password does not match'});
      }
    });
  });
}));

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


// Login Process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    // Flash msg
    failureFlash: true
  })(req, res, next);
});

// Access control
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'Your session expire or you are not authorized');
    res.redirect('/login');
  }
}

module.exports = router;
