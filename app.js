var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'demo/uploads/')
    },
    filename: function(req, file, cb) {
        //cb(null, file.fieldname + '-' + Date.now())
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({
    //dest: 'uploads/',
    storage: storage
}); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(express.static('demo'));

app.post('/api/upload', upload.array('images'), function(req, res, next) {
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");  
    res.json({
        data: req.files
    })
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});