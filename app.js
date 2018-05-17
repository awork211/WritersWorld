var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    Post       = require("./models/post"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");
    
    
mongoose.connect("mongodb://localhost/writersworld");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// passport configuration
app.use(require("express-session")({
    secret: "writers post",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate() from passportlocalMongoose in the user schema plugin
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    Post.find({}, function(err, allPosts){
        if(err){
            console.log(err);
        } else {
            res.render("posts/index", {posts: allPosts});
        }
    });
});

app.get("/post/new", function(req, res){
    res.render("posts/new");
});

app.post("/", function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var content = req.body.content;
   var newPost = {name: name, image: image, content: content};
   // create and save to db
   Post.create(newPost, function(err, newlyCreated){
    if(err){
        console.log(err);
    } else {
        res.redirect("/");
    }
   });
});

app.get("/post/:id", function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render("posts/show", {post: foundPost});
        }
    });
});

// comment routes below

app.get("/post/:id/comments/new", function(req, res){
     Post.findById(req.params.id, function(err, foundPost){
         if(err){
             console.log(err);
         } else {
             res.render("comments/new", {post: foundPost});
         }
     });
});

app.post("/post/:id/comments", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   foundPost.comments.push(comment);
                   foundPost.save();
                   res.redirect("/post/" + foundPost._id);
               }
            });
        }
    });
});

// AUTH ROUTES BELOW
app.get("/register", function(req, res){
   res.render("register");
});

app.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
          res.redirect("/"); 
       });
   });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("WritersWorld server has started!");
});