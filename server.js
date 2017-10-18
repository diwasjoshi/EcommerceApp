var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsMate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var mongoStore = require('connect-mongo')(session);
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


var config = require('./config/config');
var User = require('./models/user');
var Category = require('./models/category');


var app = express();

//Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secretKey,
    store: new mongoStore({ url: config.database, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(flash());

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(function(req, res, next){
    Category.find({}, function(err, categories){
        if(err) return next(err);
        res.locals.categories = categories;
        next();
    })
})
// Routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var categoryRoutes = require('./routes/category');
var productRoutes = require('./routes/product');
var searchApi = require('./api/search');

app.use('/', mainRoutes);
app.use('/user/', userRoutes);
app.use('/admin/', adminRoutes);
app.use('/category/', categoryRoutes);
app.use('/product/', productRoutes);
app.use('/api/search/', searchApi);

mongoose.connect(config.database, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("connected to the databse");
    }
});

app.listen(config.port, function(err){
    if(err) throw err;
    console.log('App is running');
})

app.get('/', function(req, res){
    res.render('home');
})
