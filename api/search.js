var router = require('express').Router();
var Product = require('../models/product');



router.get('/', function(req, res, next) {
  console.log(req.query.search_term);
  Product.search({
        query_string: { query: req.query.search_term }
    }, function(err, results) {
        if (err) return next(err);
        res.json(results);
  });
});

module.exports = router;
