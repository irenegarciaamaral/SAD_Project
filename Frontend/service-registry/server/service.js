const express = require('express');
const service = express();
const fs = require('fs');
const zmq = require('zeromq');
//const address = process.env.ZMQ_PUB_ADDRESS || `tcp://127.0.0.1:3000`;
const address = process.env.ZMQ_BIND_ADDRESS ;
const queueAddress = process.env.ZMQ_PUB_QUEUE_ADDRESS;


const appid = process.env.APPID;

const sock = new zmq.Push; 

const sockpull = new zmq.Pull;
const sockpull2 = new zmq.Pull;
const sockpull3 = new zmq.Pull;

sock.bind(address);
console.log(`Client bound to port ${address}`);


async function sendDataToQ(petition){
  

    // await sock.bind(address);
    
    await sock.send(petition);  
      
    
  //wait 500ms
  await new Promise(resolve => setTimeout(resolve, 500))
  .then(Promise.resolve())
  .catch(error => { console.log('caught', error.message); });
  

  return;
}

async function run(res) {

  
  sockpull.connect(queueAddress);
  console.log(`Frontend pull connected to port ${queueAddress}`);
  
  
 
  for await (const [msg] of sockpull) {

    
    console.log("Received: %s", msg.toString(), 'from Queue End Point');
    res.send(msg.toString());
    return;
  }
}


 
var product = {

      "name" : "productName",
      "amount": "productamount",
      "price": "productPrice"
}



module.exports = (config) => {
  const log = config.log();
  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }


  service.get('/', (req, res, next) => {

      res.header("Content-Type", 'text/plain');
      res.send("Use /products to list the products\n"+
               "Use /cart to show the items in your cart\n"+
               "Use /add?name=<ProductName>\n"+
               "Use /delete?name=<ProductName>&amount=<n>\n"+
               "Use /checkout to checkout your shopping Cart\n"
              );  
      
  });


  service.get('/products', (req, res, next) =>{

      
    
        // res.send("running on :"+ appid + "\nPRODUTOS !!!!\n");
        
        sendDataToQ('products')
        .catch(console.error);  
        run(res).catch(console.error);      
      
  } );

  service.get('/add' , (req, res, next) => {

        var query = req.query;
        var splitName = query.name.split('"'); 
        product.name = splitName[1];
        var splitAmount = query.amount.split('"');
        product.amount = splitAmount[1];


        sendDataToQ('add ' + product.name+" " + product.amount)
        .catch(console.error);
        run(res).catch(console.error);
      
      
        
  });

  service.get('/delete' , (req, res , next) =>{

       var query = req.query;
       var splitName = query.name.split('"'); 
       var name = splitName[1];

       sendDataToQ('delete ' + name)
        .catch(console.error);  
        run(res).catch(console.error); 
    
    

  });

  service.get('/cart', (req, res, next) => {

      sendDataToQ('cart')
      .catch(console.error);  
      run(res).catch(console.error); 
    

  });

  service.get('/checkout', (req, res, next) => {

    

  });


  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
