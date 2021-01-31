
const zmq = require("zeromq");


const addressQ1 = process.env.ZMQ_PUB_ADDRESS ;
const addressQ2 = process.env.ZMQ_PUB_ADDRESS2 ;
const addressQ3 = process.env.ZMQ_PUB_ADDRESS3 ;
const addressFrontend = process.env.ZMQ_BIND_ADDRESS_Frontend ; 

const sockpull = new zmq.Pull;
const sockpull2 = new zmq.Pull;
const sockpull3 = new zmq.Pull;

const sockpush = new zmq.Push;



sockpush.bind(addressFrontend);
console.log(`QueueLB push bound to port ${addressFrontend}`);




async function sendDataToFrontend(petition){


  await sockpush.send(petition);
 
  await new Promise(resolve => setTimeout(resolve, 500))
            .then(Promise.resolve())
            .catch(error => { console.log('caught', error.message); });

}



async function run() {

  
 
  
  sockpull.connect(addressQ1);
  console.log(`Queue pull connected to port ${addressQ1}`);
  
  
 
  for await (const [msg] of sockpull) {
    console.log("Received: %s", msg.toString(), 'from Queue1');
    sendDataToFrontend(msg.toString())
    .catch(console.error);

  }

}

async function run2() {

  
 
  
  sockpull2.connect(addressQ2);
  console.log(`Queue pull connected to port ${addressQ2}`);
  
  
 
  for await (const [msg] of sockpull2) {
    console.log("Received: %s", msg.toString(), 'from Queue2');
    sendDataToFrontend(msg.toString())
    .catch(console.error);

  }

}

async function run3() {

  
 
  
  sockpull3.connect(addressQ3);
  console.log(`Queue pull connected to port ${addressQ3}`);
  
  
 
  for await (const [msg] of sockpull3) {
    console.log("Received: %s", msg.toString(), 'from Queue3');
    sendDataToFrontend(msg.toString())
    .catch(console.error);

  }

}

run().catch(console.error);
run2().catch(console.error);
run3().catch(console.error);