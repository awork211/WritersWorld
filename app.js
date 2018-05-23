var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    User       = require("./models/user"),
    postRoutes = require("./routes/posts"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");
    
// app config
mongoose.connect("mongodb://localhost/writersworld");
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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("WritersWorld server has started!");
});