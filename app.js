const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const port = process.env.port||8080;

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));

//<==========DB Setting==========>
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;
//DB connect success
db.once('open', function(){
  console.log('MongoDB successfully connected');
});
//DB connect fail
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});
//DB schema
let logSchema = mongoose.Schema({
  name:{type:String, required:true, unique:false},
  date:{type:Date, required:true, unique:true},
  workout:{type:String, required:true, unique:false}
});
let workoutLog = mongoose.model('workoutLog', logSchema);

//<==========Routing==========>
app.get('/', (req, res) => {
  res.render('index');
})
//GET when show button clicked
app.get('/workout', (req, res) => {
  workoutLog.find(function(err, workouts){
    if(err) return res.status(500).send({error: "Oops database failure!"});
    res.json(workouts);
  });
})
//POST when submit button clicked
app.post('/workout', (req, res) => {
  let workoutData = new workoutLog();
  workoutData.name = req.body.name;
  workoutData.date = req.body.date;
  workoutData.workout = req.body.workout;
  workoutData.save(function(err){
    if(err){
      console.error(err);
      res.json({result:"Fail saving the data"});
      return;
    }
    res.json({result:"Success saving the data"});
  });
})
//DELETE when delete button clicked
app.delete('/workout/deleteProcess/:deleteId', function(req, res){
  workoutLog.deleteOne({ date: req.params.deleteId }, function(err){
      if(err) return res.status(500).json({ error: "Oops database failure" });
      workoutLog.find(function(err2, workouts){
        if(err2) return res.status(500).send({error: "Oops database failure"});
        res.json(workouts);
      })
    })
});
//PUT when update button clicked
app.put('/workout/updateProcess/:updateId', function(req, res){
  workoutLog.updateOne({date:req.body.date}, {workout:req.body.workout}, function(err, output){
    if(err) res.status(500).json({ error: 'database failure' });
    if(!output.n) return res.status(404).json({ error: 'workout not found' });
    workoutLog.find(function(err2, workouts){
      if(err2) return res.status(500).send({error: 'database failure'});
      res.json(workouts);
    })
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})