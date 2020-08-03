const express = require('express');
const myrouter = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const db = admin.firestore();
const dbName = 'products';

myrouter.get('/',(req,res) => {
    res.send('Hello-world!');
});


//Create
//Post
myrouter.post('/create',(req,res) => {
    ( async() => {
        try
        {
           await db.collection(dbName).doc('/' + req.body.id + '/').create({
                    id: req.body.id,
                    uid: req.body.uid,
                    name: req.body.name,
                    mrp: req.body.mrp,
                    cp: req.body.cp,
                    sp: req.body.sp,
                    unit_type: req.body.unit_type,
                    min_order: req.body.min_order,
                    description: req.body.description,
                    payment_options: req.body.payment_options,
                    supply: req.body.supply,
                    delivery_time: req.body.delivery_time,
                    packaging_details: req.body.packaging_details,
                    dispatch_loc: req.body.dispatch_loc,
                    primary_img: req.body.primary_img,
                    secondary_img: req.body.secondary_img,
                    category: req.body.category,
                    sub_category: req.body.sub_category,
                    blouse_fabric: req.body.blouse_fabric,
                    brand: req.body.brand,
                    colour: req.body.colour,
                    fabric: req.body.fabric,
                    material: req.body.material,
                    occassion: req.body.occassion,
                    pattern: req.body.pattern,
                    sample_order: req.body.sample_order,
                    set_content: req.body.set_content,
                    size: req.body.size,
                    sleeve_type: req.body.sleeve_type,
                    stiched_type: req.body.stiched_type,
                    use: req.body.use,
                    width: req.body.width,
                    work: req.body.work,
                    rating: req.body.rating,
                    sellerName: req.body.sellerName,
                    sellerAddress: req.body.sellerAddress,
                    images: req.body.images,
                    counter: 0
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



//Read by UID - GET
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
//Read by Image - GET
myrouter.get('/readIMG/', (req,res) => {
    img = req.query.img.split(',');
    let response = [];
    // eslint-disable-next-line consistent-return
    ( async() => {
        try
        {   
            let Query = db.collection(dbName);
            await Query.where('images', 'array-contains-any', img).get()
            .then(snap => {
                if(snap.empty){
                    console.log('No such images found');
                    return res.status(404).json('No images');
                }
                else{
                    snap.forEach(doc => {
                        response.push(doc.data());
                    })
                    console.log('Data retrieved');
                    return res.status(200).json(response);
                }
            }
            )
       }
        catch(error) 
        {
            console.log('Error');
            return res.status(500).json(error);
        }
    })();
    //next();
    });
    
//read specific product by id
//get
myrouter.get('/read/:id', (req,res) => {
    ( async() => {
        try
        {
            const document = db.collection(dbName).doc(req.params.id); 
            let doc = await document.get();  
            let response = {        
                id: doc.id,
                uid: doc.data().uid,
                name: doc.data().name,
                mrp: doc.data().mrp,
                cp: doc.data().cp,
                sp: doc.data().sp,
                unit_type: doc.data().unit_type,
                min_order: doc.data().min_order,
                description: doc.data().description,
                payment_options: doc.data().payment_options,
                supply: doc.data().supply,
                delivery_time: doc.data().delivery_time,
                packaging_details: doc.data().packaging_details,
                dispatch_loc: doc.data().dispatch_loc,
                primary_img: doc.data().primary_img,
                secondary_img: doc.data().secondary_img,
                category: doc.data().category,
                sub_category: doc.data().sub_category,
                blouse_fabric: doc.data().blouse_fabric,
                brand: doc.data().brand,
                colour: doc.data().colour,
                fabric: doc.data().fabric,
                material: doc.data().material,
                occassion: doc.data().occassion,
                pattern: doc.data().pattern,
                sample_order: doc.data().sample_order,
                set_content: doc.data().set_content,
                size: doc.data().size,
                sleeve_type: doc.data().sleeve_type,
                stiched_type: doc.data().stiched_type,
                use: doc.data().use,
                width: doc.data().width,
                work: doc.data().work,
                rating: doc.data().rating,
                sellerName: doc.data().sellerName,
                sellerAddress: doc.data().sellerAddress,
                images: doc.data().images,
                counter: doc.data().counter
            };
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

//Filter UID and Category - Get
myrouter.get('/filterUID/:uid/:category',(req,res) => {
    // eslint-disable-next-line consistent-return
    (async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where('uid', '==', req.params.uid)
            .where('category','==', req.params.category)
            .get().then(snap => {
                
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


//Filter ~ Get
myrouter.get('/filter/:key/:value',(req,res) => {
    // eslint-disable-next-line consistent-return
    (async() => {
        try
        {
            let query = db.collection(dbName);  
            let response = [] ;

            await query.where(req.params.key, '==', req.params.value).get().then(snap => {
                
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

//read all by counter
//get
myrouter.get('/readByCounter', (req,res) => {
    ( async() => {
        try
        {
            let query = db.collection(dbName).orderBy('counter','desc');
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


//read all
//get

myrouter.get('/read', (req,res) => {
    ( async() => {
        try
        {
            let query = db.collection(dbName).orderBy('rating','desc');
            let response = [] ;

            await query.get().then(snap => {
                let docs = snap.docs;

                for(let doc of docs)
                {
                    const selectedItem = {
                        
                        id: doc.id,
                        uid: doc.data().uid,
                        name: doc.data().name,
                        mrp: doc.data().mrp,
                        cp: doc.data().cp,
                        sp: doc.data().sp,
                        unit_type: doc.data().unit_type,
                        min_order: doc.data().min_order,
                        description: doc.data().description,
                        payment_options: doc.data().payment_options,
                        supply: doc.data().supply,
                        delivery_time: doc.data().delivery_time,
                        packaging_details: doc.data().packaging_details,
                        dispatch_loc: doc.data().dispatch_loc,
                        primary_img: doc.data().primary_img,
                        secondary_img: doc.data().secondary_img,
                        category: doc.data().category,
                        sub_category: doc.data().sub_category,
                        blouse_fabric: doc.data().blouse_fabric,
                        brand: doc.data().brand,
                        colour: doc.data().colour,
                        fabric: doc.data().fabric,
                        material: doc.data().material,
                        occassion: doc.data().occassion,
                        pattern: doc.data().pattern,
                        sample_order: doc.data().sample_order,
                        set_content: doc.data().set_content,
                        size: doc.data().size,
                        sleeve_type: doc.data().sleeve_type,
                        stiched_type: doc.data().stiched_type,
                        use: doc.data().use,
                        width: doc.data().width,
                        work: doc.data().work,
                        rating: doc.data().rating,
                        sellerName: doc.data().sellerName,
                        sellerAddress: doc.data().sellerAddress,
                        images: doc.data().images
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


//Increment Counter - Update
myrouter.put('/incrementCounter/:id', (req,res) => {
    ( async() => {
        try
        {
               const document = db.collection(dbName).doc(req.params.id);
               
               await document.update({
                    counter: admin.firestore.FieldValue.increment(1)
               });

            console.log('---- Counter Incremented ----');
            return res.status(200).json();
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
                uid: req.body.uid,
                name: req.body.name,
                mrp: req.body.mrp,
                cp: req.body.cp,
                sp: req.body.sp,
                unit_type: req.body.unit_type,
                min_order: req.body.min_order,
                description: req.body.description,
                payment_options: req.body.payment_options,
                supply: req.body.supply,
                delivery_time: req.body.delivery_time,
                packaging_details: req.body.packaging_details,
                dispatch_loc: req.body.dispatch_loc,
                primary_img: req.body.primary_img,
                secondary_img: req.body.secondary_img,
                category: req.body.category,
                sub_category: req.body.sub_category,
                blouse_fabric: doc.data.blouse_fabric,
                brand: req.body.brand,
                colour: req.body.colour,
                fabric: req.body.fabric,
                material: req.body.material,
                occassion: req.body.occassion,
                pattern: req.body.pattern,
                sample_order: req.body.sample_order,
                set_content: req.body.set_content,
                size: req.body.size,
                sleeve_type: req.body.sleeve_type,
                stiched_type: req.body.stiched_type,
                use: req.body.use,
                width: req.body.width,
                work: req.body.work,
                rating: req.body.rating,
                sellerName: req.body.sellerName,
                sellerAddress: req.body.sellerAddress,
                images: req.body.images
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