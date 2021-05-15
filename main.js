'use strict'

const express = require("express");
const app = express();
var tp = require('tedious-promises');
var TYPES = require('tedious').TYPES;
var dbConfig = require('./config.json');
tp.setConnectionConfig(dbConfig); 
tp.setPromiseLibrary('es6');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (_, res) => {
    res.render('index'/*, { people }*/);
});

app.post('/', (req, res) => {
    let { nome, sobrenome, email } = req.body;
    console.log({ nome, sobrenome, email });
    return res.status(200).json({ nome, sobrenome, email });
});

app.get('/query', async (_req, res) => {
    let message, status;
    try {
      let results = await tp.sql("SELECT TOP 10 * FROM dbo.tbs_nome").execute();
      console.log(results);
      status = 200;
      message = "Sucesso";
    } catch (err) {
      console.log(err);
      message = err.toString();
      status = 404;
    } finally {
      return res.status(status).json({ message });
    }
    /* tp.sql("SELECT TOP 10 * FROM dbo.tbs_nome")
    .execute()
    .then(function(results) {
        console.log(results);
        return res.status(200).json({ nome, sobrenome, email });
    }).fail(function(err) {
      return res.status(400).json({ "erro": "erro" });
    }); */
});


app.listen(4000, () => console.log('Example app listening on port 4000!'));


/* tp.sql("INSERT INTO table (col1, col2) VALUES ('x','y'); SELECT @@identity as id")
  .execute()
  .then(function(results) {
    console.log(results[0].id);
  });

  tp.sql("SELECT col1, col2 FROM dbo.table")
  .execute()
  .then(function(results) {
    // do something with the results
  }).fail(function(err) {
    // do something with the failure
  });

function getData(id) {
    return tp.sql("SELECT col1, col2, FROM table WHERE id_col = @id")
      .parameter('id', TYPES.Int, id)
      .execute();
  } */

/*   tp.sql("INSERT INTO table (col1, col2) VALUES ('x','y'); SELECT @@identity as id")
  .execute()
  .then(function(results) {
    console.log(results[0].id);
  }); */