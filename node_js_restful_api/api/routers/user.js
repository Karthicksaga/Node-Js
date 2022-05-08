const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require("../models/user");
//create a sign in and Sign up routes


router.get("/allUser",(req, res, next) => {

    User.find()
    .then(result => {

       const response = {
              count: result.length,
              users : result.map(user => {

                    return{
                        id : user._id,
                        email: user.email,
                        type : {

                            method : "GET",
                            URL : "http://localhost:3000/users/" + user._id
                        }
                    }
              })
       }

       res.status(200).json(response);
    })
    .catch(err => {

        res.status(500).json({
            error: err
        });
    })
})

router.post("/signup",(req,res,next) => {

    //first check the user is already created if yes means redirect to 
    // sign up page

    User.find({email : req.body.email}).
    exec().
    then(user =>{
        if(user.length > 0){
            //409 Conflict request cannot be processed 
            return res.status(409).json({
                "message" : "User already exists"
            })
        }else{
                //why we use bcrypt to hash before
    //beacuse if we implement a becrypt before we can't use the password
    const salt = bcrypt.genSaltSync(10);
    //hash()
    // first param - is the password to be hashed with plaintext it can be anything
    // second param - is the salt - how many rounds to be perform to 
    // hash the password
    // third param - is the callback function
    // plain text can be anything would it take in our case we give our email id as plain text
    const plaintext = req.body.email;
    bcrypt.hash(plaintext, salt , (err, hash) =>{

        if(err){
            return res.status(500).json({
                error: err
            })
        }else{
            const user = new User({

                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });

            user.save()
            .then( result =>{

                console.log(result);
                res.status(201).json({
                    message: "User created"

                })
            }
            )
            .catch(err => {
                return res.status(500).json({
                    error: err
                })
            })
        }

    })
        }
    })
    
   
});

//login to get email and password create a tokens

router.post("/login",(req,res,next)=>{

    //find the User object
    User.find({email : req.body.email})
    .exec()
    .then(user =>{
        //user got an array of objects
        console.log(user)
        if(user.length < 1){
            //401 - unauthorized User
            return res.status(401).json({
                message : "Auth failed"
             })
        }else{
            
            console.log("Failed to fetch the User");
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                console.log("Comparing the values");
                console.log(user[0].password);
                if(err){
                    console.log("Compare error");
                    return res.status(401).json({
                        message : "Auth failed"
                    })
                }
              console.log(result)
               if(result){
                    console.log("Authentication Successfuly Query Executed");
    
                    return res.status(200).json({
                        message : "Auth successful"
                    });
                }else{
                    console.log("Authentication Failed");
                    return res.status(401).json({
                        message : "password does not matched"
                    });
                }
            });
        }
        //compare the password 
        // here compare the request body password and User fetch password
       
    })
})

//signup User /login user

router.post("/login2", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_KEY,
              {
                  expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

//delete user from the database


router.delete("/:userId", (req, res, next) => {

    console.log(req.params.userId);
    User.deleteOne({_id: req.params.userId})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "User deleted"
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
            message : "User Not Exists"
        })
    })
})
module.exports = router;