var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://quangnghia:1234567890@ds227459.mlab.com:27459/thuycanhdb";
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var status = false;

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(port, ()=>{
	console.log("Server is listening on port: " + port);
});

io.on("connection", function(socket){
	console.log('a user is connected');
	
	socket.on('user send setData', (data)=>{
		updateData(data);
	});
	socket.on('user send stop', (data)=>{
		updateData(data);
	});

	sendSetData();
	sendChart();

	socket.on('client send data', (data)=>{
		io.sockets.emit('Server send data', data);
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("thuycanhdb");
		  dbo.collection("setValue").findOne({}, function(err, result) {
		    if (err) throw err;
		    status = result.status;
		    db.close();
		  });
		});
		if(status == "true"){
			setInterval(()=>{
				MongoClient.connect(url, (err, db)=>{
					if (err) throw err;
					var dbo = db.db("thuycanhdb");
					dbo.collection("statusSystem").insertOne(data, (err, res)=>{
						if(err) throw err;
						console.log("inisert info System!");
						db.close();
					});
				});
			}, 30*60*1000);
		};
	});

	socket.on('client send status', (data)=>{
		io.sockets.emit("Server send status", data);
	});
});

app.post('/login', urlencodedParser, function (req, res) {
	if (req.body.email == '1' && req.body.password == '1')
	{
		res.render("dieukhien");
	};
	if (req.body.email == '2' && req.body.password == '2')
	{
		res.render("demo");
	};
});



app.get('/trangchu', (req, res)=>{
	res.render("trangchu");
});
app.get('/dothi', (req, res)=>{
	res.render("dothi");
});
app.get('/sanpham', (req, res)=>{
	res.render("sanpham");
});

app.get('/', function(req, res){
	res.render("isensor");
});

function updateData(data){
	io.sockets.emit("server send raspi", data);
	MongoClient.connect(url, (err, db)=>{
		if (err) throw err;
		var dbo = db.db("thuycanhdb");
		var myquery = { id: 1 };
		var newvalues = { $set: {
			id: data.id,
			setEC: data.setEC,
			setpH: data.setpH,
			setGiaiDoan: data.setGiaiDoan,
			setLoaiCay: data.setLoaiCay,
			setStartDay: data.setStartDay,
			status: data.status
			} 
		};
		dbo.collection("setValue").updateOne(myquery, newvalues, function(err, res) {
		    if (err) throw err;
		    console.log("1 document updated");
		    db.close();
		});
	});
	io.sockets.emit('Server send setData', data);
};

function stageChange(EC, stage, state){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("thuycanhdb");
	  dbo.collection("setValue").findOne({}, function(err, result) {
	    if (err) throw err;
	    result.setEC = EC;
		result.setGiaiDoan = stage;
		result.status = state;
		updateData(result);
	    db.close();
	  });
	});
};

function sendSetData(){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("thuycanhdb");
	  dbo.collection("setValue").findOne({}, function(err, result) {
	    if (err) throw err;
	    io.sockets.emit('Server send setData', result);
	    db.close();
	  });
	});
};

function sendChart(){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var EC=[];
	  var dbo = db.db("thuycanhdb");
	  dbo.collection("statusSystem").find({}).toArray(function(err, result) {
	    if (err) throw err;
	   		io.sockets.emit("server send statusSystem", result);
	   		db.close();
	    }); 
	  });
};