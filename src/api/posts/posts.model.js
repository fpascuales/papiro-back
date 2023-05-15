const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Types.ObjectId, ref: 'users'},
        title: {type: String, required: true},
        body: {type: String, required: true},
        image: {type: String},
        likes: {type: Number}
    },
    {
        timestamps: true,
        collection: 'posts'
    }
)

const Post = mongoose.model('posts', postSchema);
module.exports = Post;