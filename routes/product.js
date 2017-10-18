var router = require('express').Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

Product.createMapping(function(err, mapping){
    if(err){
        console.log('error creating mapping');
        console.log(err);
    }else{
        console.log('mapping done');
        console.log(mapping);
    }
});

var stream = Product.synchronize();
var count = 0;

stream.on('data', function() {
  count++;
});

stream.on('close', function() {
  console.log("Indexed " + count + " documents");
});

stream.on('error', function(err) {
  console.log(err);
});


router.get('/:id', function(req, res, next) {
  Product.findById({ _id: req.params.id }, function(err, product) {
    if (err) return next(err);
    res.render('main/product', {
      product: product
    });
  });
});

router.post('/:id', function(req, res, next) {
    Cart.findOne({ owner: req.user._id }, function(err, cart) {
      cart.items.push({
        item: req.body.product_id,
        price: parseFloat(req.body.priceValue),
        quantity: parseInt(req.body.quantity)
      });

      cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

      cart.save(function(err) {
        if (err) return next(err);
        return res.redirect('/cart');
      });
    });
});

router.post('/search', function(req, res, next) {
  Product.search({ query_string: { query: req.body.q }}, function(err, results) {
    if (err) return next(err);
    var data = results.hits.hits.map(hit => hit);
    res.render('main/search-result', {
      query: req.body.q,
      data: data
    });
  });
});

router.get('/', function(req, res, next) {
    return res.redirect('/product/page/1');
});

router.get('/page/:page', function(req, res, next) {
    var pageSize = 10;
    var page = req.params.page;
    Product
        .find()
        .skip(pageSize*page)
        .limit(pageSize)
        .populate('category')
        .exec(function(err, products){
            if (err) return next(err);
            Product.count().exec(function(err, count) {
                if (err) return next(err);
                res.render('main/product-main', {
                    products: products,
                    pages: count / pageSize
            });
        });
  });
});

module.exports = router;
