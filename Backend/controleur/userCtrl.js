const bcrypt = require('bcrypt');
var jwtUtils = require ('../utils/jwtUtils');
const models = require('../models');
var asyncLib = require('async');

// const
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{4,15}$/;
const USERNAME_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z]).{4,15}$/;
//routes
module.exports = {
    adUser: (req,res)=>{
        //parameters
      
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let bio = req.body.bio;
        let attachement = req.body.attachement;
        

        if( username == '' || email == '' || password == ''){
            return res.status(400).json({'error': 'champs vides'})
        };
        if(!USERNAME_REGEX .test(username)){
          return res.status(400).json({'error': 'username doit contenir que des lettres  Majuscule, Miniscule et 4 à 15caractéres'})
        };
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email invalid' });
        };
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'invalid password ( doit contenir au moins:4 caracteres, 1 majuscule, 1 miniscule et 1 chiffre' });
        }
        //waterfall
        asyncLib.waterfall([
            (done)=> {
                models.user.findOne({
                  attributes: ['email'],
                  where: { email: email }
                })
                .then((userFound)=> {
                  done(null, userFound);
                })
                .catch((err)=> {
                  return res.status(500).json({ 'error': 'unable to verify user' });
                });
            }, 
            (userFound, done) =>{
                if (!userFound) {
                  bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
                    done(null, userFound, bcryptedPassword);
                  });
                } else {
                  return res.status(400).json({ 'error': 'user exist déja' });
                }
            }, 
            (userFound, bcryptedPassword, done)=> {
                var newUser = models.user.create({
                  email: email,
                  password: bcryptedPassword,
                  username: username,
                  bio: bio,
                  attachement:attachement,

                })
                .then(function(newUser) {
                  done(newUser);
                })
                .catch(function(err) {
                  return res.status(500).json({ 'error': 'cannot add user' });
                });
            }
        ],(newUser) =>{
            if (newUser) {
              return res.status(200).json({'success': 'User successfully created', newUser});
            } else {
              return res.status(500).json({ 'error': 'cannot add user' });
            }
        });  
    },
    login:(req, res)=>{
      console.log(req);
      // params
      var email = req.body.email;
      var password = req.body.password;
      var bio = req.body.bio;
      var attachement = req.body.attachement;

      if (email == '' || password == '') {
          return res.status(400).json({ 'error': 'missing parameters'});
      }

      // verify  var
      asyncLib.waterfall([
          (done) =>{
            models.user.findOne({
              where: { email: email }
            })
            .then((userFound)=> {
              done(null, userFound);
            })
            .catch((err)=> {
              console.log(err)
              return res.status(500).json({ 'error': 'unable to verify user' });
            });
          },
          (userFound, done)=> {
            if (userFound) {
              bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                done(null, userFound, resBycrypt);
              });
            } else {
              return res.status(400).json({ 'error': 'user not exist in DB' });
            }
          },
          (userFound, resBycrypt, done)=> {
            if(resBycrypt) {
              done(userFound);
            } else {
              return res.status(400).json({ 'error': 'invalid password' });
            }
          }
        ], (userFound)=> {
          if (userFound) {
            return res.status(200).json({
              'userId': userFound.id,
              'admin': userFound.isAdmin,
              'token': jwtUtils.generateTokenForUser(userFound)
            });
          } else {
            return res.status(500).json({ 'error': 'cannot log on user' });
          }
        });
    },
    getUserById:(req, res)=> {
        userId = req.params.id;
        
        models.user.findOne({
            attributes: [ 'id', 'email', 'username','bio','attachement'],
             where: { id: userId }
        }).then((user) =>{
            if (user) {
            res.status(200).json({success:user});
            } else {
                res.status(400).json({ 'error': 'user not found' });
            }
        }).catch((err) =>{
            console.log(err)
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
    },
    getUserByToken:(req, res)=> {

      var headerAuth = req.headers['authorization'];
      var userId = jwtUtils.getUserId(headerAuth);
      console.log(headerAuth, '-----ici---', userId)
      // userId = req.params.id;
      
      if (userId < 0)
      
          return res.status(400).json({ 'error': 'wrong token' });
      
      models.user.findOne({
          attributes: [ 'id', 'email', 'username','bio','attachement'],
           where: { id: userId }
      }).then((user) =>{
          if (user) {
          res.status(200).json({success:user});
          } else {
              res.status(400).json({ 'error': 'user not found' });
          }
      }).catch((err) =>{
          console.log(err)
          res.status(500).json({ 'error': 'cannot fetch user' });
      });
    },
    // getAllUsers:(req, res) =>{

    //     models.user.findAll({
    //         attributes: [ 'id', 'email', 'username','bio','attachement' ]
    //     }).then(function(user) {
    //         if (user) {
    //         res.status(200).json({success:'user'});
    //         } else {
    //             res.status(400).json({ 'error': 'No user found' });
    //         }
    //     }).catch(function(err) {
    //       console.log(err)
    //         res.status(500).json({ 'error': 'cannot fetch user' });
    //     });
    // },
    putUser:(req, res) =>{

          var headerAuth = req.headers['authorization'];
          var userId = jwtUtils.getUserId(headerAuth);
          
          // Params
         
          let username = req.body.username;
          let bio = req.body.bio;
          let attachement = req.body.attachement;
          
          asyncLib.waterfall([
              function(done) {
              models.user.findOne({
                  attributes: ['id', 'username','bio','attachement'],
                  where: { id: userId }
              }).then(function (userFound) {
                  done(null, userFound);
              }).catch(function(err) {
                  console.log(err)
                  return res.status(500).json({ 'error': 'unable to verify user' });
              });
          },
              function(userFound, done) {
              if(userFound) {
                  userFound.update({
                  username : (username ? username : userFound.username),
                  bio : (bio ? bio : userFound.bio),
                  attachement : (attachement ? attachement : userFound.attachement),
                 
                  }).then(function() {
                      done(userFound);
                  }).catch(function(err) {
                      res.status(500).json({ 'error': 'cannot update user' });
                  });
              } else {
                  res.status(400).json({ 'error': 'user not found' });
              }
              },
          ], function(userFound) {
              if (userFound) {
                  return res.status(200).json({ 'success': 'User successfully updated' });
              } else {
                  return res.status(500).json({ 'error': 'cannot update user profile' });
              }
          });
    },
    deleteUser: (req, res) => {
        
        let headerAuth  = req.headers['authorization'];
        let userId  = jwtUtils.getUserId(headerAuth);

        asyncLib.waterfall([
            (done) => {
                models.user.destroy({
                    where: { id: userId }
                })
                .then((userFound) => {
                    done(userFound)
                })
                .catch((err) => {
                    return res.status(400).json({ 'error': 'An error occurred' });
                });
            }],
            (userFound) => {
                if (userFound) {
                    return res.status(200).json({'success':`User successfuly deleted`})
                }
                else {
                    return res.status(404).json({ 'error': 'User was not found' });
                }
        });
    },  
}