var cluster = require('cluster');

// Initialize a worker
function startWorker() {
  var worker = cluster.fork();
  console.log('CLUSTER: Worker %d started', worker.id);
} 

// cluster.isMaster and cluster.isWorker determines
// If the script has been called directly or by the node cluster respectively
if(cluster.isMaster){
  
  // Initialize a worker for each CPU core 
  require('os').cpus().forEach(function(){ 
    startWorker();
  });
  
  // log any workers that disconnect; if a worker disconnects, it 
  // should then exit, so we'll wait for the exit event to spawn 
  // a new worker to replace it
  cluster.on('disconnect', function(worker){
    console.log('CLUSTER: Worker %d disconnected from the cluster.',worker.id);
  });
  
  // when a worker dies (exits), create a worker to replace it
  cluster.on('exit', function(worker, code, signal){ 
    console.log('CLUSTER: Worker %d died with exit code %d (%s)',worker.id, code, signal);
    startWorker();
  }); 
  
}else{
  // start our app on worker; see meadowlark.js
  require('./meadowlark.js')();
}