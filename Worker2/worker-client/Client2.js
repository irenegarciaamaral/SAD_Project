//Worker for db access
const zmq = require("zeromq");
// const mongoose = require('mongoose');
// const productmodel = require('./product.model.js')(mongoose);

//sockets to connect
const address = process.env.ZMQ_PUB_WORKER_ADDRESS;
const address2 = process.env.ZMQ_PUB_WORKER_ADDRESS_Q2;
const address3 = process.env.ZMQ_PUB_WORKER_ADDRESS_Q3;

//sockets to bind
const QAddress = process.env.ZMQ_QUEUE_BIND_ADDRESS;
const Q2Address = process.env.ZMQ_QUEUE_BIND_ADDRESS_Q2;
const Q3Address = process.env.ZMQ_QUEUE_BIND_ADDRESS_Q3;

const addrs = [QAddress, Q2Address , Q3Address];

var  addressIndex = 0;

const sockpull = new zmq.Pull;
const sockpull2 = new zmq.Pull;
const sockpull3 = new zmq.Pull;

const sockpush1 = new zmq.Push;
const sockpush2 = new zmq.Push;
const sockpush3 = new zmq.Push;

const sockpush = [sockpush1 , sockpush2 , sockpush3];

sockpush1.bind(addrs[0]);
console.log(`Worker push bound to port ${addrs[0]}`);
sockpush2.bind(addrs[1]);
console.log(`Worker push bound to port ${addrs[1]}`);
sockpush3.bind(addrs[2]);
console.log(`Worker push bound to port ${addrs[2]}`);

//data base
// var db_url = 'mongodb://localhost:27017';
// var queryResult = null;

// mongoose.Promise = global.Promise;
// mongoose.connect(db_url, { dbName:"mydb",useUnifiedTopology: true, useNewUrlParser: true });

// const connection = mongoose.connection;

// connection.once("open", function() {
//   console.log("MongoDB database connection established successfully");
// });


var jsonCart = {

    products: {
          
    },
    info:{
      'total': 0,
      'currency': 'EUR'
    }    

}



var jsonProducts = {
  "apples" : {
      "stock": 6,
      "price": 0.2,
      "id": 1
   },
   
   "bananas" : {
      "stock": 20,
      "price": 0.5,
      "id": 2
   },
   
   "mangos" : {
      "stock": 15,
      "price": 1,
      "id": 3
   },

   "peaches" : {
      "stock": 17,
      "price": 0.80,
      "id": 4
   }
};

var product = {

      "name" : "productName",
      "amount": "productamount",
      "price": "productPrice"
}

function doWork(msg){

    var receivedmsg = msg.split(" ");
    console.log(receivedmsg);

    if(receivedmsg[0] == 'checkout'){

      
      
    }

}

async function sendDataToQueue(petition){
 
  
  // console.log(`Worker push bound to port ${QAddress}`);
  if(addressIndex == 3){
    addressIndex = 0;
  }
  await sockpush[addressIndex].send(petition);

  // await sockpush.send(petition);
  await new Promise(resolve => setTimeout(resolve, 500))
  .then(Promise.resolve())
  .catch(error => { console.log('caught', error.message); });
 
  addressIndex++;
}

async function run() {

  sockpull.connect(address);
  console.log(`Worker pull connected to port ${address}`);
 
  for await (const [msg] of sockpull) {
    
    console.log("Received: %s", msg.toString(), 'from queue');
    doWork(msg.toString());
  }
  
}


async function run2(){
  sockpull2.connect(address2);

  console.log(`Worker pull connected to port ${address2}`);
 
  for await (const [msg] of sockpull2) {
    
    console.log("Received: %s", msg.toString(), 'from queue');

    doWork(msg.toString());

  }

}


async function run3(){

  sockpull3.connect(address3);

  console.log(`Worker pull connected to port ${address3}`);
 
  for await (const [msg] of sockpull3) {
    
    console.log("Received: %s", msg.toString(), 'from queue');

    doWork(msg.toString());

  }
}






run().catch(console.error);
run2().catch(console.error);
run3().catch(console.error);





