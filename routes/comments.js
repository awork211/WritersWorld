var express = require("express"),
    router  = express.Router(),
    Post    = require("../models/post"),
    Comment = require("../models/comment");

router.get("/post/:id/comments/new", isLoggedIn, function(req, res){
     Post.findById(req.params.id, function(err, foundPost){
         if(err){
             console.log(err);
         } else {
             res.render("comments/new", {post: foundPost});
         }
     });
});

router.post("/post/:id/comments", isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   // add id and username
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   foundPost.comments.push(comment);
                   foundPost.save();
                   res.redirect("/post/" + foundPost._id);
               }
            });
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