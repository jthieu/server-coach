var express = require("express");
var mongodb = require("mongodb");
var bodyparser = require("body-parser");
var cors = require("cors");
var jsonparser = bodyparser.json({
    limit: '200mb'
});
var app = express();

var client = mongodb.MongoClient;
var events, orders;
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
client.connect(url, function (err, db) {
    if (err) {
        console.log("error connecting");
        process.exit(1);
        throw err;
    } else {
        console.log("connected to our database")
//        events = db.collection("exevents");
//        orders = db.collection("orders");
    }
})
app.use(cors());

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

var Mentor = mongoose.model('Mentor',{
	first_name: String,
	last_name: String,
	username: String,
	password: String,
	phone_number: String,
	major: String,
	job_position: String,
	education: String,
	dream_career: String,
	bio: String,
	age: Number
});

app.get('/api/mentors', function(req,res){
	console.log("fetching mentors");
	Mentor.find(function(err, mentors){
		if (err)
			res.send(err);
		res.json(mentors);
	});
});

//app.get('/', function(req,res) {
//    console.log("We're in.");
//});

app.post('/api/mentors', function(req, res){
	console.log("fetching mentors");
	Mentor.create({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		phone_number: req.body.phone_number,
		username: req.body.username,
		password: req.body.password,
		major: req.body.major,
		job_position: req.body.job_position,
		education: req.body.education,
		dream_career: req.body.dream_career,
		bio: req.body.bio,
		age: req.body.age,
		done: false
	
	}, function(err, mentor){
		if (err)
			res.send(err);
		Mentor.find(function(err, mentors){
		if (err)
			res.send(err);
		res.json(mentors);
	});

	});
});

app.get('/', function (req, res) {
    console.log("We're in.");
    }, function (err, doc) {

    });

})

app.get("/pullEvents", function (req, res) {
    events.find().toArray(function (err, docs) {
        if (err) {
            throw err;
            res.sendStatus(500);
        } else {
            var result = docs.map(function (data) {
                return data;
            })
            res.json(result);
        }
    })
})

app.get("/pullEvent", function (req, res) {
    events.find({
        "name": "ronaldo"
    }).limit(1).next(function (err, docs) {
        if (err) {
            throw err;
            res.sendStatus(500);
        } else {

            res.json(docs);
        }
    })
})
app.post("/pushOrder", (req, res) => {
    /*orders.insert(req, (err, doc) => {
        if (err) {
            throw err;
            res.sendStatus(500);
        } else {
            console.log("successfully added order");
            res.sendStatus(200);
        }
    }) */
    console.log(req.body);

})


var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Listening on port ' + port);
    console.log({
        "name": "art exhbit A",
        "date": "tommorow"
    })
});