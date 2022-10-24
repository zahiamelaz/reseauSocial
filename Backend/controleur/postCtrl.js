const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require ('../utils/jwtUtils');
// Routes
module.exports = {
    createPost: (req, res) => {
        var headerAuth   = req.headers['authorization'];

        //decrypt token and get user id
        var userId  = jwtUtils.getUserId(headerAuth);
   
        console.log('---------------', userId)

        let content = req.body.content;
        let attachement = req.body.attachement;
    
    
        if (userId < 0)
        
            return res.status(400).json({ 'error': 'wrong token' });
        // Fields verification
        if (content == "" ) {
            return res.status(400).json({'error': 'An error occured : Missing parameters'});
        }  
         // Waterfall
        asyncLib.waterfall([
            (done) => {
                let newPost = models.post.create({
                    userId: userId,
                    content: content,
                    attachement: attachement,
                    likesCount:0,
                })
                .then((newPost) => {
                    done(newPost);
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(500).json({'error': 'An error occurred : unable to create posts'})
                });
            }
        ],
        (newPost) => {
            if(newPost) {
                return res.status(201).json({ 'postId': newPost.id, success: 'Post successfully created'
                })
            } 
        })
    },
    // getPost: (req, res) => {
    //     var postId = req.params.id;
        
    //     models.post.findOne({
    //         attributes: ['id', 'userId','content','attachement', 'likesCount',"createdAt", "updatedAt"],
    //         where: {id: postId}
    //     })
    //     .then((post) => {
    //         if(post){
    //             res.status(201).json(post)   
    //         }
    //         else {
    //             res.status(404).json({'error': 'post not found'})
    //         }
    //     })
    //     .catch((err) =>  {
    //       console.log(err)
    //         res.status(500).json({'error': 'Cannot fetch Post'});
    //     })
    // },
    // getAllInfo: (req, res) => {

    //     models.post.findAll({
    
    //         // attributes: [ 'id', 'userId','content','attachement', "createdAt", "updatedAt"],
    //         include :
    //             {
    //                 model : models.comment, include:[
    //                     {model:models.user},
    //                     // {model:models.like}
    //                 ]
    //             },                
    //             // {model:models.comment},
    //             // {model:models.like}
            
    //     })
    //     .then((posts) => {
    //         // refaire une requette 
    //         res.status(200).json({success:posts})
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.status(400).json({ error: 'An error occurred' });
    //     });
    // },

    getAllPosts: async (req, res) => {
        try {
            const user = await models.user.findAll({
                include: 
                    {
                      model: models.post,
                      as: "posts",
                    },
            });
          const post = await models.post.findAll({
            include: [
              {
                model: models.comment,
                as: "comments",
                include: [
                    {
                    model: models.user,
                    as: "users"
                    }
                 ]  
              },
              {
                model: models.user,
                as: "users"
              },
              {
                model: models.like,
                as: "likes"
              },

            ],
            order:[["createdAt","DESC"]]
          });
          return res.status(200).json({ post,user });
        } catch (error) {
          return res.status(500).send(error.message);
        }
      },
    updatePost: ( req, res) => {
    let headerAuth = req.headers['authorization']
    let userId = jwtUtils.getUserId(headerAuth);
    
    let content = req.body.content;
    let attachement = req.body.attachement;
    let postId = req.params.id;
    

  asyncLib.waterfall([
    (done) => {
        models.post.findOne({
            attributes: [ 'id', 'userId','content','attachement',"createdAt", "updatedAt"],
            where :{  
                userId: userId,
                id: postId
            }
        })
        .then((postFound)=> {
            done(null,postFound);
        })
        .catch((err) => {
            return res.status(400).json({ 'error': 'Unable to verify post' });
        });
    },
    (postFound, done) => {
        if(postFound) {
          postFound.update({
              content: (content ? content : postFound.content),
              attachement: (attachement ? attachement : postFound.attachement),   
          })
          .then((postFound) => {
              done(postFound);
          })
          .catch((err) => {
              res.status(500).json({ 'error': 'cannot update post' });
          });
        }
        else {
          res.status(404).json({ 'error': 'An error occurred' });
          console.log(error);
        }
      },
    ], 
    (postFound) => {
      if (postFound) {
          res.status(200).json({  'post':postFound ,'success': 'Post successfuly modified'})
      } 
      else {
        return res.status(500).json({ 'error': 'cannot update post' });
      }
    });
    },
    deletePost: (req, res) => {
        
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    let postId = req.params.id;

    asyncLib.waterfall([
        (done) => {
            models.post.destroy({
                where: { 
                   
                    id: postId 
                }
            })
            .then((postFound) => {
                done(postFound)
            })
            .catch((err) => {
                return res.status(400).json({ 'error': 'An error occurred' });
            });
        }],
        (postFound) => {
            if (postFound) {
                console.log(postFound)
                return res.status(200).json({'success':`post successfuly deleted`})
            }
            else {

                return res.status(404).json({ 'error': 'post was not found' });
            }
        });
    }, 
    // getPostUsername: (req, res) => {

    //     models.post.findAll({
    //       attributes: ["id", "userId", "content", "attachement", "likesCount","createdAt", "updatedAt"],
         
    //     })
    //       .then( (postFound) => {
    //             if (postFound) {
    //             models.user
    //                 .findAll({
    //                 attributes: ["id","attachement", "username","bio"],
    //                 })
    //         .then((userFound) => {
    //               if (userFound) {
    //                 return res.status(200).json({ 
    //                     allUsers : userFound,
    //                     allPosts : postFound
                        
    //                 });
    //               } else {
    //                 return res.status(403).json({ error: "user not found" });
    //               }
    //             })
    //             .catch( (error) => {
    //               return res.status(404).json({ error: "user not fetch" });
    //             });
    //         } else {
    //           return res.status(403).json({ error: "invalid user" });
    //         }
    //       })
    //       .catch((error) => {
    //         return res.status(500).json({ error: "post not found" });
    //       })
    // },
    // getAllPostsById: (req, res) => {
    //     let headerAuth = req.headers['authorization'];
    //     let userId = jwtUtils.getUserId(headerAuth);

    //     models.post.findAll({
    //         attributes: [ 'id', 'userId','content','attachement', "createdAt", "updatedAt"],
    //         where: { userId: userId }
    //     })
    //     .then((posts) => {
    //         res.status(200).json({success:posts})
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.status(400).json({ error: 'An error occurred' });
    //     });
    // },
    // adminDeleteProfilePosts: (req, res) => {
    //     /*** supprimer le compte d'un user avec destroy ***/
       
    //   let postId = req.params.id
    //     asyncLib.waterfall([
    //         (done) => {
    //             models.post.destroy({
    //                 where: { id: postId }
    //             })
    //             .then((postFound) => {
    //                 done(postFound)
    //             })
    //             .catch((err) => {
    //                 return res.status(400).json({ 'error': 'An error occurred' });
    //             });
    //         }],
    //         (postFound) => {
    //             if (postFound) {
    //                 return res.status(200).json({'success':`Post successfuly deleted`})
    //             }
    //             else {
    //                 return res.status(404).json({ 'error': 'Post was not found' });
    //             }
    //     });
    //   },
}
// exports.adminDeletePost = (req, res, next) => {
//     Post.findOne({
//             where: {
//                 id: req.params.id
//             }
//         })
//         .then(post => {
//             if (req.file) {
//                 const filename = post.imageUrl.split('/images/')[1];
//                 fs.unlink(`images/${filename}`, () => {
//                     post.destroy({
//                             where: {
//                                 id: req.params.id
//                             }
//                         })
//                         .then(() => res.status(200).json({
//                             message: 'Vous avez supprimé la publication du user'
//                         }))
//                         .catch(error => res.status(400).json({
//                             error
//                         }))
//                 })
//             } else {
//                 post.destroy({
//                         where: {
//                             id: req.params.id
//                         }
//                     })
//                     .then(() => res.status(200).json({
//                         message: 'Vous avez supprimé la publication du user'
//                     }))
//                     .catch(error => res.status(400).json({
//                         error
//                     }))
//             }
//         });
// };