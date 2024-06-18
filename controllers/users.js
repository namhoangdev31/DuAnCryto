import  sequelize from '../dbConnection.js';
import User from '../models/User.js';
import { hashPassword, matchPassword } from '../utils/password.js';
import { signToken, decodeToken } from '../utils/jwt.js';


export async function createUser(req,res) {
    try{
        if(!req.body.user.username) throw new Error("Username is Required")
        if(!req.body.user.email) throw new Error("Email is Required")
        if(!req.body.user.password) throw new Error("Password is Required")
        
        const existingUser = await User.findByPk(req.body.user.email)
        if(existingUser)
            throw new Error('User aldready exists with this email id')

        const password = await hashPassword(req.body.user.password);
        const user = await User.create({
            username: req.body.user.username,
            password: password,
            email: req.body.user.email
        })
        
        if(user){
            if(user.dataValues.password)
                delete user.dataValues.password
            user.dataValues.token = await signToken(user)
            user.dataValues.bio = null
            user.dataValues.image = null
            res.status(201).json({user})
        }    
    }catch (e){
        res.status(422).json({errors: { body: [ 'Could not create user ', e.message ] }})
    }   
}

export async function loginUser(req,res) {
    try{
        if(!req.body.user.email) throw new Error('Email is Required')
        if(!req.body.user.password) throw new Error('Password is Required')

        const user = await User.findByPk(req.body.user.email)

        if(!user){
            res.status(401)
            throw new Error('No User with this email id')
        }
        
        //Check if password matches
        const passwordMatch = await matchPassword(user.password,req.body.user.password)

        if(!passwordMatch){
            res.status(401)
            throw new Error('Invalid password or email id')
        }
            
        delete user.dataValues.password
        user.dataValues.token = await signToken({email: user.dataValues.email,username:user.dataValues.username})

        res.status(200).json({user})
    }catch(e){
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({errors: { body: [ 'Could not create user ', e.message ] }})
    }
}

export async function getUserByEmail(req,res) {
    try{
        const user = await User.findByPk(req.user.email)
        if(!user){
            throw new Error('No such user found')
        }
        delete user.dataValues.password
        user.dataValues.token = req.header('Authorization').split(' ')[1]
        return res.status(200).json({user})
    }catch(e){
        return res.status(404).json({
            errors: { body: [ e.message ] }
        })
    }
}

export async function updateUserDetails(req,res) {
    try{
        const user = await User.findByPk(req.user.email)

        if(!user){
            res.status(401)
            throw new Error('No user with this email id')
        }
            
        
        if(req.body.user){
            const username = req.body.user.username ? req.body.user.username : user.username
            const bio = req.body.user.bio ? req.body.user.bio : user.bio
            const image = req.body.user.image ? req.body.user.image : user.image
            let password = user.password
            if(req.body.user.password)
                password = await hashPassword(req.body.user.password)

            const updatedUser = await user.update({username,bio,image,password})
            delete updatedUser.dataValues.password
            updatedUser.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(updatedUser)
        }else{
            delete user.dataValues.password
            user.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(user)
        }
        
    }catch(e){
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [ e.message ] }
        })
    }
    
}