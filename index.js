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
	pendingMentors: [{type: String}],
	acceptedMentors: [{type: String}],
	hobbies: String,
	age: Number
});

var Mentee = mongoose.model('Mentee', MenteeSchema);

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

app.post('/api/mentors', function (req, res) {
	console.log("Add mentors");
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

	});
	console.log(typeof req.body.pendingMentees);
	console.log(typeof req.body.acceptedMentees);
	Mentor.find(function (err, mentors) {
		if (err)
			res.send(err);
		res.json(mentors);
	});
});

app.post('/api/mentorsUpdate', function (req, res) {
	console.log("Updating mentor");
	//req.body.[mentorname].update
	Mentor.findOneAndUpdate(
		{ _id: req.body.mentorID },
		{ $push: { acceptedMentees: req.body.menteeID } }
	);

	Mentor.findOneAndUpdate(
		{ _id: req.body.mentorID },
		//{ $pull: { pendingMentees: { $elemMatch: { id: req.body.mentee._id } } } }
		{ $pull: { pendingMentees: req.body.menteeID } }
	);
});

app.post('/api/addPendingMentor', function (req, res) {
	console.log("Updating mentee");
	Mentor.findOneAndUpdate(
		{ _id: req.body.menteeID },
		{ $push: { pendingMentors: req.body.mentorID } }
	);
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

app.post('/api/mentees', function (req, res) {
	console.log("Fetching mentees");
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

app.post('/api/menteesUpdate', function (req, res) {
	console.log("Updating mentee");
	Mentor.findOneAndUpdate(
		{ _id: req.body.menteeID },
		{ $push: { acceptedMentors: req.body.mentorID } }
	);

	Mentor.findOneAndUpdate(
		{ _id: req.body.menteeID },
		{ $pull: { pendingMentors: req.body.mentorID } }
	);
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
	console.log('Listening on port ' + port);
});
