const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const {UserInputError} = require('apollo-server')
 const{ GraphQLError } = require ('graphql');



const {validateRegisterInput, validateLoginInput} = require('../util/validators.js')
const User = require('../../models/user')
//const {SECRET_KEY} = require('../../config')


//in order to hash the password and create a user token, install bcrypt.js & jsonwebtoken

function generateToken(user){
    
        // create authentication token        
      return jwt.sign(
        {
            id: user.id, 
            email: user.email, 
            username: user.username
        }, process.env.SECRET_KEY, 
        {expiresIn: "1h"}
         );
}

module.exports = {
    Mutation: {
        async login (parent, {username, password}){



            const{errors, valid} = validateLoginInput(username, password)

            
            if(!valid){
                throw new GraphQLError( 'Errors', {extensions:{errors}})
            }



            const user = await User.findOne({username})
            if(!user){
                errors.general = 'User not found';
                throw new GraphQLError('Wrong credentials', {errors})
            }
            const match = await bcrypt.compare(password, user.password )
            if(!match){
                errors.general = 'Wrong credentials'
                throw new GraphQLError('Wrong credentials', {extensions: {errors},})
            }
            const token = generateToken(user)

            return {
                ...user._doc, 
                id:user._id,
                token              
            };    


        },
        async register(parent,
            {registerInput: {username, email, password, confirmPassword}
        },
         context, info
         ){
        //TODO Validate user data
        const {errors, valid} = validateRegisterInput(username, email, password, confirmPassword)
        //TODO make sure user does not already exist
        if(!valid) { 
            throw new GraphQLError('Errors', {extensions: {errors}})
        }

        const user = await User.findOne({username})
        if(user) {
          throw new GraphQLError('username is taken', {
            extensions:{
            errors: {
                username: 'This username is taken'
            }
            }
          }) 
        }


        //Todo hash password before stroing in database

        password = await bcrypt.hash(password, 12);

        const newUser = await new User({
            email,
            username, 
            password, 
            createdAt: new Date().toISOString
        });
        const res = await newUser.save()

        // create authentication token
        
        const token = generateToken(res)
 

        return {
            ...res._doc, 
            id:res._id,
            token
          
        };

        }
    }

};


// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { UserInputError } = require('apollo-server');

// const {
//   validateRegisterInput,
//   validateLoginInput
// } = require('../../util/validators');
// const { SECRET_KEY } = require('../../config');
// const User = require('../../models/user');

// function generateToken(user) {
//   return jwt.sign(
//     {
//       id: user.id,
//       email: user.email,
//       username: user.username
//     },
//     SECRET_KEY,
//     { expiresIn: '1h' }
//   );
// }

// module.exports = {
//   Mutation: {
//     async login(_, { username, password }) {
//       const { errors, valid } = validateLoginInput(username, password);

//       if (!valid) {
//         throw new UserInputError('Errors', { errors });
//       }

//       const user = await User.findOne({ username });

//       if (!user) {
//         errors.general = 'User not found';
//         throw new UserInputError('User not found', { errors });
//       }

//       const match = await bcrypt.compare(password, user.password);
//       if (!match) {
//         errors.general = 'Wrong crendetials';
//         throw new UserInputError('Wrong crendetials', { errors });
//       }

//       const token = generateToken(user);

//       return {
//         ...user._doc,
//         id: user._id,
//         token
//       };
//     },
//     async register(
//       _,
//       {
//         registerInput: { username, email, password, confirmPassword }
//       }
//     ) {
//       // Validate user data
//       const { valid, errors } = validateRegisterInput(
//         username,
//         email,
//         password,
//         confirmPassword
//       );
//       if (!valid) {
//         throw new UserInputError('Errors', { errors });
//       }
//       // TODO: Make sure user doesnt already exist
//       const user = await User.findOne({ username });
//       if (user) {
//         throw new UserInputError('Username is taken', {
//           errors: {
//             username: 'This username is taken'
//           }
//         });
//       }
//       // hash password and create an auth token
//       password = await bcrypt.hash(password, 12);

//       const newUser = new User({
//         email,
//         username,
//         password,
//         createdAt: new Date().toISOString()
//       });

//       const res = await newUser.save();

//       const token = generateToken(res);

//       return {
//         ...res._doc,
//         id: res._id,
//         token
//       };
//     }
//   }
// };