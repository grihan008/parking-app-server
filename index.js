var express = require("express"),
	pg = require("pg"),
	cors = require("cors"),
	bodyParser = require("body-parser"),
	multer = require("multer"),
	cloudinary = require("cloudinary"),
	cloudinaryStorage = require("multer-storage-cloudinary"),
	session = require('express-session'),
	mongodb = require('mongodb'),
	password = require('password-hash-and-salt');

var ObjectID = mongodb.ObjectID;

var app = express();

var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: '',
  allowedFormats: ['jpg', 'png'],
});

var parser = multer({ storage: storage });

//app.set('port', (process.env.PORT || 3000));
//app.set('view engine', 'ejs');
//app.set('views', './views');

app.use(session({secret: 'project'}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

//Temporary demo variables

var parking_places = [{
  "id": 1,
  "address":"Isokatu 34",
  "type":"long-term",
  "price":0.50,
  "start_date":"20.2.2018",
  "end_date":"3.3.2018",
  "start_time":"8:00",
  "end_time":"16:00",
  "username":"Damien",
  "description":"Really nice spot not far from shop !"
},
{
  "id": 2,
  "address":"Jatulikivenkatu 18 A 1",
  "type":"long-term",
  "price":0.50,
  "start_date":"20.2.2018",
  "end_date":"3.3.2018",
  "start_time":"8:00",
  "end_time":"16:00",
  "username":"Damien",
  "description":"Really nice spot not far from shop !"
},
{
  "id": 3,
  "address":"Torikatu 10",
  "type":"long-term",
  "price":0.50,
  "start_date":"20.2.2018",
  "end_date":"3.3.2018",
  "start_time":"8:00",
  "end_time":"16:00",
  "username":"Damien",
  "description":"Really nice spot not far from shop !"
},
{
  "id": 4,
  "address":"Somekatu 36 B",
  "type":"instant",
  "price":1.50,
  "start_date":"20.2.2018",
  "end_date":"3.3.2018",
  "start_time":"8:00",
  "end_time":"16:00",
  "username":"Damien",
  "description":"Really nice spot not far from shop !"
},
{
  "id": 5,
  "address":"Another street 65 C",
  "type":"instant", "price":1.50,
  "start_date":"20.2.2018",
  "end_date":"3.3.2018",
  "start_time":"8:00",
  "end_time":"16:00",
  "username":"Damien",
  "description":"Really nice spot not far from shop !"
},
{
  "id": 6,
  "address":"Third street 65 B",
  "type":"instant",
  "price":1.50,
  "start_date":"20.2.2018",
  "end_date":"3.3.2018",
  "start_time":"8:00",
  "end_time":"16:00",
  "username":"Damien",
  "description":"Really nice spot not far from shop !"
}];

app.get('parking_places', function(req,res){
	res.json(parking_places);
});

var sess;
var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://heroku_gfdqlwzs:7hm7u73vu3dferc9c03p057d2a@ds117848.mlab.com:17848/heroku_gfdqlwzs', function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000 || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get('/api/testdbpage', function(req, res){
  db.collection('testCollection').find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get('/api/categories', function(req, res) {
	db.collection('CategoriesCollection').find({}).toArray(function(err, docs){
		if (err) {
			handleError(res, err.message, "Failed to get categories.");
		} else {
			res.status(200).json(docs);
		}
	});
});

app.post("/api/testdbpage", function(req, res) {
  var newContact = req.body;
	console.log(req.body);

	//req.body.image="IMAGE";

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection("testCollection").insertOne(newContact, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.get("/api/testdbpage/:id", function(req, res) {
	db.collection("testCollection").findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to get contact");
		} else {
			res.status(200).json(doc);
		}
	});
});

app.get("/api/categories/:id", function(req, res) {
	db.collection('CategoriesCollection').findOne({ _id: new ObjectID(req.params.id)}, function(err, doc){
		var skillsIds = [];
		if ( doc.skills ){
			doc.skills.forEach(function(item){
				skillsIds.push(new ObjectID((item)));
			});
		}
		db.collection('SkillsCollection').find({_id: { $in: skillsIds }}).toArray(function(err, docs){
			if (err) {
				handleError(res, err.message, "Failed to get Skills.");
			} else {
				res.status(200).json(docs);
			}
		});
	});
});

app.get("/api/userskills/:id", function(req, res){
	db.collection('UsersCollection').findOne({_id: new ObjectID(req.params.id)}, function(err,doc){
		var skillsIds = [];
		if (doc.skills){
			doc.skills.forEach(function(item){
				skillsIds.push(new ObjectID((item)));
			});
		}
		db.collection('SkillsCollection').find({_id: { $in: skillsIds }}).toArray(function(err, docs){
			if (err) {
				handleError(res, err.message, "Failed to get Skills.");
			} else {
				res.status(200).json(docs);
			}
		});
	});
});

app.get("/api/skills/:id", function(req, res) {
	db.collection('SkillsCollection').findOne({ _id: new ObjectID(req.params.id)}, function(err, doc){
		var stepsIds = [];
		if (doc.steps){
			doc.steps.forEach(function(item){
				stepsIds.push(new ObjectID((item)));
			});
		}
		db.collection('StepsCollection').find({_id: { $in: stepsIds }}).toArray(function(err, docs){
			if (err) {
				handleError(res, err.message, "Failed to get Steps.");
			} else {
				res.status(200).json(docs);
			}
		});
	});
});

app.put("/api/testdbpage/:id", function(req, res) {
	var updateDoc = req.body;
	delete updateDoc._id;

	db.collection("testCollection").updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to update contact");
		} else {
			updateDoc._id = req.params.id;
			res.status(200).json(updateDoc);
		}
	});
});

app.post("/api/updateuserlogin", function(req,res){
	var updateUser = req.body;

	if (!updateUser.id || !updateUser.login){
		handleError(res, "Not enought data", "provide with id and login, please");
	} else {
		db.collection("UsersCollection").updateOne({_id: new ObjectID(updateUser.id)},{$set:{login: updateUser.login}}, function(err,doc){
			if (err){
				handleError(res, "can not update user data", "Can not update user data");
			}
			else{
				db.collection("UsersCollection").findOne({_id: new ObjectID(updateUser.id)}, function(err, doc){
					if (err){
						handleError(res, "This should not have happened", "This should not have happened");
					}
					else{
						delete doc.password;
						res.status(200).json(doc);
					}
				});
			}
		});
	}
});

app.post("/api/updateuserpassword", function(req,res){
	var updateUser = req.body;

	if (!updateUser.id || !updateUser.password || !updateUser.newpassword){
		handleError(res, "Not enought data", "provide with id and password and new password, please");
	} else {
		db.collection("UsersCollection").findOne({_id: new ObjectID(updateUser.id)}, function(err, doc){
			if (err){
				handleError(res, err.message, "No such user");
			}
			else {
				password(updateUser.password).verifyAgainst(doc.password, function(error, verified){
					if (verified){
						password(updateUser.newpassword).hash(function(error,hash){
							if (error){
								handleError(res, "cannot hash new password", "Can not has new password");
							}
							else {
								db.collection("UsersCollection").updateOne({_id: new ObjectID(updateUser.id)},{$set:{password: hash}}, function(err,doc){
									if (err){
										handleError(res, "can not update user data", "Can not update user data");
									}
									else{
										db.collection("UsersCollection").findOne({_id: new ObjectID(updateUser.id)}, function(err, doc){
											if (err){
												handleError(res, "This should not have happened", "This should not have happened");
											}
											else{
												delete doc.password;
												res.status(200).json(doc);
											}
										});
									}
								});
							}
						});
					}
					else{
						handleError(res,"Old password does not match", "Old password does not match");
					}
				});
			}
		});
	}
});

app.post("/api/completeskill", function(req, res){
	if (!req.body.userid || !req.body.skillid){
		handleError(res, "Not enough data", "Not enought data");
	}
	else{
		var newSkillsArray = [];
		db.collection("UsersCollection").findOne({ _id: new ObjectID(req.body.userid)}, function(err, doc){
			if (doc.skills){
				newSkillsArray = doc.skills;
			}
			if (newSkillsArray.indexOf(req.body.skillid)!=-1){
				handleError(res, "Skill already added", "This skills was already completed");
			}
			else{
				newSkillsArray.push(req.body.skillid);
				db.collection("UsersCollection").updateOne({ _id: new ObjectID(req.body.userid)}, { $set:{ skills: newSkillsArray } }, function(err,doc){
					if (err){
						handleError(res, err.message, "Failed to add skill");
					}
					else{
						res.status(200).json({"result": "success"});
					}
				})
			}
		});
	}
});

	app.post("/updateimage", parser.single("image"), function(req,res){
		db.collection("UsersCollection").findOne({_id: new ObjectID(req.body.id)}, function(err,doc){
			if (err){
				handleError(res, err.message, "Something went wrong");
			} else {
				db.collection("UsersCollection").updateOne({_id: new ObjectID(req.body.id)}, {$set:{image: req.file.url}}, function(err, doc){
					if (err){
						handleError(err, err.message, "Failed to update image");
					} else {
						res.status(200).json({"result":"success"});
					}
				});
			}
		});
	});

app.delete("/api/testdbpage/:id", function(req, res) {
	db.collection("testCollection").deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
	if (err) {
		handleError(res, err.message, "Failed to delete contact");
	} else {
		res.status(200).json(req.params.id);
	}
	});
});

app.post("/api/signup", function(req, res) {
  var newUser = req.body;
  if (!req.body.login || !req.body.password) {
    handleError(res, "Invalid user input", "Must provide a login and a password.", 400);
  }
	else{
		password(newUser.password).hash(function(error, hash){
			if (error){
				handleError(res, "Can not hash password", "Unable to store password securely");
			}	else {
				newUser.password = hash;
				newUser.image = "http://res.cloudinary.com/hsqbly2iw/image/upload/v1509280105/profile_xwyvgr.png";
				db.collection("UsersCollection").insertOne(newUser, function(err, doc) {
					if (err) {
						handleError(res, err.message, "Failed to create new user.");
					} else {
						var user = doc.ops[0];
						delete user.password;
						res.status(201).json(user);
					}
				});
			}
		});
	}
});

app.post("/api/login", function(req, res) {
	var loginData = req.body;
	if (!req.body.login || !req.body.password){
		handleError(res, "Invalid user input", "Must provide a login and a password.", 400);
	}
	else{
		db.collection("UsersCollection").findOne({ login: req.body.login }, function(err, doc){
			if (err) {
				handleError(res, err.message, "Error occured");
			} else {
				if (doc){
					password(req.body.password).verifyAgainst(doc.password, function(error, verified){
						if (verified){
							delete doc.password;
							res.status(200).json(doc);
						}
						else{
							handleError(res, "password does not match", "Password does not match the username");
						}
					});
				}
				else {
					handleError(res, "No such user", "No such user");
				}
			}
		});
	}
});

app.all('*', function(req, res) {
  res.send("404");
});
