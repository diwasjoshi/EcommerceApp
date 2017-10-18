var router = require('express').Router();


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


module.exports = router;
