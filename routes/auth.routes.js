const router= require('express').Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model') 



router.get('/signup',(req,res)=>{
    res.render('auth/signup')
})

router.post('/signup',(req,res)=>{
    console.log(req.body)
    const {username, password} = req.body

    bcrypt
    .genSalt(10)
    .then((salt)=>{
        console.log("salt:",salt)
        return bcrypt.hash(password,salt) /* used to hash the password and adding the salt */
    })
    .then(passwordhashed=>{
        console.log("hashed: ", hashedPassword)
        User.create({username:username, password:passwordhashed}) 
        // res.redirect('/')
    })
    .catch((err)=>console.log(err))
})

router.get('/profile',(req,res)=>{
    res.render('user/user-profile')
})

module.exports = router