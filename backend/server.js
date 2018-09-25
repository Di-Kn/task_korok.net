import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {connection} from "./connectDB.js"

var app = express()

app.use(cors())

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.post('/regUser', function (req, res){
    const user = [
        req.body.login,
        req.body.password,
        req.body.full_name,
        req.body.phone,
        req.body.email];
    const sql = "INSERT INTO user(login, password, full_name, phone, email) VALUES(?, ?, ?, ?, ?)";
 
connection.query(sql, user, function(err, results) {
    if(err) console.log(err);
    else console.log("Данные добавлены");
});
})

app.post('/login', (req, res) => {
  const user = [req.body.login, req.body.password]
  const sql = "SELECT * FROM user WHERE login = ? AND password = ?"

  connection.query(sql, user, function(err, results) {
    if(err){
      console.log(err)
    } else {
      console.log(results)
      res.json(results)
    }
  })
})

app.listen(3000, function () {
  console.log('web server listening on port 3000')
})
