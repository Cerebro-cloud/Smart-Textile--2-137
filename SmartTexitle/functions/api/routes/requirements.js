const express = require('express');
const myrouter = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { route } = require('./users');
const { json } = require('body-parser');
const db = admin.firestore();
const dbName = 'requirements';

myrouter.get('/',(req,res) => {
    res.send('Hello-world!');
});

//Create ~ Post
myrouter.post('/create',(req,res) => {
    ( async() => {
        try
        {
           await db.collection(dbName).add({
                    uid: req.body.uid,
                    description: req.body.description,
                    category: req.body.category,
                    sub_category: req.body.sub_category,
                    starting_price: req.body.starting_price,
                    ending_price: req.body.ending_price    
                })
            console.log('---Data Added---');
            return res.status(200).json();
    }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
   // next();
    });

//Read all ~ Get
myrouter.get('/read', (req,res) => {
    ( async() => {
        try
        {
            let query = db.collection(dbName);
            let response = [] ;

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;

                for(let doc of docs)
                {
                    const selectedItem = {
                        uid: doc.data().uid,
                        description: doc.data().description,
                        category: doc.data().category,
                        sub_category: doc.data().sub_category,
                        starting_price: doc.data().starting_price,
                        ending_price: doc.data().ending_price
                    };
                    response.push(selectedItem);
                }
                return response; 
            })

            console.log('----Read All Data----');
            return res.status(200).json(response);
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    
    });

//Delete
myrouter.delete('/delete/:id',(req,res) => {
    (async() => {

        try
        {
            const document = db.collection(dbName).doc(req.params.id);
            await document.delete();
            console.log('---Data Deleted---')
            return res.status(200).json();
        }
        catch(error)
        {
            console.log(Error);
            return res.status(500).json(error);
        }
    })();
});
module.exports = myrouter;
