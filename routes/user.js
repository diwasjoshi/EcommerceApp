var router = require('express').Router();
var User = require('../models/user');
var Cart = require('../models/cart');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


router.get('/profile', function(req, res, next){
    if (!req.user){
        return res.redirect('login');
    }
    res.render('accounts/profile', {
        errors: req.flash('errors'),
    });
});

router.get('/register', function(req, res, next){
    res.render('accounts/register', {
        errors: req.flash('errors'),
    });
});

router.post('/register', function(req, res, next){
    var user = new User();
    console.log(user);
    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    User.findOne({ email: req.body.email }, function(err, existingUser){
        if(existingUser){
            req.flash('errors', 'User already exists');

            return res.redirect('register');
        } else {
            user.createUser(function(err, user){
                if(err) return next(err);
                var cart = new Cart();
                cart.owner = user._id;
                cart.save(function(err) {
                    if (err) return next(err);
                    req.logIn(user, function(err) {
                      if (err) return next(err);
                      res.redirect('profile');
                    });
                });
            });
        }
    });
});

router.get('/login', function(req, res){
    res.render('accounts/login', {
        message: req.flash('errors')
    });
});

router.post('/login',
            passport.authenticate('local', {
                successRedirect: '/user/profile',
                failureRedirect: '/user/login',
                failureFlash: true
            }), function(req, res) {
                req.flash('success', 'you are now logged in.');
                res.redirect('profile');
            });


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
  }, function(req, email, password, done) {
      User.findOne({ email: email}, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, req.flash('loginMessage', 'No user has been found'));
        }

        if(user.comparePassword(password)){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Invalid Password'});
        }
      });
}));

router.get('/logout', function(req, res, next) {
  req.logout();
  res.flash('success', 'you have successfully logged out.');
  res.redirect('login');
});

module.exports = router;
