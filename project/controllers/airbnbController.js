const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Airbnb = mongoose.model('Airbnb');

router.get('/', (req, res) => {
    res.render("airbnb/addOrEdit", {
        viewTitle: "Nouveau Airbnb"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var airbnb = new Airbnb();
    airbnb.name = req.body.name;
    airbnb.description = req.body.description;
    airbnb.picture_url = req.body.picture_url;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    airbnb.host_since = today;
    airbnb.save((err, doc) => {
        if (!err)
            res.redirect('airbnb/list');
        else {
            if (err.name == 'ValidationError') {
                res.render("airbnb/addOrEdit", {
                    viewTitle: "Nouveau Airbnb",
                    airbnb: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Airbnb.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('airbnb/list'); }
        else {
            if (err.name == 'ValidationError') {
                res.render("airbnb/addOrEdit", {
                    viewTitle: 'Mise à jour',
                    airbnb: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', async (req, res) => {
    const { page = 1, limit = 10, sorted = false, filtre = null} = req.query;
    try {
        var srt = srt = { host_since: -1 }
        if (sorted == "true" || sorted === true) { srt = { host_since: 1 } }
        var filter = filtre == "null" || filtre == null ? {} : filter = { host_since:filtre }
        const airbnb = await Airbnb.find(filter).lean()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(srt)
        .exec();
        const count = await Airbnb.countDocuments();
        res.render("airbnb/list", {
            list: airbnb,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            sorted: sorted == "true" ? true : false,
            filtre: filtre == "null" || filtre == null ? null : filtre
        });
    } catch (err) {
    console.error(err.message);
    }
});

router.get('/:id', (req, res) => {
    Airbnb.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("airbnb/addOrEdit", {
                viewTitle: "Mise à jour",
                airbnb: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Airbnb.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/airbnb/list');
        }
        else { console.log('Error in airbnb delete :' + err); }
    });
});

module.exports = router;
  