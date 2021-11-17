var MongoClient = require('mongodb').MongoClient;  

const insertData = (data, callback) => {

    const url = "mongodb+srv://root:Root%40123@cluster0.0njg7.mongodb.net/microbackend_db?retryWrites=true&w=majority";  
    MongoClient.connect(url, function(err, client) { 
    if (err) callback(err, null);  
    var myobj = { code: data.code, name: data.name, description: data.description, date:  data.date};  
    let db = client.db("microbackend_db")
    db.collection("request_data").insertOne(myobj, function(errInInsert, res) {  
        if (errInInsert) callback(errInInsert, null);
        else {
            client.close();  
            callback(null ,true)
        } 
    console.log("1 record inserted");  
    });  
    });  

}

module.exports = insertData