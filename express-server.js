const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

var list = [];

app.use(bodyParser.json());
app.use(express.static('site'));

app.get("/getList", function(req, res) {
	res.send(list);
	res.sendStatus(200);
});

app.post("/removeItems", function(req, res) {
	var data = req.body;
	for(var i in data) {
		var found = list[data[i].category].find(function(e) {
			return e == data[i].item;
		});
		list[data[i].category].splice(list[data[i].category].indexOf(found), 1);
	}
	list[data[i].category].sort();
	fs.writeFile("list.json", JSON.stringify(list), (err) => {
		if (err) throw err;
		console.log("list updated");
	});
	res.sendStatus(200);
});

app.post("/addItem", function(req, res) {
	var data = req.body;
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
	fs.writeFile("list.json", JSON.stringify(list), (err) => {
		if (err) throw err;
			console.log("list updated");
		});
	res.sendStatus(200);
});

app.post("/createCategory", function(req, res) {
	var data = req.body;
	list[data.category] = [];	
	fs.writeFile("list.json", JSON.stringify(list), (err) => {
		if (err) throw err;
		console.log("list updated");
	});
	res.sendStatus(200);
});

app.post("/removeCategory", function(req, res) {
	var data = req.body;
	delete list[data.category];
	fs.writeFile("list.json", JSON.stringify(list), (err) => {
		if (err) throw err;
		console.log("list updated");
	});
	res.sendStatus(200);
});

app.listen(port, () => {
	console.log("Server running on port " + port);
	fs.readFile("list.json", 'utf8', function(err, data) {
		if(err) throw err;
		else {
			list = JSON.parse(data);
		}
	});
	console.log("List loaded successfully");
});
