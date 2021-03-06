require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');

const airbnbController = require('./controllers/airbnbController');
const tensorflowController = require('./controllers/tensorflowController');

var app = express();

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.listen(3100, () => {
    console.log('Express server started at port : 3100');
});

app.use(express.static('public'));
app.use('/airbnb', airbnbController);
app.use('/tensorflow', tensorflowController);
app.use('/scripts', express.static(__dirname + '/scripts/'));
