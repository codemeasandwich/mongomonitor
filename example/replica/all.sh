mongod --replSet yogi --logpath "1.log" --dbpath rs1 --port 27017 & 
mongod --replSet yogi --logpath "2.log" --dbpath rs2 --port 27018 & 
mongod --replSet yogi --logpath "3.log" --dbpath rs3 --port 27019 &
tail -f ./1.log