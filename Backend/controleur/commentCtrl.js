const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require ('../utils/jwtUtils');
//routes
module.exports = {
    createComment: (req, res) => {
        var headerAuth   = req.headers['authorization'];

        //decrypt token and get user id
        var userId  = jwtUtils.getUserId(headerAuth);
   
        console.log('---------------', userId)
     
        let  postId= req.body.postId;
        let  content= req.body.content;
        if (content == '') {
            res.status(400).send({
                error: "impossible de publier un commentaire vide !"
            });
        }
        models.comment.create({
                userId: userId,
                postId: postId,
                content: content,
            })
            .then((comment) => res.status(200).json({
                successCom: 'votre commentaire est créé !',
                userId: req.body.userId,
                postId: req.body.postId,
                content: req.body.content,
            }))
            .catch(error => res.status(400).json({
                error: 'impossible de créer un commentaire',
            }))
    },
    // getComment: (req, res) => {
    //     const commentId = req.params.id;
    
    //     models.comment.findOne({
    //       attributes: ["id", "userId", "postId","content", "createdAt", "updatedAt"],
    //       where: { id: commentId },
    //     })
    //       .then((comment) => {
    //         if (comment) {
    //           res.status(201).json(comment);
    //         } else {
    //           res.status(404).json({ error: "User not found" });
    //         }
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //         res.status(500).json({ error: "Cannot fetch user" });
    //       });
    // },
    // getAllCommentsPost: (req, res) => {
       
    //         models.comment.findAll({
    //           attributes: ["id", "userId", "postId", "content", "createdAt", "updatedAt"],

    //           where: {
    //             postId: req.params.idpost
    //         }
    //         })
    //           .then((comment) => {
    //             res.status(200).json({success:comment});
    //           })
    //           .catch((err) => {
    //             res.status(400).json({ error: "An error occurred" });
    //           });
    // },
    updateComment: (req, res)=> {
      let headerAuth = req.headers['authorization'];
      let userId = jwtUtils.getUserId(headerAuth);

      let postId = req.params.postId;
      let commentId = req.params.id;
      let content = req.body.content;

      if (postId <= 0) {
          return res.status(400).json({ error: "invalid parameters" });
      }

      models.post.findOne({
          where: { id: postId }
      })
      .then((postFound)=> {
          if (postFound) {
              models.user.findOne({
                  where: { id: userId }
              })
              .then(function(userFound) {
                  if (userFound) {
                      models.comment.findOne({
                          where: { 
                              id: commentId,
                              postId: postId
                          }
                      })
                  .then(function(commentFound) {
                      if (commentFound) {
                          if (commentFound.dataValues.userId == userFound.id) {
                               commentFound.update({
                                   content: ( content ? content : commentFound.content )
                               })
                            return res.status(200)
                            .json({ success: "your comment has been updated" });
                            } else {
                            return res.status(403)
                            .json({ error: "you don't have the rights to update this comment" });
                            }
                          } else {
                            return res.status(404)
                            .json({ error: "comment not found" });
                          }
                  })
                  .catch(function(error) {
                          return res.status(500).json({ error: "unable to find comment" });
                  })
                  } else {
                      return res.status(403).json({ error: "invalid user" });
                  }
              })
              .catch(function(error) {
                  return res.status(500).json({ error: "unable to verify user" });
              })
          } else {
              return res.status(404).json({ error: "post not found" });
          }
      })
      .catch(function(error) {
          return res.status(500).json({ error: "unable to find post" });
      })
    },
    deleteComment:(req, res) => {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        let postId = req.body.postId;

        models.comment.findOne({
                where: {
                    id: req.params.id
                }
        })
        .then(comment => {
            if (comment.userId !== userId) {
                return res.status(400).json({
                    error:'Can not delete comment'
                })
            }
            models.comment.destroy({
                where: {
                    userId: userId,                    
                }
            })
            .then(() => res.status(200).json({
              success: 'oups ! le commentaire est bien effacé !'
            }))
            .catch(err => res.status(409).json({ 
              error: 'An error accured'
            }))
        });
    },
  //   getcommentUser: (req, res) => {

  //     models.post.findAll({
  
  //         // attributes: [ 'id', 'userId','content','attachement', "createdAt", "updatedAt"],
  //         include :[
  //             {
  //                 model : models.comment,
  //                 where: {
  //                       postId: req.params.idpost
  //                      }
  //             },                
  //             // {model:models.comment},
  //             // {model:models.like}
  //         ]
  //     })
  //     .then((posts) => {
  //         res.status(200).json({success:posts})
  //     })
  //     .catch((err) => {
  //         console.log(err);
  //         res.status(400).json({ error: 'An error occurred' });
  //     });
  // },
    // getcommentUser: (req, res) => {

    //   models.comment.findAll({
    //     attributes: ["id", "userId", "content","createdAt", "updatedAt"],
    //     where: {
    //       postId: req.params.idpost
    //   }
    //   })
    //     .then( (commentFound) => {
    //           if (commentFound) {
    //           models.user
    //               .findAll({
    //               attributes: ["id","attachement", "username"],
    //               })
    //       .then((userFound) => {
    //             if (userFound) {
    //               return res.status(200).json({ 
    //                   allUsers : userFound,
    //                   allComments : commentFound
                      
    //               });
    //             } else {
    //               return res.status(403).json({ error: "user not found" });
    //             }
    //           })
    //           .catch( (error) => {
    //             return res.status(404).json({ error: "user not fetch" });
    //           });
    //       } else {
    //         return res.status(403).json({ error: "invalid user" });
    //       }
    //     })
    //     .catch((error) => {
    //       return res.status(500).json({ error: "comment not found" });
    //     })
    // },
    // getAllComments: (req, res) => {

    // models.user.findAll({

    //     // attributes: [ 'id', 'userId','content','attachement', "createdAt", "updatedAt"],
    //     include :
    //         {
    //             model : models.comment
    //         },                    
    // })
    // .then((posts) => {
    //     res.status(200).json({success:posts})
    // })
    // .catch((err) => {
    //     console.log(err);
    //     res.status(400).json({ error: 'An error occurred' });
    // });
    // },
    
}