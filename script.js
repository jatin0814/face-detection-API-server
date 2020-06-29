const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const db = knex({
	client:'pg',
	connection:{
		host:'127.0.0.1',
		user:'postgres',
		password:'6225',
		database:'smart-brain'
	}
})


const app = express();

app.use(bodyParser.json());
app.use(cors());


const Database = {
	user:[
	{
		id:"123",
		name:"jatin",
		email:"jatin@gmail.com",
		password:"00",
		entries: 0,
		joined: new Date()
	},
	{
		id:'124',
		name:"jonny",
		email:"jonny@gmail.com",
		password:"password",
		entries: 0,
		joined: new Date()
	}
	]
}


app.get('/',(req,res)=>{
	res.send(Database.user);
})


app.post('/signin',(req,res)=>{
	console.log(req.body.email===Database.user[0].email,
		req.body.password===Database.user[0].password)
	if(req.body.email===Database.user[0].email&&
		req.body.password===Database.user[0].password){
		res.json(Database.user[0]);
	}else{
		res.status(404).json('failed');
	}
})


app.post('/register',(req,res)=>{
	const {email,name,password} = req.body;
	db('users')
	.returning('*')
	.insert({
		email:email,
		name:name,
		joined: new Date()
	}).then(user =>{
		res.json(user[0]);
	})
	.catch(err => res.status(404).json('Not Found'));
})


app.get('/profile/:id',(req,res)=>{
	const {id} = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
		if(user.length) {
			res.json(user[0])
		}else{
			res.status(404).json('Not Found')
		}
	}).catch(err => res.status(400).json('error getting user'));
})


app.put('/image',(req,res)=>{
	const {id} = req.body;
	let flag = false;
	Database.user.forEach(user =>{
		if(id===user.id){
			flag = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if(!flag){
		res.status(404).send("Not Found");
	}
})


app.listen(3030,()=>{
	console.log('working!!');
})


//