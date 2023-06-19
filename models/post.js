const {model, Schema} = require('mongoose');

const postSchema = new Schema({
    body:String, 
    username: String, 
    createdAt: String, 
    comments: [{
        body: String, 
        username:String, 
        createdAt: String,

    }], 
    likes: [{
        username:String, 
        createdAt: String
    }], 
    user: {
        type: Schema.Types.ObjectId, 
        refs: 'users'
    }
})

module.exports = model('Post', postSchema )

// Mongodb is schemaless. There are no relations in Mongodb but the mongoose ORM allows us to have relations between our models.
//Here the user is a relationship between the post and users model

