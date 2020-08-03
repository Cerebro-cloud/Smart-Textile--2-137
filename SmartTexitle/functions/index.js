const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarttextile-137.firebaseio.com/"
});

const express = require('express');
//const cors = require('cors');
const cors = require('cors')({origin: true});
const app = express();
const db = admin.firestore();

//app.use( cors({ origin: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const userRoutes = require('./api/routes/users');
const productRoutes = require('./api/routes/products');
const requirementRoutes = require('./api/routes/requirements');
const invoiceRoutes = require('./api/routes/invoice');
const orderRoutes = require('./api/routes/order');
const driverRoutes = require('./api/routes/drivers');
const catalogueRoutes = require('./api/routes/catalogue');
//const transporterRoutes = require('./api/routes/transporter');


app.use((req, res, next) => {
  req.db = db;
  //console.log('Hi..');
  next();
});

app.use('/users',userRoutes);
app.use('/products',productRoutes);
app.use('/req',requirementRoutes);
app.use('/invoice',invoiceRoutes);
app.use('/orders',orderRoutes);
app.use('/drivers',driverRoutes);
app.use('/catalogues',catalogueRoutes);
//app.use('/transporter',transporterRoutes);




// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//       message: err.message,
//       error: {}
//   });
//   next();
// });



// app.get('/hello',function(req,res,next){
//   console.log('hi....');
//     return res.status(200).send('Hello-world!');
// next();
//  });
exports.app = functions.https.onRequest(app);