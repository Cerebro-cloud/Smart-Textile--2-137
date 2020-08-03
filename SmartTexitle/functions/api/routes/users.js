const express = require('express');
const myrouter = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const db = admin.firestore();
const dbName = 'users';

myrouter.get('/',(req,res) => {
    res.send('Hello-world!');
});


//Create
//Post
myrouter.post('/create/:id',(req,res) => {
    ( async() => {
        
        var checkFlag = 1;
        let query = db.collection(dbName).where('gst_num', '==', req.body.gst_num).get()
        .then(snap => {
            if(snap.empty){
                checkFlag = 1;
                console.log('No such GST number was found.');
                return res.status(200).json();
            }
            else{
                var checkFlag = 0;
                console.log('Same GST number found.');
                return res.status(500).json('Same GST number found.');
            }
        })
    
            
        try
        {
            if (checkFlag === 0){
                console.log('Error writing into database: Same GST number found!');
           return res.status(600).json("Error: Same GST number found!");
       }
       else{
           
           await db.collection(dbName).doc('/' + req.params.id + '/')
                .create({
                    uid: req.body.uid, 
                    name: req.body.name,
                    company_name: req.body.company_name,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    pincode: req.body.pincode,
                    phone_no: req.body.phone_no,
                    email: req.body.email,
                    logo: req.body.logo,
                    website: req.body.website,
                    gst_num: req.body.gst_num,
                    establishment_year: req.body.establishment_year,
                    categories: req.body.categories,
                    device_token: req.body.device_token,
                    rating: req.body.rating,
                    type: req.body.type,
                    Saree: req.body.Saree,
                    Dress: req.body.Dress,
                    Ethnic_Wear: req.body.Ethnic_Wear,
                    Kurti: req.body.Kurti,
                    Apparel_And_Garments: req.body.Apparel_And_Garments,
                    Fabrics: req.body.Fabrics,
                    favourite_users: req.body.favourite_users,
                    favourite_products: req.body.favourite_products,
                    products: req.body.products,
                    description: req.body.description,
                    cities: req.body.cities,
                    bill_generated: req.body.bill_generated,
                    bill_recieved: req.body.bill_recieved,
                    qrcode: req.body.qrcode,
                    certificates: [],
                    connection: [],
                    new_connection: [],
                    send_connection: []

                })
            console.log('--- Data Added ---');
            return res.status(200).json();
        
       }
    }

        catch(error) 
        {
            console.log('--- Error ---');
            return res.status(500).send(Error);
        }
    })();
   // next();
    });



//Check GST ~ Get
myrouter.get('/check/:num', (req,res) => {
    let query = db.collection(dbName).where('gst_num', '==', req.params.num).get()
    .then(snap => {
        if(snap.empty){
            console.log('No such GST number was found.');
            return res.status(200).send("No such GST number was found.");
        }
        else{
            console.log('Same GST number found.');
            return res.status(500).send('Same GST number found.');
        }
    })
})

//read specific user by id
//get
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

//Read by UID ~ GET
myrouter.get('/readUID/', (req,res) => {
    uid = req.query.uid.split(',');
    let response = [];
    ( async() => {
        try
        {   
            for(var i = 0; i < uid.length; i++){
                const document = db.collection(dbName).doc('/' + uid[i] + '/'); 
                // eslint-disable-next-line no-await-in-loop
                let user = await document.get();  
                response.push(user.data());  
            }
            console.log('----Read UID Data----');
            return res.status(200).json(response)

       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    //next();
    });



//Filter ~ Get
myrouter.get('/filter/:value/:categ', (req,res) => {
    ( async() => {
        try
        {
            let query = db.collection(dbName).orderBy('rating', "desc");  
            let response = [] ;

            await query.where("type", "==", req.params.value)
            .where('categories', 'array-contains-any', [req.params.categ])
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

//Filter by category
myrouter.get('/type/:type',(req,res) => {
    // eslint-disable-next-line consistent-return
    (async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where("type", '==', req.params.type).get().then(snap => {
                
                if(snap.empty){
                    console.log('No such product found.');
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

//read all
//get
myrouter.get('/read', (req,res) => {
    ( async() => {
        try
        {
            let query = db.collection(dbName).orderBy('rating','desc');
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

//update
myrouter.put('/update/:id', (req,res) => {
    ( async() => {
        try
        {
               const document = db.collection(dbName).doc(req.params.id);

               await document.update({
                    uid:req.body.uid,
                    name: req.body.name,
                    company_name: req.body.company_name,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    pincode: req.body.pincode,
                    phone_no: req.body.phone_no,
                    email: req.body.email,
                    logo: req.body.logo,
                    website: req.body.website,
                    gst_num: req.body.gst_num,
                    establishment_year: req.body.establishment_year,
                    categories: req.body.categories,
                    rating: req.body.rating,
                    type: req.body.type,
                    Saree: req.body.Saree,
                    Dress: req.body.Dress,
                    Ethnic_Wear: req.body.Ethnic_Wear,
                    Kurti: req.body.Kurti,
                    Apparel_And_Garments: req.body.Apparel_And_Garments,
                    Fabrics: req.body.Fabrics,
                    favourite_users: req.body.favourite_users,
                    favourite_products: req.body.favourite_products,
                    products: req.body.products,
                    description: req.body.description,
                    cities: req.body.cities,
                    qrcode: req.body.qrcode,
                    certificates: req.body.certificates
               });

            console.log('---- Data Updated ----');
            return res.status(200).json();
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    
    });


//Update Driver ID - PUT
myrouter.put('/updateDriver/:id/:driver', (req,res) => {
    ( async() => {
        try
        {
               const document = db.collection(dbName).doc(req.params.id);

               const a = document.update({
                    drivers: admin.firestore.FieldValue.arrayUnion(req.params.driver)
               });

            console.log('---- Device Token Updated ----');
            return res.status(200).json();
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    
    });

//Update Connections
myrouter.put('/updateConnections/:id1/:id2', (req,res) => {
    ( async() => {
        try
        {
               await db.collection(dbName).doc(req.params.id1)
                .update({
                    connection: admin.firestore.FieldValue.arrayUnion(req.params.id2)
               });
               
               await db.collection(dbName).doc(req.params.id2)
               .update({
                    connection: admin.firestore.FieldValue.arrayUnion(req.params.id1)
               });
            console.log('---- Device Token Updated ----');
            return res.status(200).json();
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).send(Error);
        }
    })();
    
    });


//Update-Device Token 
myrouter.put('/update-d/:id/:device_token', (req,res) => {
    ( async() => {
        try
        {
               const document = db.collection(dbName).doc(req.params.id);

               const a = document.update({
                    device_token: req.params.device_token
               });

            console.log('---- Device Token Updated ----');
            return res.status(200).json();
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    
    });

//Remove Connections
myrouter.put('/removeConnections/:id1/:id2', (req,res) => {
    ( async() => {
        try
        {
               const document0 = db.collection(dbName).doc(req.params.id1);

               const a0 = document.update({
                    connection: admin.firestore.FieldValue.arrayRemove(req.params.id2)
               });
               
               const document1 = db.collection(dbName).doc(req.params.id2);

               const a1 = document.update({
                    connection: admin.firestore.FieldValue.arrayRemove(req.params.id1)
               });
            console.log('---- Device Token Updated ----');
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
