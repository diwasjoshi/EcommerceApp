var router = require('express').Router();
var User = require('../models/user');
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

                return res.redirect('profile');
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
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(function(username, password, done){
    User.findOne({ email: req.body.email }, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {error: 'User does not exist'});
        }
        user.comparePassword(password, user.password, function(err, isMatch){
            if(err) return done(err);
            if(isMatch){
                return done(null, user);
            }else{
                return done(null, false, {error: 'Invalid Password'});
            }
        })
    })
}));

router.get('/logout', function(req, res, next) {
  req.logout();
  res.flash('success', 'you have successfully logged out.');
  res.redirect('login');
});

module.exports = router;
