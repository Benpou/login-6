const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/login-6', {useMongoClient: true});

// Use bcrypt for JS
const bcrypt = require('bcryptjs');

// Define Schema
const UsersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    required: true,
    type: String
  },
});

// Make Schema model
const User = module.exports = mongoose.model('User', UsersSchema);

module.exports.registerUser = function (newUser, callback){
  // Make salt
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

// getUserByUsername
module.exports.getUserByUsername = function (username, callback) {
  const query = {username: username}
  User.findOne(query, callback);
}

/* comparePassword
   @ candidatePassword is user password
   @ hash is password in db
*/
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}


// getUserById
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}