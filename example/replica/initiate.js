// from the mongo shell
config = {
  _id:"yogi", members:[
  { _id:0, host:"localhost:27017" },
  { _id:1, host:"localhost:27018" },
  { _id:2, host:"localhost:27019" }
  ]
};

rs.initiate(config);
rs.status();

// from Mongodb replica sets 
// https://youtu.be/3wus5trgi0A