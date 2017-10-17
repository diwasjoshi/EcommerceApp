var router = require('express').Router();
var Product = require('../models/product');
var Category = require('../models/category');

router.get('/:name/products', function(req, res, next) {

    Category.findOne({ name: req.params.name }, function(err, category){
            if (err) return next(err);

            Product.find({ category: category._id }, function(err, products){
                if (err) return next(err);
                  res.render('main/category', {
                    products: products,
                    category: req.params.name
                });
            })
    })
});

module.exports = router;
