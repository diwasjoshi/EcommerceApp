var router = require('express').Router();
var Product = require('../models/product');

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

module.exports = router;
