var express = require("express");
var mongodb = require("mongodb");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bodyparser = require("body-parser");
var cors = require("cors");
var jsonparser = bodyparser.json({
	limit: '200mb'
});
var app = express();

mongoose.connect(process.env.MONGODB_URI);
app.use(cors());

app.use(bodyparser.urlencoded({
	extended: true
}));
app.use(bodyparser.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


//Models for Mentor and Mentee
var MentorSchema = new Schema({
	first_name: String,
	last_name: String,
	username: String,
	password: String,
	phone_number: String,
	major: String,
	career_path: String,
	job_position: String,
	education: String,
	dream_career: String,
	bio: String,
	// pendingMentees: String,
	// acceptedMentees: String,
	pendingMentees: [{type: String}],
	acceptedMentees: [{type: String}],
	age: Number
});

var Mentor = mongoose.model('Mentor', MentorSchema);

var MenteeSchema = new Schema({
	first_name: String,
	last_name: String,
	username: String,
	password: String,
	phone_number: String,
	//major: String,
	career_path: String,
	job_position: String,
	education: String,
	dream_career: String,
	bio: String,
	pendingMentors: String,
	acceptedMentors: String,
	pendingMentors: [{type: String}],
	acceptedMentors: [{type: String}],
	hobbies: String,
	age: Number
});

var Mentee = mongoose.model('Mentee', MenteeSchema);

var options = {new: true};

// Initialization message
app.get('/', function (req, res) {
	console.log("We're in.");
});


//HTTP Functions for Mentors
app.get('/api/mentors', function (req, res) {
	console.log("Fetching mentors");
	Mentor.find(function (err, mentors) {
		if (err)
			res.send(err);
		res.json(mentors);
	});
});

//Create a new mentor and send back list of mentors
app.post('/api/mentors', function (req, res) {
	console.log("Adding a mentor");
	Mentor.create({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		phone_number: req.body.phone_number,
		username: req.body.username,
		password: req.body.password,
		major: req.body.major,
		career_path: req.body.career_path,
		job_position: req.body.job_position,
		education: req.body.education,
		dream_career: req.body.dream_career,
		bio: req.body.bio,
		pendingMentees: req.body.pendingMentees,
		acceptedMentees: req.body.acceptedMentees,
		age: req.body.age,
		done: false

	}), function (err, mentor) {
		if (err)
			res.send(err);
		Mentor.find(function (err, mentors) {
			if (err)
				res.send(err);
			res.json(mentors);
		});
	};
});


//HTTP Functions for Mentees
app.get('/api/mentees', function (req, res) {
	console.log("Fetching mentees");
	Mentee.find(function (err, mentees) {
		if (err)
			res.send(err);
		res.json(mentees);
	});
});

// Create a new mentee and send back list of mentees
app.post('/api/mentees', function (req, res) {
	console.log("Adding a mentee");
	Mentee.create({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		phone_number: req.body.phone_number,
		username: req.body.username,
		password: req.body.password,
		//major: req.body.major,
		career_path: req.body.career_path,
		job_position: req.body.job_position,
		education: req.body.education,
		dream_career: req.body.dream_career,
		bio: req.body.bio,
		pendingMentors: req.body.pendingMentors,
		acceptedMentors: req.body.acceptedMentors,
		age: req.body.age,
		done: false

	}), function (err, mentee) {
		if (err)
			res.send(err);
		Mentee.find(function (err, mentees) {
			if (err)
				res.send(err);
			res.json(mentees);
		});

	};
});

// Adds an accepted mentee to the mentee's
app.post('/api/acceptMentee', function (req, res) {
	console.log("Updating mentee and mentors' relation status!");
	// Adds the mentor's id to the acceptedMentors list
	Mentee.findOneAndUpdate(
		{ "_id": req.body.menteeID },
		{ $addToSet: { "acceptedMentors": req.body.mentorID } },
		options,
		function(err, mentee) {
			if (err)
				throw err
			//console.log(mentee.acceptedMentors);
		}
	);
	// Removes the mentor's id from the pendingMentors list
	Mentee.findOneAndUpdate(
		{ "_id": req.body.menteeID },
		{ $pull: { "pendingMentors": req.body.mentorID } },
		options,
		function(err, mentee) {
			if (err)
				throw err
			//console.log(mentee.pendingMentors);
		}
	);
	// Adds the mentee's id to the acceptedMentees list
	Mentor.findOneAndUpdate(
		{ "_id": req.body.mentorID },
		{ $addToSet: { "acceptedMentees": req.body.menteeID } },
		options,
		function(err, mentor) {
			if (err)
				throw err
			//console.log(mentor);
		}
	);
	// Removes the mentee's id from the pendingMentees list
	Mentor.findOneAndUpdate(
		{ "_id": req.body.mentorID },
		//{ $pull: { pendingMentees: { $elemMatch: { id: req.body.mentee._id } } } }
		{ $pull: { "pendingMentees": req.body.menteeID } },
		options,
		function(err, mentor) {
			if (err)
				throw err
			//console.log(mentor);
		}
	);
});

// Adds a pending mentor to the mentee's list and a pending mentee to the mentor's list
app.post('/api/addPendingMentor', function (req, res) {
	console.log("Updating mentee");
	Mentee.findOneAndUpdate(
		{ "_id": req.body.menteeID },
		{ $addToSet: { "pendingMentors": req.body.mentorID } },
		options, 
		function (err, mentee) {
			if (err)
				throw err;
			//console.log(mentee);
		}
	);
	Mentor.findOneAndUpdate(
		{ "_id": req.body.mentorID },
		{ $addToSet: { "pendingMentees": req.body.menteeID } },
		options, 
		function (err, mentor) {
			if (err)
				throw err;
			//console.log(mentor);
		}
	);
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
	console.log('Listening on port ' + port);
});
