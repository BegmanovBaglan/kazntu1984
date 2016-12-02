var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var students = [];
var studNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Студенттер тізімі!!!');
});

// GET /todos
app.get('/students', function(req, res){
	var queryParams = req.query;
	var filteredStudents = students;


	if(queryParams.hasOwnProperty('n') && queryParams.n.length> 0){
		filteredStudents = _.filter(filteredStudents, function (student){
			return student.name.toLowerCase().indexOf(queryParams.n.toLowerCase()) > -1;
		});
	}
	res.json(filteredStudents);
});


// GET /students/:id
app.get('/students/:id', function(req, res){
	var studId = parseInt(req.params.id, 10);
	var student = _.findWhere(students, {id: studId});

	if(student){
		res.json(student);
	}else{
		res.status(404).send();
	}
});



app.post('/student', function(req, res){
	var body = _.pick(req.body, 'name', 'course', 'group');

	if( !_.isString(body.name) || body.name.trim().length === 0|| !_.isString(body.course) || body.course.trim().length === 0 ||!_.isString(body.group) || body.group.trim().length === 0){
		return res.status(400).send();
	}

	
	body.name = body.name.trim();
	
	if(body.course<=4 && body.course>=0){
		body.course = body.course.trim();
	}
	else body.course="студенттің курсын дұрыс енгізіңіз!!! Оқу 4 жылдық екенін ескеріңіз!!!";

	body.group = body.group.trim();
	body.id = studNextId++;

	students.push(body);

	res.json(body);
});

app.delete('/student/:id', function(req,res){
	var studId = parseInt(req.params.id,10);
	var student = _.findWhere(students, {id: studId});

	if(!student){
		res.status(404).json({"error": "no todo found with that id"});
	}else{
		students = _.without(students, student);
		res.json(student);
	}
});

app.put('/student/:id', function(req, res){
	var studentId = parseInt(req.params.id, 10);
	var matchedStudent = _.findWhere(student, {id: studentId});
	var body = _.pick(req.body, 'name', 'course','group');
	var validAttributes = {};

	if(!matchedStudent){
		return res.status(404).send();
	}

	if(body.hasOwnProperty('name') && _.isString(body.name) &&body.name.trim().length > 0){
		validAttributes.name = body.name;
	}else if(body.hasOwnProperty('name')){
		return res.status(404).send();
	}
	if(body.hasOwnProperty('course') && _.isString(body.course) &&body.course.trim().length > 0){
		validAttributes.course = body.course;
	}else if(body.hasOwnProperty('course')){
		return res.status(404).send();
	}
	if(body.hasOwnProperty('group') && _.isString(body.group) &&body.group.trim().length > 0){
		validAttributes.group = body.group;
	}else if(body.hasOwnProperty('group')){
		return res.status(404).send();
	}

	matchedStudent = _.extend(matchedStudent, validAttributes);
	res.json(matchedStudent);
});
app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});
