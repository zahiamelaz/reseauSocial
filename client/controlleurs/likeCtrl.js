const { json } = require('express');
const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

//functions
exports.createlike = async (req, res) => {
    console.log( '-----hello---', req.params.id)
  // POST request using fetch()
  fetch(`http://localhost:3008/api/post/${req.params.id}/like`, {
    
  // Adding method type
  method: "POST",  
  // Adding headers to the request
  headers: {
      Authorization: localStorage.getItem('token'),// Token à récupérer 
      "Accept": 'application/json',
      "Content-type": "application/json"
  }
}) 
// Converting to JSON
  .then(response => response.json())
  
  // // Displaying results to console
  .then(json => {
    res.redirect('/')
   })
  // .then(json => console.log('------------here---- ', json))
  // if(json.success){

  //   res.redirect('/')   
  // }
}

exports.unlike = async (req, res) => {
  console.log( '-----hello---', req.params.id)
// POST request using fetch()
fetch(`http://localhost:3008/api/post/${req.params.id}/dislike`, {
  
// Adding method type
method: "POST",  
// Adding headers to the request
headers: {
    Authorization: localStorage.getItem('token'),// Token à récupérer 
    "Accept": 'application/json',
    "Content-type": "application/json"
}
}) 
// Converting to JSON
.then(response => response.json())

// Displaying results to console
.then(json => {
  console.log('-----------------------UNLIKE TEST-----',json);
 res.redirect('/')
})
}