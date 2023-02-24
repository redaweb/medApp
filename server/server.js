const express = require('express');
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const mysql = require('mysql');
const session = require('express-session');
const { error } = require('console');

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'med'
});



connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});



app.use(express.static('../client/build'));
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
/*mongoose
  .connect('mongodb://localhost/my-database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));*/

// Routes
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username+"  "+password)
  // Vérifiez les informations d'identification de l'utilisateur ici

  if (true) {
    req.session.username = username;
    req.session.profil="admin";
    //res.redirect('/dashboard');
    res.send(req.session);
  } else {
    res.redirect('/login');
  }
});

app.get('/testconexion', (req, res) => {
  //req.session.destroy();
  res.send(req.session);
  console.log(req.session)
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  console.log("logout")
  res.send('Logged out successfully!');
});

app.get('/lirePatients',(req,res)=>{
  connection.query('SELECT * FROM patient',(error,results)=>{
    if (error) throw error;
    res.send(results)
  })
})

app.post('/ajoutPatient',(req,res)=>{
  const nouveauPatient=req.body
  console.log(nouveauPatient)
  connection.query('INSERT INTO patient (nom, prenom, date_naissance, etat_general, adresse, telephone) VALUES ('+nouveauPatient.nom+', '+nouveauPatient.prenom+', '+nouveauPatient.date_naissance+', '+nouveauPatient.etat_general+', '+nouveauPatient.adresse+', '+nouveauPatient.telephone+')',(error,results)=>{
    if (error) throw error;
    res.send(results)
  })
})



app.get('/*', (req, res) => { 
    //res.send(path.join(__dirname, '../client/public', 'index.html'))
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  //console.log(path.join(__dirname, 'client/public', 'index.html'))
});



// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
