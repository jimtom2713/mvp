var express = require('express');
var elasticsearch = require('elasticsearch');
var bodyParser = require('body-parser');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

app.get('/', function (req, res) {
  res.send('index');
});

// app.get('/login', function (req, res) {
//   res.sendFile(__dirname + '/public/loginView.html');
// });

app.get('/posts', function (req, res) {
  client.search({
    index: 'notes',
    type: 'note',
    size: 50,
    body:{
      query:{
        match_all: {}
      },
       sort :
          {"created_at" : {"order" : "desc"}
      }
    }
  }).then(function(results){
    res.json(results.hits.hits);
  })
});

app.post('/posts', function(req, res){
  client.create({
    index: 'notes',
    type: 'note',
    _timestamp: {enabled: true},
    body: {
      // title: req.body.title,
      content: req.body.content,
      created_at: Date.now()
    }
  }).then(function(results){
    res.redirect('/');
  })
});

app.post('/reccommend', function(req, res){
  // console.log(req.body);
  client.search({
    index:'notes', 
    type: 'note', 
    size: 15,
    body: {
      query: {
        match: {
          content: {
            query: req.body.content,
            fuzziness: 3,
            operator:  "and"
          }
        }
      },
      sort: '_score',
      highlight: {
        order: "score",
        fields: {
          content: {
            fragment_size: 200,
            number_of_fragments: 0
          }
        }
      }
    }
  }).then(function(resp){
    res.json(resp.hits.hits);
  })
})