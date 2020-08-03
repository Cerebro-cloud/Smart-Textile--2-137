const express = require('express');
const myrouter = express.Router();
const admin = require('firebase-admin');
const { notify } = require('./products');
const db = admin.firestore();
const dbName = 'users';

myrouter.get('/',(req,res) => {
    res.send('Hello-world!');
});

myrouter.post('/create/:id',(req,res) => {
    ( async() => {
        try
        {
            await db.collection(dbName).doc('/'+ req.params.id +'/').create({
            uid: req.body.uid,
            name: req.body.name,
            company_name: req.body.company_name,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city,
            cities: req.body.cities,
            pincode: req.body.pincode,
            gst_num: req.body.gst_num,
            establishment_year: req.body.establishment_year,
            phone_no: req.body.phone_no,
            email: req.body.email,
            categories: req.body.categories,
            favourite_users: req.body.favourite_users,
            device_token: req.body.device_token,
            logo: req.body.logo,
            rating: req.body.rating,
            type: req.body.type,
            description: req.body.description,
            drivers: req.body.drivers,
            qrcode: req.body.qrcode
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



module.exports = myrouter;