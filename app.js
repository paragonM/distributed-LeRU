
const express = require("express");
const app = express();
app.use(express.static("public"))
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: true}));

const cassandra=require("cassandra-driver");
const keyspace = "leru";
const datacenter ="datacenter1";
const contactPoints= [':9042'];
const client = new cassandra.Client({
contactPoints:contactPoints,
keyspace:keyspace,
localDataCenter:datacenter
});



app.get("/login",function(req,res){
    res.render("login.ejs")
});
app.get("/",function(req,res){
    res.render("index.ejs")
});
app.get("/register",function(req,res){
    res.render("register.ejs")
});
app.get("/inventory",function(req,res){
  res.render("inventory.ejs")
});

app.post("/login",function(req,res){
var data = req.body;
console.log(data.number,data.pass);
let querie = "select * from find_user_by_userid where phone_number="+(data.number)+" and passwords= '"+data.pass+"' ALLOW FILTERING;";
client.execute(querie, function(error, result){
  if(error){
    console.log("could not connect to db",error);
  }
  else{
    if(result.rows.length>0){
      res.redirect("/user/");
    }
    else{

      res.redirect("/login");

    }
    console.table(result.rows);
    console.log(querie);

  }
});
})

app.post("/register", function(req,res){
var data = req.body;;
var name = data.firstname + data.lastname;
let query="INSERT INTO find_user_by_userid(district,user_id, address, name, passwords, phone_number) VALUES('"+data.District+"',"+5000+", '"+data.Address+"', '"+name+"', '"+data.Password+"',"+data.phone_number+");";
console.log(query);
client.execute(query, function(error, result){
   if(error){
     res.redirect("/register");
     console.log(query + error);
   }
   else{
     res.redirect("/login");
     console.log(result);

   }

});

})





async function getInventoryByStoreId(storeId) {
  const query = 'SELECT * FROM find_inventory_information_bystoreid WHERE store_id = ?';
  const params = [storeId];

  const result = await client.execute(query, params, { prepare: true });

  return result.rows;
}

// Define route for displaying inventory information
app.get('/inventory/:storeId', async (req, res) => {
  const storeId = parseInt(req.params.storeId);

  try {
    const inventory = await getInventoryByStoreId(storeId);
    res.render('inventory', { inventory });
  } catch (error) {
    console.error('Error retrieving inventory:', error);
    res.status(500).send('Error retrieving inventory');
  }
});







app.listen(3000,function(req, res,error){
    console.log("node js is running")

});