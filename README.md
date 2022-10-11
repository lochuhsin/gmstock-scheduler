## Installation


For first time setting up:
```
docker-compose up --build
yarn add prisma
docker exec -it gmstock-scheduler_mongo_1 bash

# go inside mongodb shell
mongosh

config = {
 "_id" : "rs0",
 "members" : [
   {
     "_id" : 0,
     "host" : "mongo:27017"
   }
 ]
};

rs.initiate(config);
```



After:
```bash
docker-compose build .
docker-compose up -d
```

