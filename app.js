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
const db = mongoose.connection;
//db connect success
db.once('open', function(){
  console.log('DB connected');
});
//db connect fail
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('/public'));
//app.use(express.static(path.join(__dirname, 'public')));

//DB schema
let logSchema = mongoose.Schema({
  name:{type:String, required:true, unique:false},
  date:{type:Date, required:true, unique:false},
  workout:{type:String, required:true, unique:false}
});
let workoutLog = mongoose.model('workoutLog', logSchema);

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/workout', (req, res) => {
  workoutLog.find(function(err, workouts){
    if(err) return res.status(500).send({error: 'database failure'});
    res.json(workouts);
  });
})

app.post('/workout', (req, res) => {
  data = req.body;
  let workoutData = new workoutLog();
  workoutData.name = req.body.name;
  workoutData.date = req.body.date;
  workoutData.workout = req.body.workout;
  workoutData.save(function(err){
    if(err){
      console.error(err);
      res.json({result:0});
      return;
    }
    res.json({result:1});
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})