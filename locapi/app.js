var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express();

// Database
mongoose.connect('mongodb://localhost/loc-db');

// Config
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// Schema
var Schema = mongoose.Schema;  

var LocationEvent = new Schema ({
	uid: { type: String, required: true },
	service: { type: String, required: true },
	mode: { type: String, required: true },
	longitude: { type: Number, required: false },
	latitude: { type: Number, required: false },
	accuracy: { type: Number, required: false },
    gpsTimestamp: { type: String, required: false },
    timestamp: { type: Date, 'default': Date.now }
});

//Model
var LocationEventModel = mongoose.model('LocationEvent', LocationEvent);

app.get('/api', function (req, res) {
	res.send('Location Event API is running');
});

//READ a List of Locations
app.get('/api/locations', function (req, res) {
	return LocationEventModel.find(function (err, locations) {
		if (!err) {
			return res.send(locations);
		} else {
			return console.log(err);
		}
	});
});

//CREATE a Single Location
app.post('/api/locations', function (req, res) {
	var location;
	console.log("POST: ");
	console.log(req.body);
	location = new LocationEventModel({
		uid: req.body.uid,
		service: req.body.service,
		mode: req.body.mode,
		longitude: req.body.longitude,
		latitude: req.body.latitude,
		accuracy: req.body.accuracy
	});
	location.save(function (err) {
		if (!err) {
			return console.log("created");
		} else {
			return console.log(err);
		}
	});
	return res.send(location);
});

//READ a Single Location by ID
app.get('/api/locations/:id', function (req, res) {
	return LocationEventModel.findById(req.params.id, function (err, location) {
		if (!err) {
			return res.send(location);
		} else {
			return console.log(err);
		}
	});
});

// Launch server
app.listen(5858);
console.log('Location API Server is listening on 5858');




//jQuery.post("/api/locations", {
//	"uid": "amitoj",
//	"eventType": "fg",
//	"longitude": "51.525614",
//	"latitude": "-0.386926",
//	"accuracy": "100"
//}, function (data, textStatus, jqXHR) {
//	console.log("Post resposne:"); 
//	console.dir(data); 
//	console.log(textStatus); 
//	console.dir(jqXHR);
//});