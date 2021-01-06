const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const port = 8080;

app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})