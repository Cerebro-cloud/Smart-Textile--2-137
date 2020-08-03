const express = require('express');
const myrouter = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { app } = require('firebase-admin');
const db = admin.firestore();
const dbName = 'invoice';

myrouter.get('/',(req,res) => {
    res.send('Hello-world!');
});

//Create ~ Post
myrouter.post('/create/:id',(req,res) => {
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    try{
    (   
        // eslint-disable-next-line consistent-return
        async() => {
        try
        {
           await db.collection(dbName).doc('/'+ req.params.id + '/')
           .create({
                    invoiceID: req.params.id,
                    //Seller
                    sellerID: req.body.sellerID,
                    sellerName: req.body.sellerName,
                    sellerGST: req.body.sellerGST,
                    sellerAddress: req.body.sellerAddress,
                    sellerPhoneNo: req.body.sellerPhoneNo,
                    
                    //Buyer
                    buyerID: req.body.buyerID,
                    buyerName: req.body.buyerName,
                    buyerGST: req.body.buyerGST,
                    buyerAddress: req.body.buyerAddress,
                    buyerPhoneNo: req.body.buyerPhoneNo,

                    //Transporter
                    transporterID: req.body.transporterID,
                    transporterName: req.body.transporterName,
                    transporterGST: req.body.transporterGST,
                    transporterPhoneNo: req.body.transporterPhoneNo,
                    driverID: "",

                    //Product Info
                    product: req.body.product,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    date: date+'-'+month+'-'+year,
                    qrcode: req.body.qrcode,
                    bill_link: req.body.bill_link,
                    orderID: req.body.orderID,


                    //Miscellaneous
                    pending: true,
                    inprogress: false,
                    completed: false
                })
            console.log('Bill generated!');
    }
        catch(error) 
        {
            console.log('Error generating bills!');
            return res.status(500).json(Error);
        }
        
    })();
    try{

        let query0 = db.collection('users').doc('/' + req.body.sellerID + '/')
        .update({
            bill_generated: admin.firestore.FieldValue.arrayUnion(req.params.id),
            //qrcode: admin.firestore.FieldValue.arrayUnion(req.body.qrcode)
        })

        let query1 = db.collection('users').doc('/' + req.body.buyerID + '/')
        .update({
            bill_recieved: admin.firestore.FieldValue.arrayUnion(req.params.id)
        })

        let query2 = db.collection('orders').doc('/' + req.body.orderID + '/')
        .update({
            invoiceID: req.params.id
        })
        console.log('Bills generated and recieved! Invoice ID added to the orders collection.');

    }
    catch(error){
            console.log('Error adding invoice ID to the collection!');
            return res.status(500).send(Error);
    }
    return res.status(200).json();
}catch(error){
            console.log('--Error--');
            return res.status(500).send(Error);
}
   // next();
    });


//Read ~ Get
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
                    invoiceID: doc.data().invoiceID,
                    //Seller
                    sellerID: doc.data().sellerID,
                    sellerName: doc.data().sellerName,
                    sellerGST: doc.data().sellerGST,
                    sellerAddress: doc.data().sellerAddress,
                    sellerPhoneNo: doc.data().sellerPhoneNo,
                    
                    //Buyer
                    buyerID: doc.data().buyerID,
                    buyerName: doc.data().buyerName,
                    buyerGST: doc.data().buyerGST,
                    buyerAddress: doc.data().buyerAddress,
                    buyerPhoneNo: doc.data().buyerPhoneNo,

                    //Transporter
                    transporterID: doc.data().transporterID,
                    transporterName: doc.data().transporterName,
                    transporterGST: doc.data().transporterGST,
                    transporterPhoneNo: doc.data().transporterPhoneNo,

                    //Product Info
                    product: doc.data().product,
                    quantity: doc.data().quantity,
                    price: doc.data().price,
                    date: doc.data().date,
                    qrcode: doc.data().qrcode,
                    bill_link: doc.data().bill_link,

                    //Miscellaneous
                    pending: doc.data().pending,
                    inprogress: doc.data().inprogress,
                    completed: doc.data().completed
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
/* --------------------------- HERE LIES ALL THE FUNCTIONS RELATED TO TRACKING-------------------- */
//Filter Transporter ID (pending: true)
myrouter.get('/filter/pendingTrue/:transportID',(req,res) => {
    // eslint-disable-next-line consistent-return
    (async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where("transporterID", '==', req.params.transportID)
            .where('pending', '==', true)
            .get().then(snap => {
                    snap.forEach((doc) => {
                        response.push(doc.data());
                    })
                    console.log('----Read Required Data----');
                    return res.status(200).json(response);
            })
       }
        catch(error) 
        {
            console.log('Error!');
            return res.status(500).json(error);
        }
    })();
});


//Filter TranportID (inprogress: true)
myrouter.get('/filter/inprogressTrue/:id',(req,res) => {
    // eslint-disable-next-line consistent-return
    (async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where('transporterID', '==', req.params.id)
            .where('inprogress', '==', true)
            .get().then(snap => {
                
                if(snap.empty){
                    console.log('No such data found.');
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


//Check DriverID and inprogress true
myrouter.get('/filter/inprogress-d/:id',(req,res) => {
    // eslint-disable-next-line consistent-return
    (async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where('driverID', '==', req.params.id)
            .where('inprogress', '==', true)
            .get().then(snap => {
                
                if(snap.empty){
                    console.log('No such data found.');
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


//Filter TransportID (completed: true)
myrouter.get('/filter/completedTrue/:id',(req,res) => {
    // eslint-disable-next-line consistent-return
    (async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where('transporterID', '==', req.params.id)
            .where('completed', '==', true)
            .get().then(snap => {
                
                if(snap.empty){
                    console.log('No such data found.');
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

//Make pending : false and inprogress : true , driverID
myrouter.put('/updatePendingAndInprogress/:id0/:id1', (req,res) => {
    ( async() => {
        try
        {
               const document = db.collection(dbName).doc(req.params.id0);

               const a = document.update({
                    pending: false,
                    inprogress: true,
                    driverID: req.params.id1
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

//Make complete: true, pending: false, inprogress: false
myrouter.put('/completedTrue/:id', (req,res) => {
    ( async() => {
        try
        {
               const document = db.collection(dbName).doc(req.params.id);

               const a = document.update({
                    pending: false,
                    inprogress: false,
                    completed: true
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

// ------------------------HERE ALL FUNCTIONS REQUIRED FOR TRACKING---------------------------
//Filter Seller ID
    myrouter.get('/filter/:id',(req,res) => {
        // eslint-disable-next-line consistent-return
        (async() => {
            try
            {
                let query = db.collection(dbName);  
                let response = [] ;
    
                await query.where('sellerID', '==', req.params.id).get().then(snap => {
                    
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
    

    //Read by ID
myrouter.get('/read/:id', (req,res) => {
        ( async() => {
            try
            {
                const document = db.collection(dbName).doc(req.params.id); 
                let invoice = await document.get();  
                let response = invoice.data();  
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