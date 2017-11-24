const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res, next) => {
  res.render('index');
});

// Register form
router.get('/register', (req, res, next) => {
  res.render('register');
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
    console.log('Success');
    return;
  }
  //res.render('register');
});


module.exports = router;