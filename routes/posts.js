var express = require("express"),
    router  = express.Router(),
    Post    = require("../models/post"),
    middleware = require("../middleware");

router.get("/post/new", middleware.isLoggedIn, function(req, res){
    res.render("posts/new");
});

router.post("/", middleware.isLoggedIn, function(req, res){
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

router.get("/post/:id/edit", middleware.checkPostOwnership, function(req, res){
   Post.findById(req.params.id, function(err, foundPost){
       if(err){
           req.flash("error", "Post not found.");
           res.redirect("/");
       }
       else {
           res.render("posts/edit", {post: foundPost});
       }
   });
});

router.put("/post/:id", middleware.checkPostOwnership, function(req, res){
   Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
      if(err){
          req.flash("error", "Could not update post.");
          res.redirect("/");
      }
      else {
          req.flash("success", "Post successfully updated!");
          res.redirect("/post/" + req.params.id);
      }
   });
});

router.delete("/post/:id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
       if(err){
           req.flash("error", "Something went wrong!");
           res.redirect("/");
       }  else {
           req.flash("success", "Post was removed.");
           res.redirect("/");
       }
    });
});

module.exports = router;