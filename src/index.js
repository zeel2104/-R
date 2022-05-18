var express = require('express');
var cookieSession = require("cookie-session");

var dbConfig = require("./src/config/db.config");
var mongoose = require('mongoose');
var csv = require("fast-csv");
var router = express.Router();
var fs = require('fs');
var User  = mongoose.model('Use');
var Product  = mongoose.model('Products');
var csvfile = __dirname + "/../public/files/products.csv";
var stream = fs.createReadStream(csvfile);
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Import CSV file using NodeJS' });
})

const app = express();

var corsOptions = {
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "intern2022",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./src/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });



router.get('/', function(req, res, next) {
 
    var  products  = []
    
var csvStream = csv()
        .on("data", function(data){
         
         var item = new Product({
              name: data[0],
              description: data[1],
              quantity: data[2],
              price: data[3],
              createdBy:data[4] 
         });
         
          item.save(function(error){
            console.log(item);
              if(error){
                   throw error;
              }
          }); 
    }).on("end", function(){
          console.log(" End of file import");
    });
  
    stream.pipe(csvStream);
    res.json({success : "Data imported successfully.", status : 200});
     
})
router.get('/fetchdata', function(req, res, next) {
    
    Product.find({}, function(err, docs) {
        if (!err){ 
            res.json({success : "Updated Successfully", status : 200, data: docs});
        } else { 
            throw err;
        }
    });
  
});
module.exports = router;