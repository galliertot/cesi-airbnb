const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const TensorFlow = mongoose.model('TensorFlow');
var formidable = require('formidable');
var http = require('http');
var upload = require('../models/upload');
const fs = require('fs');

router.post('/', (req, res) => {
    insertRecord(req, res);
});

function insertRecord(req, res) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd

    upload(req, res,(error) => {
        if(error){
            console.log(error)
        } else {
            var tensorflow = new TensorFlow();
            tensorflow.link = "/files/" + req.file.filename;
            tensorflow.name = req.file.originalname;
            tensorflow.octets = parseInt(req.file.size)/1000;

            var arrayProba = "";
            var arrayName = "";

            let m = JSON.parse(req.body.mainPredic);

            m.forEach(element => {
                arrayName += "<p>" + element.class + "</p>"
                arrayProba += "<p>" + (parseFloat(element.score.toString())*100).toString().substring(0,5) + " %" + "</p>"
            });

            arrayName += "<hr>"
            arrayProba += "<hr>"
            
            let p = JSON.parse(req.body.predic);

            p.forEach(element => {
                arrayName += "<p>" + element.className + "</p>"
                arrayProba += "<p>" + (parseFloat(element.probability.toString())*100).toString().substring(0,5) + " %" + "</p>"
            });

            tensorflow.successRate = arrayProba;
            tensorflow.foundName = arrayName;
            tensorflow.createdAt = today;

            tensorflow.save((err, doc) => {
                if (!err)
                    res.redirect('tensorflow/');
                else {
                    console.log(err)
                }
            });   
        }
    });

}


router.get('/', async (req, res) => {
    const { page = 1, limit = 10, sorted = false, filtre = null} = req.query;
    try {
        var srt = srt = { createdAt: -1 }
        if (sorted == "true" || sorted === true) { srt = { createdAt: 1 } }
        var filter = filtre == "null" || filtre == null ? {} : filter = { createdAt:filtre }
        const tensorflow = await TensorFlow.find(filter).lean()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(srt)
        .exec();
        const count = await TensorFlow.countDocuments();
        res.render("tensorflow/list", {
            list: tensorflow,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            sorted: sorted == "true" ? true : false,
            filtre: filtre == "null" || filtre == null ? null : filtre
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/delete/:id', (req, res) => {
    TensorFlow.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/tensorflow/');
        }
        else { console.log('Error in tensorflow delete :' + err); }
    });
});

module.exports = router;
  