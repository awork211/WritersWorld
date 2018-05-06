var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Post       = require("./models/post"),
    Comment    = require("./models/comment");
    
    
mongoose.connect("mongodb://localhost/writersworld");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("WritersWorld server has started!");
});