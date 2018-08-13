const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const port = 3000;

var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);

require('./app/socket')(io);

app.engine('.hbs', exphbs({
  defaultLayout: 'index',
  extname: '.html',
  layoutsDir: path.join(__dirname, 'views/layouts/main')
}))

app.use(express.static('views/layouts/main'));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (request, response) => {
  response.render('home', {
    on: JSON.stringify("nodes")
  })
})

http.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
