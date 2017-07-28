var express = require('express');
var app = express();
var mongoose =  require('mongoose');
var morgan = require('morgan');
var del = require('del');
var methodOverride = require('method-override');
var cors = require ('cors');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://JordyMartinez:martinezjordy2014@ds059634.mlab.com:59634/corvids');

app.use(morgan('dev'));
// app.use(body-parser.urlencoded);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

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

app.listen(8080);
console.log("app listening on 8080");


