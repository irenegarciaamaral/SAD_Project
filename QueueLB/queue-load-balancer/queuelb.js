
const zmq = require("zeromq");



const addressFrontend = process.env.ZMQ_PUB_ADDRESS; 

const Queue1addr = process.env.ZMQ_BIND_ADDRESS_QUEUE1 ;

const Queue2addr = process.env.ZMQ_BIND_ADDRESS_QUEUE2;

const Queue3addr = process.env.ZMQ_BIND_ADDRESS_QUEUE3;

const addresses = [Queue1addr , Queue2addr , Queue3addr];

const NUMBER_OF_QUEUE_CONTAINERS = 3;
var  addressIndex = 0;

const sockpull = new zmq.Pull;


const sockpush1 = new zmq.Push;
const sockpush2 = new zmq.Push;
const sockpush3 = new zmq.Push;
const sockpush = [sockpush1 , sockpush2 , sockpush3];


sockpush1.bind(addresses[0]);
console.log(`QueueLB push bound to port ${addresses[0]}`);
sockpush2.bind(addresses[1]);
console.log(`QueueLB push bound to port ${addresses[1]}`);
sockpush3.bind(addresses[2]);
console.log(`QueueLB push bound to port ${addresses[2]}`);




async function sendDataToQueues(petition){

  if(addressIndex == 3){
    addressIndex = 0;
  }

  await sockpush[addressIndex].send(petition);
 
  await new Promise(resolve => setTimeout(resolve, 500))
            .then(Promise.resolve())
            .catch(error => { console.log('caught', error.message); });

  addressIndex++;
}



async function run() {

  
 
  
  sockpull.connect(addressFrontend);
  console.log(`Queue pull connected to port ${addressFrontend}`);
  
  
 
  for await (const [msg] of sockpull) {
    console.log("Received: %s", msg.toString(), 'from frontend');
    sendDataToQueues(msg.toString())
    .catch(console.error);

  }

}


run().catch(console.error);