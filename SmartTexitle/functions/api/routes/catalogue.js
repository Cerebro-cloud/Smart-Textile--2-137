const express = require('express');
const myrouter = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const db = admin.firestore();
const dbName = 'catalogues';

//Create ~ Post
myrouter.post('/create/:id',(req,res) => {
    ( async() => {
        try
        {
           await db.collection(dbName).doc('/'+req.params.id+'/').create({
                    catID: req.params.id,
                    pdf: req.body.pdf,
                    userID: req.body.userID,
                    connectedUsers: req.body.connectedUsers,
                    name: req.body.name,
                    category:req.body.category,
                    code: req.body.code,
                    public: req.body.public
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

//Read All - GET
myrouter.get('/read', (req,res) => {
    ( async() => {
        try
        {
            let query = db.collection(dbName);
            let response = [] ;

            await query.get().then(snap => {
                snap.forEach(doc => {
                    response.push(doc.data())
                })
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


//Read by Connected user
myrouter.get('/read/:id', (req,res) => {
    let response =[];
    ( async() => {
        try
        {
            const document = db.collection(dbName)
            .where('connectedUsers', 'array-contains-any', [req.params.id])
            .get().then(snap => {
                if(snap.empty){
                    console.log('No catalogues by your connections.');
                    return res.status(200).json();
                }
                else{
                    snap.forEach(doc => {
                        response.push(doc.data());
                    })
                    return response
                }
            })
            console.log('----Read Data----');
            return res.status(200).json(response);
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    //next();
});

//Read by User ID
myrouter.get('/readUserCatalogue/:id', (req,res) => {
    ( async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where("userID", "==", req.params.id)
            .get().then(snap => {
                if(snap.empty){
                    console.log("No data");
                    return res.status(500).json("No such data.");
                }else{
                    snap.forEach(doc => {
                        response.push(doc.data())
                    })
                    return response; 
            }
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



module.exports = myrouter;