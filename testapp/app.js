const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cassandra=require("cassandra-driver");

const keyspace = "leru";
const datacenter ="datacenter1";
const contactPoints= ['192.168.43.66:9042'];
const client = new cassandra.Client({
contactPoints:contactPoints,
keyspace:keyspace,
localDataCenter:datacenter
});

//let array = [];//("nothing","nothing2","nothing3","nothing4")

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req,res){
  res.render("application/images/index.ejs")
})
app.get("/login/:status",function(req,res){
  if(req.params.status=="good"){
  res.render("application/images/login.ejs");
}
else{
  res.render("application/images/loginb.ejs");
}
})
app.get("/register",function(req,res){
  res.render("application/images/register.ejs")
})

app.get("/user/:m",function(req,res){
  let array = [];
  let query = "select * from store_by_user where user_id="+req.params.m+" ALLOW FILTERING";
  client.execute(query, function(error, result1){
//    console.table(result1.rows);

//    array = new Array(result1.rows.length,4);
try{
    for(let i=0;i < result1.rows.length;i++){
      array.push([result1.rows[i].store_id,result1.rows[i].address,result1.rows[i].district,result1.rows[i].name])
    }
  }
  catch{}
  try{
    console.table(result1.rows);
  //  console.log(result.rows.length);
    console.log("non whatsoever");
    console.log(array.length);
  }
  catch{}
    res.render("application/images/user.ejs",{
      array1:array,
      param: req.params.m


    })


  })
console.table(array)

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
      res.redirect("/user/"+result.rows[0].user_id);

    }
    else{
  //    alert("wrong inputs");

      res.redirect("/login/bad");

    }
    console.table(result.rows);
    console.log(result.rows[0].district);

  }
});
})
app.get("/addstore/:userid/",function(req,res,next){
  res.render("application/images/addstore.ejs",{
    param: req.params.userid
  })

})

app.post("/addstore/:n",function(req,res){
  let id =Math.round(Math.random()*10000);
  let store = Math.round(Math.random()*10000);
  console.log(id);
  console.log(store);
  var data = req.body;
  let query= "insert into store_by_user(user_id,store_id,address,district,name) values ("+req.params.n+","+store+",'"+data.address+"','"+data.district+"','"+data.name+"');";

  client.execute(query, function(error, result){
    if(error){
      console.log("could not connect to db",error);
      res.redirect("/addstore/"+req.params.n);

    }
      else{
        res.redirect("/user/"+req.params.n);
      }
      try{
      console.table(result.rows);
      console.log(result.rows[0].district);
    }
    catch{}
    }
  );

})
app.get("/pos/:mona/:owner",function(req,res){
  let array = [];

  let query= "select * from product_by_store where store_id="+req.params.mona;

  client.execute(query, function(error, result1){
    if(error){
      console.log("could not connect to db",error);
    //  res.redirect("/users/"+req.params.mon);

    }
      else{
      try{
            for(let i=0;i < result1.rows.length;i++){
              array.push([result1.rows[i].prod_id,result1.rows[i].name,result1.rows[i].quantity,result1.rows[i].amount])
            }
            console.table(array);
         }
         catch{}
    //   res.render("/user/"+req.params.mon);
      }
      try{
    //  console.table(result.rows);
      //console.log(result);
    }
    catch{}
    res.render("application/images/pos.ejs",{
      array1: array,
      param: req.params.mona,
      owner:req.params.owner
    })
    }
  );




})

app.post("/pos/:mon/:owner/gocart", function(req,res){
  var data = req.body;
  console.table(data);
  console.log(data.number.length);



  for(let i = 1;i<data.id.length;i++){

    let query2 = "insert into sales_by_store(store_id,product_id,date,amount,salenum,name) values ("+req.params.mon+","+data.id[i]+",toDate(now()),'"+data.saleamount[i]+"',"+data.saleq[i]+",'"+data.pname[i]+"');";
    let query= "update product_by_store set quantity="+data.number[i]+" where store_id="+req.params.mon+" and prod_id="+data.id[i]+";";

    client.execute(query, function(error, result1){
      if(error){
        console.log("could not connect to db",error);
      //  res.redirect("/users/"+req.params.mon);
      }
        else{
        }
      })

      client.execute(query2, function(error, result1){
        if(error){
          console.log("could not connect to db",error);
        //  res.redirect("/users/"+req.params.mon);
        }
          else{
//=============================================================================================================================

//=============================================================================================================================


          }
        })

      }
      res.redirect("/pos/"+req.params.mon+"/"+req.params.owner)

   });

   app.get("/inventory/:moelingname/:moelingstore",function(req,res){

     let query2 = "select * from store_by_user where store_id="+req.params.moelingstore+" ALLOW FILTERING";
     let query = "select name from find_user_by_userid where user_id="+req.params.moelingname+" ALLOW FILTERING";
     client.execute(query, function(error, result1){
   //    console.table(result1.rows);
if(error){
  console.log(error)
}
else{
  console.table(result1.rows)
  client.execute(query2,function(error,result2){
    if(error){
      console.log(error);
    }
    else{
      console.log(query2);
      console.table(result2);
      //========================================================================================================================
      let array = [];

      let query= "select * from product_by_store where store_id="+req.params.moelingstore;

      client.execute(query, function(error, result3){
        if(error){
          console.log("could not connect to db",error);
        //  res.redirect("/users/"+req.params.mon);

        }
          else{
          try{
                for(let i=0;i < result3.rows.length;i++){
                  array.push([result3.rows[i].prod_id,result3.rows[i].name,result3.rows[i].quantity,result3.rows[i].amount,result3.rows[i].supplier_name,result3.rows[i].buyamount])
                }
                console.table(array);
             }
             catch{}
        //   res.render("/user/"+req.params.mon);
          }
          try{
        //  console.table(result.rows);
          //console.log(result);
        }
        catch{}
        res.render("application/images/inventory.ejs",{
          paramname:req.params.moelingname,
          paramstore:req.params.moelingstore,
          name:result1.rows[0].name,
          store:result2.rows[0].name,
          array1:array

        })
        }
      );
      //========================================================================================================================

    }

  })


}

   //    array = new Array(result1.rows.length,4);
     })



   })

   app.get("/inventoryReport/:moeling",function(req,res){

     res.render("application/images/inventoryReport.ejs",{
       param:req.params.moeling
     })
   })

   app.get("/salesreport/:moelingname/:moelingstore",function(req,res){

          let query2 = "select * from store_by_user where store_id="+req.params.moelingstore+" ALLOW FILTERING";
          let query = "select name from find_user_by_userid where user_id="+req.params.moelingname+" ALLOW FILTERING";
          client.execute(query, function(error, result1){
        //    console.table(result1.rows);
     if(error){
       console.log(error)
     }
     else{
       console.table(result1.rows)
       client.execute(query2,function(error,result2){
         if(error){
           console.log(error);
         }
         else{
           console.log(query2);
           console.table(result2);
           //========================================================================================================================
           let array = [];

           let query= "select * from sales_by_store where store_id="+req.params.moelingstore+" ALLOW FILTERING";

           client.execute(query, function(error, result3){
             if(error){
               console.log("could not connect to db",error);
             //  res.redirect("/users/"+req.params.mon);

             }
               else{
               try{
                     for(let i=0;i < result3.rows.length;i++){
                       array.push([result3.rows[i].prod_id,result3.rows[i].name,result3.rows[i].salenum,result3.rows[i].amount,result3.rows[i].date ])
                     }
                     console.table(array);
                  }
                  catch{}
             //   res.render("/user/"+req.params.mon);
               }
               try{
             //  console.table(result.rows);
               //console.log(result);
             }
             catch{}
             res.render("application/images/salesReport.ejs",{
               paramname:req.params.moelingname,
               paramstore:req.params.moelingstore,
               name:result1.rows[0].name,
               store:result2.rows[0].name,
               array1:array

             })
             }
           );
           //========================================================================================================================

         }

       })


     }

        //    array = new Array(result1.rows.length,4);
          })
   })

   app.get("/updateinventory/:moelingstore/:moelingproduct/:user",function(req,res){

     let query= "select * from product_by_store where store_id="+req.params.moelingstore+" and prod_id="+req.params.moelingproduct+";";
     client.execute(query, function(error, result3){
       if(error){
         console.log("could not connect to db",error);
       //  res.redirect("/users/"+req.params.mon);

       }
         else{
           console.table(result3.rows)
           console.log(result3.rows[0].name)
         }
       res.render("application/images/update.ejs",{
         user:req.params.user,
         store:req.params.moelingstore,
         product:req.params.moelingproduct,
         price:result3.rows[0].amount,
         name:result3.rows[0].name,
         supplier:result3.rows[0].supplier_name,
         quantity:result3.rows[0].quantity,
         buyamount:result3.rows[0].buyamount
       })
   })
 })

 app.post("/updateinventory/:moelingstore/:product/:user",function(req,res){
   var data = req.body;
console.table(data);

let query= "update product_by_store set buyamount="+data.buyamount+", quantity="+data.goods+",amount='"+data.price+"',name='"+data.name+"',supplier_name='"+data.supplier+"' where store_id="+req.params.moelingstore+" and prod_id="+req.params.product+";";

client.execute(query, function(error, result3){
  if(error){
    console.log("could not connect to db",error);
  //  res.redirect("/users/"+req.params.mon);

  }
    else{
    }
    res.redirect("/inventory/"+req.params.moelingstore+"/"+req.params.user)
     })
})

app.get("/addproduct/:owner/:store",function(req,res){
  res.render("application/images/addproduct.ejs",{
    owner:req.params.owner,
    store:req.params.store
  })
})






app.post("/addproduct/:owner/:store",function(req,res){
  let prodid =Math.round(Math.random()*10000);
  //let store = Math.round(Math.random()*10000);

  var data = req.body;
var query = "insert into product_by_store(store_id,prod_id,amount,buyamount,name,quantity,supplier_name) values("+req.params.store+","+prodid+",'"+data.sellprice+"',"+data.buying+",'"+data.name+"',"+data.quantity+",'"+data.supplier+"') ";

client.execute(query, function(error, result3){
  if(error){
    console.log("could not connect to db",error);
  //  res.redirect("/users/"+req.params.mon);

  }
    else{
    }
    res.redirect("/inventory/"+req.params.owner+"/"+req.params.store)
     })


})

app.post("/register",function(req,res){
  let userid =Math.round(Math.random()*10000);

  var data = req.body;
  let name = data.firstname +" "+data.lastname;
  console.table(data);
  var query = "insert into find_user_by_userid(district,user_id,address,name,passwords,phone_number) values ('"+data.district+"',"+userid+",'"+data.address+"','"+name+"','"+data.password+"',"+data.number+") ;";
  client.execute(query, function(error, result3){
    if(error){
      console.log("could not connect to db",error);
    //  res.redirect("/users/"+req.params.mon);

    }
      else{
      }
      res.redirect("/login/good");
       })
})


app.listen(3000,()=> console.log("nodejs is running on poru 3000"));




/*const keyspace= "Leru";
const datacenter ="datacenter1";
const contactPoints= ['192.168.43.66:9042'];
const client = new cassandra.Client({
contactPoints:contactPoints,
keyspace:keyspace,
localDataCenter:datacenter
});
client.execute('select * from users_by_country;', function(error, result){
  if(error){
    console.log("could not connect to db",error);
  }
  else{
    console.table(result.rows);
  }
});
*/

//app.listen(3000, () => console.log("node js running on port 3000"));
