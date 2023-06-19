//Both Apollo Server and express-graphql are GraphQL servers for Node.js
//This video implements Apollo server unlike the ninja tutorial
//Apollo server uses express 'behind the scenes'


//Dependency Imports
//const {ApolloServer }  = require ('apollo-server');
const {ApolloServer} = require ('@apollo/server');
const { startStandaloneServer } = require ('@apollo/server/standalone');

const dotenv = require('dotenv')
dotenv.config()


// we use this because we are making type defs and not a schema
const qgl = require('graphql-tag'); 
const mongoose = require('mongoose')

//Relative Imports 

//const { MONGODB } = require('./config.js')
const Post = require('./models/post')
const User = require('./models/user')
const typeDefs = require('./graphql/typeDefs.js')
const resolvers = require('./graphql/resolvers/index.js')



mongoose.connect(process.env.MONGODB, {useNewUrlParser: true})
    .then (() => {
        console.log('connected to database')
    })

const PORT = process.env.PORT || 4000



const server = new ApolloServer ({ typeDefs, resolvers });

const test = async() =>{

const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ req }),
    listen: { port: PORT },
  });
}
test()



// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({req}) => ({req })
// });


// mongoose.connect(MONGODB, {useNewUrlParser: true})
//     .then (() => {
//         console.log('connected to database')
//     })
//     .then(() => {
//         server.listen({port:PORT})
    
//     })
//     .then(res => {
//         console.log('server is running')
        
//     })
//     .catch(err => {
//         console.error(err)
//     })


