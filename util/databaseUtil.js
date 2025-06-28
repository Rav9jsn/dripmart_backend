const mongo = require("mongodb");
const {envData} = require("../config");
const uripath = envData.uri
const MongoClient = mongo.MongoClient;



  let _db
  const mongoConnect = (callback) => {
    MongoClient.connect(uripath)
      .then((client) => {
        callback();
        _db = client.db('dripmart')
      })
      .catch((err) => {
        console.log(err);
      });
  };

const getdb= ()=>{
  if(!_db){
    throw new Error('mongo not connect')
  }
  return _db
}

module.exports = {
  mongoConnect,
  getdb,
};
