var express = require("express"),
    router  = express.Router(),
    Post    = require("../models/post");

router.get("/post/new", isLoggedIn, function(req, res){
    res.render("posts/new");
});

router.post("/", isLoggedIn, function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var content = req.body.content;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newPost = {name: name, image: image, content: content, author: author};
   // create and save to db
   Post.create(newPost, function(err, newlyCreated){
    if(err){
        console.log(err);
    } else {
        res.redirect("/");
    }
   });
});

router.get("/post/:id", function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render("posts/show", {post: foundPost});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;