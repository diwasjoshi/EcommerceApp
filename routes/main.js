var router = require('express').Router();
var Cart = require('../models/cart');


router.get('/', function(req, res){
    if(req.user){
        return res.redirect('/product');
    }else{
        res.render('main/home');
    }
});

router.get('/about', function(req, res){
    res.render('main/about');
});

router.get('/cart', function(req, res){
    Cart
    .findOne({ owner: req.user._id })
    .populate('items.item')
    .exec(function(err, foundCart) {
      if (err) return next(err);
      res.render('main/cart', {
        foundCart: foundCart,
        message: req.flash('remove')
      });
    });
});

module.exports = router;
