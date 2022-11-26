const async = require('async'),
  path = require('path');
  mongoSeed = require('mongo-seed');

  describe("Alimentando banco de dados", function(){

    var mongo = {
      "host": "127.0.0.1",
      "port": "27017",
      "db": "internetbanking"
    };
  
    before(function (done) {
      async.waterfall([
          function (callback) {
            mongoSeed.clear(mongo.host, mongo.port, mongo.db, function (err) {
              callback(err);
            });
          },
          function (callback) {
            var seedPath = path.resolve(__dirname + "/../seeds/correntistas.json");
            //console.log(seedPath);
            mongoSeed.load(mongo.host, mongo.port, mongo.db, seedPath, "file",  function (err) {
              callback(err);
            });
          },
          
          function (callback) {
            var seedPath = path.resolve(__dirname + "/../seeds/transferencias.json");
            //console.log(seedPath);
            mongoSeed.load(mongo.host, mongo.port, mongo.db, seedPath, "file",  function (err) {
              callback(err);
            });
          }
        ],
        function (err, results) {
          if(err) throw err;
          done();
        });
    });
  
    it("Do some testing here", function(done){
      // test here
      done();
    });
  
  });