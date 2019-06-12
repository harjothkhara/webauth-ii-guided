const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session'); //<<<<<<<<<<<<<<<<
const KnexSessionStore = require('connect-session-knex')(session);// <<<<<<<<<<installed library and pass session instance to it (currying)-- allow us to connect sessions to db instead of in mememory

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: 'monster', // by default would be sid
  secret: 'keep it secret, keep it safe! -gandalf',
  cookie: {
    httpOnly: true, //true means prevent access from JavaScript code
    maxAge: 1000 * 60 * 1, // in milliseconds
    secure: false, //true means only send the cookie over https
  },
  resave: false, // resave session even if it didn't change
  saveUninitialized: true, // create new sessions automatically, make sure to comply with law
 
  store: new KnexSessionStore({ //<<<<<<<<<<<<<<<<<<<<< connecting session to database instead of on memory
    knex: require('../database/dbConfig.js'),
    createtable: true, //if its not there create it for me
    clearInterval: 1000 * 60 * 15, //clear out expired session in milliseconds
  })
};

//middleware
server.use(session(sessionConfig)); //<<<<<<<<<<<<<<<<<
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  const username = req.session.username || 'stranger';
  res.send(`Hello ${username}!`);
});

module.exports = server;

//common ways to store session data in the server
//memory, memory cache server, database server
//client <--> server <----> session store