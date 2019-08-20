// Exmaple commands
db.createUser({
  user:"bob",
  pwd:"123",
  customData:{pid:"ab12"},
  roles:[{
    role:"clusterAdmin",
    db:"admin"
  },{
    role:"readAnyDatabase",
    db:"admin"
  },{
    role:"readWrite",
    db:"other"
  }]
},{
  w:"majority"
})

db.changeUserPassword("bob","445")

db.dropUser("bob",{
  w:"majority"
})
