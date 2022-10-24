const express = require('express');
const route = express.Router();
const userCtrl = require('../controlleurs/userCtrl');
const postCtrl = require('../controlleurs/postCtrl');
const commentCtrl = require('../controlleurs/commentCtrl');
const likeCtrl = require('../controlleurs/likeCtrl');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/img/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });
exports.router = (() => {
  let route = express.Router();
//route resister

route.get('/register',(req,res)=>{res.render('register');})
route.post('/register',userCtrl.addUser);
//route login
route.get('/login',(req,res)=>{res.render('login');})
route.post('/login', userCtrl.logUser);
//routes home
 route.get('/',userCtrl.getUserByToken,userCtrl.getAllInfohome); 
route.post('/',upload.single('attachement'), postCtrl.createPost);
route.post('/delete', postCtrl.deletePost); 
route.post('/update/:id', postCtrl.updatePost); 

//route comment
route.get('/comment',userCtrl.getUserByToken,commentCtrl.getAllCommentByPost); 
route.post('/comment',commentCtrl.createComment);
route.post('/deletecomment',commentCtrl.deleteComment);
// route.post('/comment',commentCtrl.updateCom);

//route profile
route.get('/profile',userCtrl.getUserByToken,userCtrl.getAllInfo);
route.post('/profile',upload.single('attachement'),userCtrl.updateUser);
route.get('/profilebyid',userCtrl.getUserById2,userCtrl.getAllInfoprof2);
route.post('/deleteuser',userCtrl.deleteUser);


// //route like
 route.route('/postlike/:id').post(likeCtrl.createlike);
 route.route('/postunlike/:id').post(likeCtrl.unlike);


//route logout  
route.get('/logout',userCtrl.logOut);


return route;
})();




