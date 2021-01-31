
 const {MongoClient} = require('mongodb');
 var assert = require('assert');

 //var mongoclient = mgdb.MongoClient;

  var query_result = null;

  
  //var url='mongodb://localhost:8100'


var connectDB = async function(url,query){

    const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true });

    try{
      await client.connect();

      var db = await client.db('mydb');

      var collection = db.collection('mycollection'); 

      var itemFound = await collection.find(query).toArray(await function(err, res){
          if(err) throw err;
          console.log(JSON.stringify(res));
          console.log(res[0].stock);
          query_result = res[0].stock;

          if(query_result == 0 ){
            console.log("Product"+ res[0].desc + "is out of stock");
          }


      });      



      

    } catch(e){
      console.error(e);

    } finally{


      await client.close;

      

    }


 }



 

var checkStock = function(url,query,callback){

     var myResult;

     mongoclient.connect(url,function (err, client) {
      if (err) throw err;

      var db = client.db('mydb');
      var collection = db.collection('mycollection'); 

      collection.find(query).toArray(function(err, result){
      if(err) throw err;

      //console.log(JSON.stringify(result));
      myResult = result;

      client.close();

      });

      return myResult;

   });
}


var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('mycollection');
  // Insert some documents
    collection.insertMany([
    {cod : 1,desc:'apples',stock:2},
    {cod : 2,desc:'bananas',stock:10},
    {cod : 3,desc:'mangos',stock:5},
    {cod : 4,desc:'peaches',stock:5}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(4, result.result.n);
    assert.equal(4, result.ops.length);
    console.log("Inserted 4 products into the collection");
    callback(result);
  });
}



var setResult = function(result){

    query_result = result;
}

var getResult = function(){

    return query_result;
}


module.exports.connectDB = connectDB;

module.exports.checkStock = checkStock;

module.exports.getResult = getResult;

module.exports.query_result = query_result;

