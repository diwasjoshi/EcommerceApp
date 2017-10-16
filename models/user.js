var mongoose = require('mongoose');
var brcypt = require('bcrypt-js');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true},

})
