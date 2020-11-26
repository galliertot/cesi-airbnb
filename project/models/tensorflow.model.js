const mongoose = require('mongoose');

var tensorflowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    link: {
        type: String,
        required: 'This field is required.'
    },
    createdAt: {
        type: String
    },
    octets: {
        type: String
    },
    successRate: {
        type: String
    },
    foundName: {
        type: String
    }
});

mongoose.model('TensorFlow', tensorflowSchema);