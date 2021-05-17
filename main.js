'use strict'

const express = require("express");
const app = express();
var tp = require('tedious-promises');
// var TYPES = require('tedious').TYPES;
var dbConfig = require('./config.json');
tp.setConnectionConfig(dbConfig); 
tp.setPromiseLibrary('es6');
const port ="4000";

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static(__dirname + '/semantic'));
app.set('view engine', 'ejs');

app.get('/', (_, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
  try {
    let { nome, cod_nome, sobrenome, cod_sobrenome, email, cod_email } = req.body;
    
    // Inserindo nas tabelas - etapa 3
    let query = `INSERT INTO [dbo].tbs_nome (nome, cod) VALUES ('${nome}', ${cod_nome})\
    INSERT INTO [dbo].tbs_sobrenome (sobrenome, cod) VALUES ('${sobrenome}', ${cod_sobrenome})\
    INSERT INTO [dbo].tbs_email (email, cod) VALUES ('${email}', ${cod_email})`;
    await tp.sql(query).execute();
    
    // Recuperando o campo soma para email, nome e sobrenome das tabelas - etapa 4
    query = `SELECT soma FROM tbs_cod_nome WHERE cod = ${cod_nome}\
    SELECT soma FROM tbs_cod_sobrenome WHERE cod = ${cod_sobrenome}\
    SELECT soma FROM tbs_cod_email WHERE cod = ${cod_email}`;
    let results = await tp.sql(query).execute();

    // Calculando a soma de todos os campos - etapa 5
    let total = results.reduce((total, {soma}) => total + +soma, 0);
    total += (+cod_email + +cod_nome + +cod_sobrenome); 

    // Recuperando um animal, uma cor e um pais da tabela - etapa 6
    query = `SELECT TOP 1 a.animal, c.cor, p.pais, p.total FROM tbs_animais a \
    INNER JOIN tbs_cores c ON a.total = c.total \
    INNER JOIN tbs_paises p ON c.total = p.total \
    WHERE a.total  = ${total} AND c.cor NOT IN (SELECT cor from tbs_cores_excluidas tce where total = ${total})`;
    results = await tp.sql(query).execute();

    // Retornando os resultados - etapa 8 
    return res.status(200).json(results);
  } catch (err) {
    return res.status(404).json({ message: err.toString() });
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
