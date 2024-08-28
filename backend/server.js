const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

console.log('Backend iniciado!');

// Conectar ao banco de dados SQLite usando um arquivo
let db = new sqlite3.Database('./backend/database.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
  db.run('CREATE TABLE IF NOT EXISTS my_table (id INTEGER PRIMARY KEY, name TEXT)');
});

// Middleware para parsear JSON e habilitar CORS
app.use(express.json());
app.use(cors());

// Rota para login de usuários
app.post('/userlogin', (req, res) => {
  const { email, senha } = req.body;
  console.log(`Login attempt for user with email ${email}`);
  db.get(`SELECT id_usuario FROM usuario WHERE email = ? AND senha = ?`, [email, senha], (err, row) => {
    if (err) {
      return console.log(err.message);
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ id_usuario: row.id_usuario });
  });
});

// Rota para selecionar dados de uma tabela específica
app.get('/select/:table', (req, res) => {
  const { table } = req.params;
  console.log(`Selecting data from table ${table}`);
  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
    if (err) {
      // Verifica se o erro é devido à tabela não existir
      if (err.message.includes('no such table')) {
        return res.status(404).json({ error: `Table ${table} does not exist` });
      }
      // Outros erros
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
    console.log(rows);
  });
});

// Rota para login do desenvolvedor
app.post('/devlogin', (req, res) => {
  const { email, senha } = req.body;
  console.log(`Login attempt for email ${email}`);
  db.get(`SELECT id_desenvolvedor FROM desenvolvedor WHERE email = ? AND senha = ?`, [email, senha], (err, row) => {
    if (err) {
      return console.log(err.message);
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ id_desenvolvedor: row.id_desenvolvedor });
  });
});

// Rota para adicionar aplicativos
app.post('/addaplication', (req, res) => {
  const { nome, descricao, preco, id_desenvolvedor } = req.body;
  console.log(`Adding application ${nome} by developer ${id_desenvolvedor}`);
  db.run(`INSERT INTO Aplicativo(nome, descricao, preco, id_desenvolvedor) VALUES(?, ?, ?, ?)`, [nome, descricao, preco, id_desenvolvedor], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ id: this.lastID });
  });
});

// Rota para remover aplicativos
app.delete('/removeaplication/:id_aplicativo/:id_desenvolvedor', (req, res) => {
  const { id_aplicativo, id_desenvolvedor } = req.params;
  console.log(`Removing application with id ${id_aplicativo} by developer ${id_desenvolvedor}`);
  db.run(`DELETE FROM Aplicativo WHERE id_aplicativo = ? AND id_desenvolvedor = ?`, [id_aplicativo, id_desenvolvedor], function(err) {
    if (err) {
      return console.log(err.message);
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: `Application with id ${id_aplicativo} and developer id ${id_desenvolvedor} not found` });
    }
    res.json({ message: 'Application removed successfully' });
  });
});

// Rota para atualizar preços de aplicativos
app.put('/updateprice/:id_aplicativo/:id_desenvolvedor', (req, res) => {
  const { id_aplicativo, id_desenvolvedor } = req.params;
  const { novo_preco } = req.body;
  console.log(`Updating price of application with id ${id_aplicativo} by developer ${id_desenvolvedor}`);
  console.log(`New price: ${novo_preco}`);

  // Verificar se o id_desenvolvedor do aplicativo corresponde ao id_desenvolvedor do desenvolvedor
  db.get(`SELECT id_desenvolvedor FROM aplicativo WHERE id_aplicativo = ?`, [id_aplicativo], (err, row) => {
    if (err) {
      return console.log(err.message);
    }

    if (!row) {
      return res.status(404).json({ error: `Application with id ${id_aplicativo} not found` });
    }

    if (row.id_desenvolvedor != id_desenvolvedor) {
      return res.status(403).json({ error: `You are not authorized to update the price of this application` });
    }

    // Atualizar o preço do aplicativo
    db.run(`UPDATE aplicativo SET preco = ? WHERE id_aplicativo = ?`, [novo_preco, id_aplicativo], function(err) {
      if (err) {
        return console.log(err.message);
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: `Application with id ${id_aplicativo} not found` });
      }

      res.json({ message: 'Application price updated successfully' });
    });
  });
});

// Rota para adicionar dados
app.post('/data', (req, res) => {
  const { name } = req.body;
  db.run(`INSERT INTO my_table(name) VALUES(?)`, [name], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ id: this.lastID });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
