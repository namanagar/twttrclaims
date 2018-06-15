const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});

client.ping({
     requestTimeout: 30000,
 }, function(error) {
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });

 client.indices.create({
     index: 'social-media'
 }, function(error, response, status) {
     if (error) {
         console.log(error);
     } else {
         console.log("created new index", response);
     }
 });


const claims = require('./twitter.json');
var bulk = [];
claims.forEach(claim =>{
  bulk.push({index:{ 
                _index:"social-media", 
                _type:"twitter-claims",
            }
          
        })
  bulk.push(claim)
})


client.bulk({body:bulk}, function( err, response  ){ 
        if( err ){ 
            console.log("Failed Bulk operation".red, err) 
        } else { 
            console.log("Successfully imported %s".green, bulk.length); 
        } 
    }); 

