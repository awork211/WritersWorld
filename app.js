var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser");
    

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

var posts = [
        {name: "Time Management", image: "https://images.unsplash.com/photo-1471174466996-0aa69dbda661?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e5ad6c80b0067af6b2859df12992457a&auto=format&fit=crop&w=1224&q=80"},
        {name: "API Design", image: "https://images.unsplash.com/19/desktop.JPG?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=60f9c32ab84b0de2266d6afca2fabf4c&auto=format&fit=crop&w=1350&q=80"},
        {name: "Work-life Balance", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c1b566f6cf95b8fe438961fd065158cd&auto=format&fit=crop&w=1350&q=80"},
        {name: "Time Management", image: "https://images.unsplash.com/photo-1471174466996-0aa69dbda661?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e5ad6c80b0067af6b2859df12992457a&auto=format&fit=crop&w=1224&q=80"},
        {name: "API Design", image: "https://images.unsplash.com/19/desktop.JPG?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=60f9c32ab84b0de2266d6afca2fabf4c&auto=format&fit=crop&w=1350&q=80"},
        {name: "Work-life Balance", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c1b566f6cf95b8fe438961fd065158cd&auto=format&fit=crop&w=1350&q=80"}
    ];

app.get("/", function(req, res){
    res.render("index", {posts: posts});
});

app.get("/new", function(req, res){
    res.render("new");
});

app.post("/", function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var post = {name: name, image: image};
   posts.push(post);
   res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("WritersWorld server has started!");
});