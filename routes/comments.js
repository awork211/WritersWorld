var express = require("express"),
    router  = express.Router(),
    Post    = require("../models/post"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

router.get("/post/:id/comments/new", middleware.isLoggedIn, function(req, res){
     Post.findById(req.params.id, function(err, foundPost){
         if(err){
             console.log(err);
         } else {
             res.render("comments/new", {post: foundPost});
         }
     });
});

router.post("/post/:id/comments", middleware.isLoggedIn, function(req, res){
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

router.get("/post/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: foundComment, post_id: req.params.id});
        }
    });
});

router.put("/post/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/post/" + req.params.id);
       }
   });
});

router.delete("/post/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/post/" + req.params.id);
       }
   });
});

module.exports = router;