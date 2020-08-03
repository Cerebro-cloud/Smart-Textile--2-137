const express = require('express');
const myrouter = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const db = admin.firestore();
const dbName = 'drivers';


//Create - POST
myrouter.post('/create/:id',(req,res) => {
    ( async() => {
        try
        {
           await db.collection(dbName).doc('/'+ req.params.id + '/').create({
                    driverID: req.params.id,
                    userID: req.body.userID,
                    name: req.body.name,
                    phoneNo: req.body.phoneNo,
                    vehicleNo: req.body.vehicleNo,
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    loc_long: null,
                    loc_lat: null
                })
            console.log('---Data Added---');
            return res.status(200).json();
    }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).send(Error);
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

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;

                for(let doc of docs)
                {
                    const selectedItem = {
                        driverID: doc.data().driverID,
                        userID: doc.data().userID,
                        name: doc.data().name,
                        phoneNo: doc.data().phoneNo,
                        vehicleNo: doc.data().vehicleNo,
                        email: doc.data().email,
                        username: doc.data().username,
                        password: doc.data().password,
                        loc_long: doc.data().loc_long,
                        loc_lat: doc.data().loc_lat
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

//Filter by email
myrouter.get('/authentication/:email/:username/:pass',(req,res) => {
    // eslint-disable-next-line consistent-return
    (async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where("email", '==', req.params.email)
            .where("username", '==', req.params.username)
            .where("password", '==', req.params.pass)
            .get().then(snap => {
                
                if(snap.empty){
                    console.log('No such driver found.');
                    return res.status(404).json({data : "no data"})
                }
                else{
                    snap.forEach((doc) => {
                        response.push(doc.data());
                    })
                    console.log('----Read Required Data----');
                    return res.status(200).json(response);
                }
            })
       }
        catch(error) 
        {
            console.log('Error!');
            return res.status(500).json(error);
        }
    })();
});


//Read By User - GET
myrouter.get('/readUser/:id',(req,res) => {
    // eslint-disable-next-line consistent-return
    (async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where("userID", 'array-contains-any', [req.params.id])
            .get().then(snap => {
                
                if(snap.empty){
                    console.log('No such driver found.');
                    return res.status(404).json({data : "no data"})
                }
                else{
                    snap.forEach((doc) => {
                        response.push(doc.data());
                    })
                    console.log('----Read Required Data----');
                    return res.status(200).json(response);
                }
            })
       }
        catch(error) 
        {
            console.log('Error!');
            return res.status(500).json(error);
        }
    })();
});



//Read by ID - GET
myrouter.get('/read/:id', (req,res) => {
        ( async() => {
            try
            {
                const document = db.collection(dbName).doc(req.params.id); 
                let user = await document.get();  
                let response = user.data();  
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

//update location
myrouter.put('/updateLocation/:id/:long/:lat', (req,res) => {
    ( async() => {
        try
        {
               const document = db.collection(dbName).doc(req.params.id);

               await document.update({
                    loc_long: req.params.long,
                    loc_lat: req.params.lat
               });

            console.log('---- Location Updated ----');
            return res.status(200).json();
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    
    });



//delete
myrouter.delete('/delete/:id',(req,res) => {
    (async() => {

        try
        {
            const document = db.collection(dbName).doc(req.params.id);
            await document.delete();
            return res.status(200).json();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json(error);
        }
    })();
});

module.exports = myrouter;
