//Subscriber
const zmq = require("zeromq");
const products = "products";
const addProduct = "add";
const deleteProduct = "delete";
const showCart = "showCart";
const checkout = "checkout";



const address =  process.env.ZMQ_PUB_ADDRESS || `tcp://127.0.0.1:3000`;

const workerAddress = process.env.ZMQ_WORK_BIND_ADDRESS || `tcp://*:5000`;

const fromWorker = process.env.ZMQ_PUB_WORKER_ADDRESS;

const frontendAddress = process.env.ZMQ_FRONTEND_BIND_ADDRESS;

const sockpull = new zmq.Pull;

const sockpush = new zmq.Push;

const sockpullworker = new zmq.Pull;

const sockpushfrontend = new zmq.Push;

sockpushfrontend.bind(frontendAddress);
sockpush.bind(workerAddress);

async function sendDataToWorker(petition){
  
  console.log(`Queue push bound to port ${workerAddress}`);
 
  await sockpush.send(petition);
  await new Promise(resolve => setTimeout(resolve, 500))
            .then(Promise.resolve())
            .catch(error => { console.log('caught', error.message); });

 
 
}


async function sendDataToFrontend(petition){
  
  console.log(`Queue push bound to port ${frontendAddress}`);

  await sockpushfrontend.send(petition);
  await new Promise(resolve => setTimeout(resolve, 500))
            .then(Promise.resolve())
            .catch(error => { console.log('caught', error.message); });




}

async function run() {

  
 
  
  sockpull.connect(address);
  console.log(`Queue pull connected to port ${address}`);
  
  
 
  for await (const [msg] of sockpull) {
    console.log("Received: %s", msg.toString(), 'from frontend');
    var receivedmsg = msg.toString().split(" ");

    if( receivedmsg[0] == 'products' || receivedmsg[0] == 'add' || receivedmsg[0] == 'cart' || receivedmsg[0] == 'delete' ){
         sendDataToWorker(msg.toString())
         .catch(console.error);
    }
    else if( receivedmsg[0] == 'checkout'){
      
      sendDataToWorker2(msg.toString)
      .catch(console.error);
    }
    else{
      console.log("not recognized");
      sendDataToWorker('error')
      .catch(console.error);
    }
    
    
  }

 
  

  
}



async function runWorkerToQ(){

    sockpullworker.connect(fromWorker);
    console.log(`Queue pull connected to port ${fromWorker}`);

     for await (const [msg] of sockpullworker) {
      console.log("Received: %s", msg.toString(), 'from worker'); 
      sendDataToFrontend(msg.toString())
      .catch(console.error);
    }

  

}



run().catch(console.error);

runWorkerToQ().catch(console.error);
