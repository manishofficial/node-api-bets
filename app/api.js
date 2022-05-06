const express = require('express');
const { now } = require('mongoose');
var urlLib = require('url');
const router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://suporte:vsBl9bce2LAeOtzC@cluster0.vvtmy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var dateTime = require('node-datetime');

//Post Method
router.post('/payment', (req, response) => {
    var reqBody = req.body;
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    reqBody.dateAdded = formatted;
    MongoClient.connect(url, function(err, db) {
        if (err) throw response.send(err);
        var dbo = db.db("myFirstDatabase");
        var coll = dbo.collection('betsPayment');
        coll.findOneAndUpdate(
            { Invoice:  reqBody.Invoice }, 
            { $set: reqBody },
            { upsert:true, new:true },  //upsert to create a new doc if none exists and new to return the new, updated document instead of the old one. 
            function(err, doc){
                if(err){ response.send(err.message); }
                response.send(doc);
                db.close();
            }
        );
    });
})

router.get('/payment', (req, response) => {
    var url_parts = urlLib.parse(req.url, true);
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    MongoClient.connect(url, function(err, db) {
        if (err) throw response.send(err);
        var dbo = db.db("myFirstDatabase");
        var myobj = url_parts.query;
        myobj.dateAdded = formatted
        dbo.collection("betsPayment").insertOne(myobj, function(err, res) {
          if (err) throw res.send(err);
          response.send({messgae:"1 document inserted"});
          db.close();
        });
    });
})

//Get all Method
router.get('/get-payments', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw res.send(err);
        var dbo = db.db("myFirstDatabase");
        var coll = dbo.collection('betsPayment');
        coll.find({}).toArray(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
    });
})

router.post('/invoice', (req, response) => {
    var invoiceNumber = 100001;
    MongoClient.connect(url, function(err, db) {
        var lastNumber;
        if (err) throw response.send(err);
        var dbo = db.db("myFirstDatabase");
        var coll = dbo.collection('invoice');
        coll.findOne({},
            { sort: { _id: -1 } },function (err, result) {
            if (err) {
                response.send(err);
            } else {
                if (result) {
                    invoiceNumber = result.invoiceNumber+1;
                }
                var myobj = { invoiceNumber: invoiceNumber };
                coll.insertOne(myobj, function(err, res) {
                    if (err) throw res.send(err);
                    response.send(myobj);
                    db.close();
                });
            }
        });
    });
})

router.get('/invoice', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw res.send(err);
        var dbo = db.db("myFirstDatabase");
        var coll = dbo.collection('invoice');
        coll.findOne({},
            { sort: { _id: -1 } },function (err, result) {
            if (err) {
                response.send(err);
            } else {
                res.send(result);
            }
        });
    });
})

module.exports = router;
