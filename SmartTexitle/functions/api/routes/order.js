const express = require('express');
const myrouter = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const db = admin.firestore();
const dbName = 'orders';

myrouter.get('/',(req,res) => {
    res.send('Hello-world!');
});


//Create ~ Post
myrouter.post('/create/:id',(req,res) => {
    ( async() => {
        try
        {
           await db.collection(dbName).doc('/'+req.params.id+'/').create({
                    orderID: req.params.id,
                    //Seller
                    sellerUID: req.body.sellerUID,
                    sellerName: req.body.sellerName,
                    sellerGST: req.body.sellerGST,
                    sellerAddress: req.body.sellerAddress,
                    sellerCity: req.body.sellerCity,
                    sellerState: req.body.sellerState,
                    sellerPincode: req.body.sellerPincode,
                    sellerPhoneNo: req.body.sellerPhoneNo,
                    
                    //Buyer
                    buyerUID: req.body.buyerUID,
                    buyerName: req.body.buyerName,
                    buyerGST: req.body.buyerGST,
                    buyerAddress: req.body.buyerAddress,
                    buyerCity: req.body.buyerCity,
                    buyerState: req.body.buyerState,
                    buyerPincode: req.body.buyerPincode,
                    buyerPhoneNo: req.body.buyerPhoneNo,

                    //Product Info
                    productUID: req.body.productUID,
                    product: req.body.product,
                    category: req.body.category,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    invoiceID: "",
                    //Tracking
                    accept: false,
                    completed: false
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

//Read by Seller ID (accept: false) - GET
myrouter.get('/readSellerF/:id', (req,res) => {
    let response = [];
    // eslint-disable-next-line consistent-return
    ( async() => {
        try
        {
            let query = db.collection(dbName)

            await query.where('sellerUID', '==', req.params.id)
            .where("accept", '==', false)
            .get()
            .then(snap => {
                    snap.forEach(doc => {
                        response.push(doc.data());
                    })
                    return response;   
    
            }) 
            console.log('Data found and retrieved!');
            return res.status(200).json(response);
            
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(Error);
        }
    })();
    //next();
});

//Read by Seller ID (accept: true) - GET
myrouter.get('/readSellerT/:id', (req,res) => {
    let response = [];
    // eslint-disable-next-line consistent-return
    ( async() => {
        try
        {
            let query = db.collection(dbName)

            await query.where('sellerUID', '==', req.params.id)
            .where("accept", '==', true)
            .get()
            .then(snap => {
                    snap.forEach(doc => {
                        response.push(doc.data());
                    })
                    return response;   
    
            }) 
            console.log('Data found and retrieved!');
            return res.status(200).json(response);
            
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(Error);
        }
    })();
    //next();
});

//Read by Seller ID (completed: true) - GET
myrouter.get('/readSellerCT/:id', (req,res) => {
    let response = [];
    // eslint-disable-next-line consistent-return
    ( async() => {
        try
        {
            let query = db.collection(dbName)

            await query.where('sellerUID', '==', req.params.id)
            .where("completed", '==', true)
            .get()
            .then(snap => {
                    snap.forEach(doc => {
                        response.push(doc.data());
                    })
                    return response;   
    
            }) 
            console.log('Data found and retrieved!');
            return res.status(200).json(response);
            
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(Error);
        }
    })();
    //next();
});

//Seller - Accept : True - Update
myrouter.put('/sellerAccept/:orderID', (req,res) => {
    ( async() => {
        try
        {
               const document = db.collection(dbName).doc(req.params.orderID);

               const a = document.update({
                    accept: true
               });

            console.log('---- Data updated ----');
            return res.status(200).json();
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    
    });

//Seller - completed : True - Update
myrouter.put('/sellerCompleted/:orderID', (req,res) => {
    ( async() => {
        try
        {
               const document = db.collection(dbName).doc(req.params.orderID);

               const a = document.update({
                    completed: true
               });

            console.log('---- Data updated ----');
            return res.status(200).json();
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    
    });

//Read by Buyer ID (accept: false) - GET
myrouter.get('/readBuyerF/:id', (req,res) => {
    let response = [];
    // eslint-disable-next-line consistent-return
    ( async() => {
        try
        {
            let query = db.collection(dbName)

            await query.where('buyerUID', '==', req.params.id)
            .where("accept", '==', false)
            .get()
            .then(snap => {
                    snap.forEach(doc => {
                        response.push(doc.data());
                    })
                    return response;   
    
            }) 
            console.log('Data found and retrieved!');
            return res.status(200).json(response);
            
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(Error);
        }
    })();
    //next();
});

//Read by Buyer ID (accept: true) - GET
myrouter.get('/readBuyerT/:id', (req,res) => {
    let response = [];
    // eslint-disable-next-line consistent-return
    ( async() => {
        try
        {
            let query = db.collection(dbName)

            await query.where('buyerUID', '==', req.params.id)
            .where("accept", '==', true)
            .get()
            .then(snap => {
                    snap.forEach(doc => {
                        response.push(doc.data());
                    })
                    return response;   
    
            }) 
            console.log('Data found and retrieved!');
            return res.status(200).json(response);
            
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(Error);
        }
    })();
    //next();
});

//Read by Buyer ID (completed: true) - GET
myrouter.get('/readBuyerCT/:id', (req,res) => {
    let response = [];
    // eslint-disable-next-line consistent-return
    ( async() => {
        try
        {
            let query = db.collection(dbName)

            await query.where('buyerUID', '==', req.params.id)
            .where("completed", '==', true)
            .get()
            .then(snap => {
                    snap.forEach(doc => {
                        response.push(doc.data());
                    })
                    return response;   
    
            }) 
            console.log('Data found and retrieved!');
            return res.status(200).json(response);
            
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(Error);
        }
    })();
    //next();
});


//Delete
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