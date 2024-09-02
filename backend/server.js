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

// --------------------------------------------- Rotas Gerais -----------------------------------------------
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
    // console.log(rows);
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

// Rota select where
app.get('/where/:table/:condition', (req, res) => {
  const { table, condition } = req.params;
  console.log(`Selecting data from table ${table} with condition ${condition}`);
  db.all(`SELECT * FROM ${table} WHERE ${condition}`, [], (err, rows) => {
    if (err) {
      // Verifica se o erro é devido à tabela não existir
      if (err.message.includes('no such table')) {
        return res.status(404).json({ error: `Table ${table} does not exist` });
      }
      // Outros erros
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});



//---------------------------------------------- Rotas de usuarios ------------------------------------------
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

// Rota para registrar usuario
app.post('/userregister', (req, res) => {
  const { email, senha, primeiroNome, ultimoNome } = req.body;
  console.log(`Creating cccount with email ${email}, password ${senha}`);
  db.run(`INSERT INTO usuario (primeiro_nome, ultimo_nome, email, senha) VALUES ( ?, ?, ?, ?)`, [primeiroNome, ultimoNome, email, senha], function(err) {
    if (err) {
      return console.log(err.message);
    }

    console.log(`User created with id ${this.lastID}`);
    res.json({ id_usuario: this.lastID});
  });
});

// Rota para adicionar saldo ao usuário
app.put('/addbalanceuser/:userid', (req, res) => {
  const { userid } = req.params;
  const { valorAdicionado } = req.body;
  console.log(`Adding balance to user with id ${userid}; Value: ${valorAdicionado}`);
  
  // Verificar se o usuário existe
  db.get(`SELECT saldo FROM usuario WHERE id_usuario = ?`, [userid], (err, row) => {
    if (err) {
      return console.log(err.message);
    }

    if (!row) {
      return res.status(404).json({ error: `User with id ${userid} not found` });
    }

    const saldoAtual = row.saldo;
    const novoSaldo = saldoAtual + valorAdicionado;

    // Atualizar o saldo do usuário
    db.run(`UPDATE usuario SET saldo = ? WHERE id_usuario = ?`, [novoSaldo, userid], function(err) {
      if (err) {
        return console.log(err.message);
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: `User with id ${userid} not found` });
      }

      res.json({ message: 'Balance added successfully' });
    });
  });
});

// Rota de compra de aplicativo
app.post('/comprarCarrinho', (req, res) => {
  const { usuarioId, listaCompras } = req.body;
  console.log(usuarioId)
  console.log(listaCompras)
  data_venda = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let id_nova_venda;
  // Inserir nova venda
  id_nova_venda = db.run(`INSERT INTO venda(id_usuario, data_venda, total) VALUES(?, ?, ?)`, [usuarioId, data_venda, 0], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(this.lastID);
    id_nova_venda = this.lastID;
  });

  setTimeout(() => {
    console.log(`Inserida venda com id ${id_nova_venda}`);
    for (item of listaCompras) {
      db.run(`INSERT INTO item_venda (id_venda, id_aplicativo, preco, quantidade) VALUES(?, ?, ?, ?)`, [id_nova_venda, item.app.id_aplicativo, item.app.preco, item.quantidade], function(err) {
        if (err) {
          return console.log(err.message);
        }
      });
    }
  
    res.json({ mensagem: "Compra concluída com sucesso" });
  }, 200);
});

// Rota para listar compras de um usuário
app.get('/compras/:userid', (req, res) => {
  const { userid } = req.params;
  console.log(`Selecting purchases of user with id ${userid}`);
  db.all(`SELECT * FROM item_venda JOIN aplicativo ON item_venda.id_aplicativo = aplicativo.id_aplicativo JOIN venda ON item_venda.id_venda = venda.id_venda WHERE venda.id_usuario = ?`, [userid], (err, rows) => {
    if (err) {
      return console.log(err.message);
    }
    res.json(rows);
  });
});

//---------------------------------------------- Rotas de desenvolvedores ------------------------------------------
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

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
