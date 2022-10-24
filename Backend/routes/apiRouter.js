const express = require('express');
const userCtrl = require('../controleur/userCtrl');
const postCtrl = require('../controleur/postCtrl');
const commentCtrl = require('../controleur/commentCtrl')
const likeCtrl = require('../controleur/likeCtrl')



// Router
exports.router = (() => {
    const apiRouter = express.Router();
    // Users routes
    apiRouter.route('/register').post(userCtrl.adUser);
    apiRouter.route('/login').post(userCtrl.login)
    apiRouter.route('/getuser/:id').get(userCtrl.getUserById);
    apiRouter.route('/getuser').get(userCtrl.getUserByToken);
    // apiRouter.route('/getallusers').get(userCtrl.getAllUsers);
    apiRouter.route('/updateuser').put(userCtrl.putUser);
    apiRouter.route('/deleteuser').delete(userCtrl.deleteUser);

    // Posts routes
    apiRouter.route('/createPost').post(postCtrl.createPost);
    apiRouter.route('/putpost/:id').put(postCtrl.updatePost);
    apiRouter.route('/deletePost/:id').delete(postCtrl.deletePost);
    // apiRouter.route('/getpost/:id').get(postCtrl.getPost);
    // apiRouter.route('/allpost').get(postCtrl.getAllPosts);
    // apiRouter.route('/allinfos').get(postCtrl.getAllInfo);
    apiRouter.route('/allinfos').get(postCtrl.getAllPosts);

    // apiRouter.route('/postUsername').get(postCtrl.getPostUsername);
    // apiRouter.route('/getAllPostsById').get(postCtrl.getAllPostsById);

    

    // // Comments routes
    apiRouter.route('/comments').post(commentCtrl.createComment);
    apiRouter.route('/deletecomment/:id').delete(commentCtrl.deleteComment);
    apiRouter.route('/post/:postId/updatecomment/:id').put(commentCtrl.updateComment);
    // apiRouter.route('/getcomment').get(commentCtrl.getComment);
    // apiRouter.route('/getallcomments').get(commentCtrl.getAllComments);
    // // apiRouter.route('/allcomments-post/:idpost').get(commentCtrl.getAllCommentsPost);
    // apiRouter.route('/allusercomments-post/:idpost').get(commentCtrl.getcommentUser);
    // apiRouter.route('/allcomments/:idpost').get(commentCtrl.getcommentUser);

    // // Likes routes
    apiRouter.route('/post/:id/like').post(likeCtrl.like);
    apiRouter.route('/post/:id/dislike').post(likeCtrl.unlike);

    // Admin routes
    // apiRouter.route('/admindeleteusers/:id').delete(userCtrl.adminDeleteProfileUser);
    // apiRouter.route('/admindeleteposts/:id').delete(postCtrl.adminDeleteProfilePosts);


    return apiRouter;
})();
