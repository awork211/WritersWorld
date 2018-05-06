var mongoose   = require("mongoose");

var postSchema = new mongoose.Schema({
    name: String,
    image: String,
    content: String,
    comments: [
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);