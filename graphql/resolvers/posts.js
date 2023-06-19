//const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/post')
const checkAuth = require('../util/checkauth');
const users = require('./users');


module.exports = {

Query: {
    async getPosts () {
      try {
        const posts = await Post.find().sort({createdAt: -1});
        return posts;
      } catch(err) {
        throw new Error(err);
      }
    },
    async getPost(_, {postId}){
        try{
            const post = await Post.findById(postId);
            if(post){
                return post; 
            } else {
                throw new Error('post not found')
            }
        } catch (err) {
            throw new Error(err)
        }
    }
  },
  Mutation: {
    async createPost(parent, {body}, context){
        //will only work if no errors
        const user = checkAuth(context);
        console.log(user)

        if(body.trim() === '') {
            throw new Error('Post body must not be empty')
        }

        const newPost = new Post({
            body, 
            user: user.id, 
            username: user.username, 
            createdAt: new Date().toISOString()
        })

        const post = await newPost.save(); 
        
     
        return post;

    }, 
    async deletePost(_, {postId}, context){
        const user = checkAuth(context); 

        try{
            const post = await Post.findById(postId); 
            if(user.username === post.username) {
                await post.deleteOne(); 
                return 'Post deleted sucessfully' }
            // } else { 
            //     throw new AuthenticationError('Action not allowed')
            // }
        } catch(err) {
            throw new(err)
        }
    },
    async likePost(_, {postId}, context){
        const {username} = checkAuth(context)

        const post = await Post.findById(postId)
        if(post){
            if(post.likes.find(like => like.username )){
                //post already liked, unlike it
                post.likes = post.likes.filter(like => like.username !==username)
            } else {
                //not liked, like post
                post.likes.push({
                    username, 
                    createdAt: new Date().toISOString

                })
            }
        
            await post.save()
            return post }
        // } else { 
        //     throw new UserInputError('Post not found')
        // }


    }

  }
}

//context is made available via the context in the apollo server