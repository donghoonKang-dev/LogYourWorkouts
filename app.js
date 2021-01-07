const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 8080;

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
let db = mongoose.connection;
//db connect success
db.once('open', function(){
  console.log('DB connected');
});
app.use(cors());
//db connect fail
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

//DB schema
let logSchema = mongoose.Schema({
  name:{type:String, required:true, unique:true},
  date:{type:Date, required:true},
  workout:{type:String, required:true}
});
let workoutLog = mongoose.model('workoutLog', logSchema);
let data = 'no data';

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/stack', (req, res) => {
  res.send(data)
})

app.post('/stack', (req, res) => {
  data = req.body
  console.log(`data: ${data}`)
  res.send('ok')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})