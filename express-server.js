const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 80;

app.use(bodyParser.json());
app.use(express.static('site'));

app.post("/getList", function(req, res) {
	var data = req.body;
	var listname = data.listname;
	fs.exists(__dirname + "/lists/" + listname + ".json", function(exists) {
		if(exists) {
			fs.readFile(__dirname + "/lists/" + listname + ".json", 'utf8', function(err, file) {
				if(err) throw err;
				else {
					res.send(JSON.parse(file));
				}
			});
		} else {
			fs.writeFile(__dirname + "/lists/" + listname + ".json", '{}', function(err) {
				if(err) throw err;
				else {
					fs.readFile(__dirname + "/lists/" + listname + ".json", 'utf8', function(err, file) {
					if(err) throw err;
					else {
						res.send(JSON.parse(file));
					}
					});
				}
			});
		}
	});
});

app.post("/removeItems", function(req, res) {
	var data = req.body;
	var listname = data.listname;
	var list;
	fs.exists(__dirname + "/lists/" + listname + ".json", function(exists) {
		if(exists) {
			fs.readFile(__dirname + "/lists/" + listname + ".json", 'utf8', function(err, file) {
				if(err) throw err;
				else {
					list = JSON.parse(file);
					for(var i in data.items) {
						var found = list[data.items[i].category].find(function(e) {
							return e == data.items[i].item;
						});
						list[data.items[i].category].splice(list[data.items[i].category].indexOf(found), 1);
					}
					fs.writeFile(__dirname + "/lists/" + listname + ".json", JSON.stringify(list), (err) => {
						if (err) throw err;
						console.log("list updated");
						res.send(list);

					});
				}
			});
		}
		else {
			console.log("file not found");
		}
	});
});

app.post("/addItem", function(req, res) {
	var data = req.body;
	var listname = data.listname;
	var list;
	
	fs.exists(__dirname + "/lists/" + listname + ".json", function(exists) {
		if(exists) {
			fs.readFile(__dirname + "/lists/" + listname + ".json", 'utf8', function(err, file) {
				if(err) throw err;
				else {
					list = JSON.parse(file);
						var items = data.item.split(", ");
						for(var i in items) {
							var found = list[data.category].find(function(element) {
								return element === data.item;
							});
							
							if(found) {
								console.log("duplicate found");
							} else {
								list[data.category].push(items[i]);
							}
						}
						list[data.category].sort();
						fs.writeFile(__dirname + "/lists/" + listname + ".json", JSON.stringify(list), (err) => {
							if (err) throw err;
							console.log("list updated");
							res.send(list);
						});
				}
			});
		}
		else {
			res.sendStatus(404);
		}
	});
	

});

app.post("/createCategory", function(req, res) {
	var data = req.body;
	var listname = data.listname;
	var list;
	
	fs.exists(__dirname + "/lists/" + listname + ".json", function(exists) {
		if(exists) {
			fs.readFile(__dirname + "/lists/" + listname + ".json", 'utf8', function(err, file) {
				if(err) throw err;
				else {
					list = JSON.parse(file);
					if(data.category == "") {
						list["null"] = [];
					} else {
						list[data.category] = [];
					}
					fs.writeFile(__dirname + "/lists/" + listname + ".json", JSON.stringify(list), (err) => {
						if (err) throw err;
						console.log("list updated");
						res.send(list);
					});
				}
			});
		}
		else {
			console.log("file not found");
		}
	});
	
});

app.post("/removeCategory", function(req, res) {
	var data = req.body;
	var listname = data.listname;
	var list;
	
	fs.exists(__dirname + "/lists/" + listname + ".json", function(exists) {
		if(exists) {
			fs.readFile(__dirname + "/lists/" + listname + ".json", 'utf8', function(err, file) {
				if(err) throw err;
				else {
					list = JSON.parse(file);
					delete list[data.category];
					fs.writeFile(__dirname + "/lists/" + listname + ".json", JSON.stringify(list), (err) => {
						if (err) throw err;
						console.log("list updated");
						res.send(list);

					});
				}
			});
		}
		else {
			console.log("file not found");
		}
	});
	

});

app.use(function(req,res) {
	res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + "/site/index.html");
});

app.listen(port, () => {
	console.log("Server running on port " + port);

});
