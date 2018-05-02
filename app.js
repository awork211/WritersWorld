var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");
    
mongoose.connect("mongodb://localhost/writersworld");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

var postSchema = new mongoose.Schema({
    name: String,
    image: String,
    content: String
});

var Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
    Post.find({}, function(err, allPosts){
        if(err){
            console.log(err);
        } else {
            res.render("index", {posts: allPosts});
        }
    });
});

app.get("/new", function(req, res){
    res.render("new");
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
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render("show", {post: foundPost});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("WritersWorld server has started!");
});