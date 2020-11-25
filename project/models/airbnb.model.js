const mongoose = require('mongoose');

var airbnbSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    description: {
        type: String
    },
    picture_url: {
        type: String
    },
    host_since: {
        type: String
    }
});

mongoose.model('Airbnb', airbnbSchema);