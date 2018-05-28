var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    User       = require("./models/user"),
    postRoutes = require("./routes/posts"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");
    
// mongoose.connect("mongodb://localhost/writersworld");
mongoose.connect("mongodb://aaronn:aaronn@ds237770.mlab.com:37770/writersworld");

// app config
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// passport configuration
app.use(require("express-session")({
    secret: "writers post",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("WritersWorld server has started!");
});