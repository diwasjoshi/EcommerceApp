var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/* The user schema attributes / characteristics / fields */
var UserSchema = new Schema({

  email: { type: String, unique: true, lowercase: true},
  password: String,

  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  address: String,
  history: [{
    date: Date,
    paid: { type: Number, default: 0},
  }]
});


/* create user */
UserSchema.methods.createUser = function(callback){
    var self = this;
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(self.password, salt, null, function(err, hash) {
        if (err) return next(err);
        self.password = hash;
        self.save(callback);
      });
    });
}


/* compare password in the database and the one that the user type in */
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', UserSchema);
