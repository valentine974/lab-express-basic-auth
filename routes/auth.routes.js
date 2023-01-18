const router= require('express').Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User.model'); 
const { isLoggedIn } = require('../middleware/route-guard');
const saltR = 10;


router.get('/signup',(req,res)=>{
    res.render('auth/signup')
})

router.post('/signup',(req,res)=>{
    console.log(req.body)
    const {email, password} = req.body
    console.log(`password: ${password}`)

    if(!email || !password){
        res.render('auth/signup',{errorMessage:'fill both email and pwd'})
        return;
    }



    bcrypt
    .genSalt(saltR)
    .then((salt)=>{
        console.log("salt:",salt)
        return bcrypt.hash(password,salt) /* used to hash the password and adding the salt */
    })
    .then(passwordhashed=>{
        console.log("hashed: ", passwordhashed)
        return User.create({email:email, password:passwordhashed}) 
        
    })
    .then(()=> res.redirect('/profile'))
    
    .catch(err => {
        //Check if any of our mongoose validators are not being met
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: err.message });
        }
        //Check if the email is already registered with our website
        else if(err.code === 11000){
            res.render('auth/signup',{errorMessage:"find an email address not used"})
        }
         else {
            next(err);
        }
    });
})

 

router.get('/login',(req,res)=>{
    console.log(req.sesion)
    res.render('auth/login')
})



router.get('/profile',isLoggedIn ,(req, res) => {
    res.render('user/profile',{data:req.session.currentUser})
}) 

 

router.post('/login',(req,res)=>{
    console.log("SESSION =====>", req.session)
    console.log(req.body)
    const {email,password} = req.body

    //first we are checking if the user filled in all the required fields
    if(!email || !password){
        res.render('auth/login',{errorMessage:'please enter an email or password'})
    return
    }
    //second we are checking if the email is already registered with our website
    User.findOne({email})
    .then(user=>{
        console.log(user)
        if(!user){
            res.render('auth/login',{errorMessage:"User not found please sign up. No account associated with email"})
        }
        //compareSync() is used to compare the user inputted password with the hashed password in the database
        else if(bcrypt.compareSync(password,user.password)){
            //i can use req.session.currentUser in all my other routes
            req.session.currentUser = user
            res.redirect('/profile')
        }
        else{
            res.render('auth/login',{errorMessage:"Incorrect Password"})
        }

    })
    .catch(error=>{
        console.log(error)
    })

})
 


router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/login');
    });
  });

  router.get('/private-page',isLoggedIn,(req,res,next)=>{
    res.render('user/private-page')
  })

  router.get('/public-page',(req,res,next)=>{
    res.render('user/public-page')
  })

module.exports = router