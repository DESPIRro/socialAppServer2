const postsResolvers = require('./posts')
const usersResolvers = require('./users')
const commentsResolvers = require('./comments')


module.exports= {
    //this first obkect is a modifier. It does calculations on the server side. ThE parent is Post from getPosts
            Post: {
                likeCount: (parent) => parent.likes.length,
                commentCount: (parent) => parent.comments.length
            },
           Query:{
            ...postsResolvers.Query

           }, 
           Mutation: {
            ...usersResolvers.Mutation,
            ...postsResolvers.Mutation,
            ...commentsResolvers.Mutation

           }, 
      

}

//The functions in post are called modifiers/