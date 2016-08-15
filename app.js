var express = require('express');
var app = express();

var pg = require('pg');

//console.log(process.env);

var config = {
  user: process.env.PGUSER, //env var: PGUSER
  database: process.env.PDDATABASE, //env var: PGDATABASE
  password: process.env.PGPASSWORD, //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);


pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('INSERT INTO test1 (name) VALUES ($1)', ["jules"], function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    //console.log(result.rows[0].number);
    //output: 1
  });
});

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});



var port = process.env.PORT || 5000;
var nav = [{
    Link: '/Books',
    Text: 'Book'
    }, {
    Link: '/Authors',
    Text: 'Author'
    }];
var bookRouter = require('./src/routes/bookRoutes')(nav);

app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');


app.use('/Books', bookRouter);

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello from render',
        nav: [{
            Link: '/Books',
            Text: 'Books'
        }, {
            Link: '/Authors',
            Text: 'Authors'
        }]
    });
});

app.get('/books', function (req, res) {
    res.send('Hello Books');
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});
