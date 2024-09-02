CREATE TABLE "usuario" (
	"id_usuario"	INTEGER,
	"primeiro_nome"	TEXT NOT NULL,
	"ultimo_nome"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
  	"senha" TEXT NOT NULL,
	"saldo"	NUMERIC,
	PRIMARY KEY("id_usuario" AUTOINCREMENT)
);

INSERT INTO usuario (primeiro_nome, ultimo_nome, email, senha) VALUES ('Alice', 'Johnson', 'alice.johnson@example.com', '1111');
INSERT INTO usuario (primeiro_nome, ultimo_nome, email, senha) VALUES ('Bob', 'Doe', 'bob.doe@example.com', '2222');
INSERT INTO usuario (primeiro_nome, ultimo_nome, email, senha) VALUES ('Charlie', 'Brown', 'charlie.brown@example.com', '3333');
INSERT INTO usuario (primeiro_nome, ultimo_nome, email, senha) VALUES ('Daisy', 'Wilson', 'daisy.wilson@example.com', '4444');
INSERT INTO usuario (primeiro_nome, ultimo_nome, email, senha) VALUES ('Eve', 'Smith', 'eve.smith@example.com', '5555');


CREATE TABLE "desenvolvedor" (
	"id_desenvolvedor"	INTEGER,
	"primeiro_nome"	TEXT NOT NULL,
	"ultimo_nome"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
  	"senha" TEXT NOT NULL,
	"saldo"	NUMERIC,
	PRIMARY KEY("id_desenvolvedor" AUTOINCREMENT)
);

INSERT INTO desenvolvedor (primeiro_nome, ultimo_nome, email, senha) VALUES ('Jane', 'Smith', 'jane.smith@example.com', '1111');
INSERT INTO desenvolvedor (primeiro_nome, ultimo_nome, email, senha) VALUES ('Michael', 'Johnson', 'michael.johnson@example.com', '2222');
INSERT INTO desenvolvedor (primeiro_nome, ultimo_nome, email, senha) VALUES ('John', 'Doe', 'john.doe@example.com', '3333');
INSERT INTO desenvolvedor (primeiro_nome, ultimo_nome, email, senha) VALUES ('Emily', 'Brown', 'emily.brown@example.com', '4444');
INSERT INTO desenvolvedor (primeiro_nome, ultimo_nome, email, senha) VALUES ('David', 'Wilson', 'david.wilson@example.com', '5555');


CREATE TABLE "aplicativo" (
	"id_aplicativo"	INTEGER,
	"nome"	TEXT NOT NULL UNIQUE,
	"descricao"	TEXT,
	"preco"	NUMERIC NOT NULL,
	"id_desenvolvedor"	INTEGER,
	PRIMARY KEY("id_aplicativo" AUTOINCREMENT),
	CONSTRAINT "fk-id_desenvolvedor" FOREIGN KEY("id_desenvolvedor") REFERENCES "desenvolvedor"("id_desenvolvedor")
);

INSERT INTO aplicativo (nome, descricao, preco, id_desenvolvedor) VALUES ('App 1', 'App 1 description', 1.99, 1);
INSERT INTO aplicativo (nome, descricao, preco, id_desenvolvedor) VALUES ('App 2', 'App 2 description', 2.99, 2);
INSERT INTO aplicativo (nome, descricao, preco, id_desenvolvedor) VALUES ('App 3', 'App 3 description', 3.99, 3);
INSERT INTO aplicativo (nome, descricao, preco, id_desenvolvedor) VALUES ('App 4', 'App 4 description', 4.99, 4);
INSERT INTO aplicativo (nome, descricao, preco, id_desenvolvedor) VALUES ('App 5', 'App 5 description', 5.99, 5);


CREATE TABLE "venda" (
	"id_venda"	INTEGER,
	"id_usuario"	INTEGER NOT NULL,
	"data_venda"	TEXT,
	"total"	NUMERIC,
	PRIMARY KEY("id_venda" AUTOINCREMENT),
	CONSTRAINT "fk-id_usuario" FOREIGN KEY("id_usuario") REFERENCES "usuario"("id_usuario")
);

INSERT INTO venda (id_usuario, data_venda, total) VALUES (1, '2021-01-01', 1.99);
INSERT INTO venda (id_usuario, data_venda, total) VALUES (2, '2021-01-02', 2.99);
INSERT INTO venda (id_usuario, data_venda, total) VALUES (3, '2021-01-03', 3.99);
INSERT INTO venda (id_usuario, data_venda, total) VALUES (4, '2021-01-04', 4.99);
INSERT INTO venda (id_usuario, data_venda, total) VALUES (5, '2021-01-05', 5.99);

CREATE TABLE "item_venda" (
	"id_item_venda"	INTEGER,
	"id_venda"	INTEGER NOT NULL,
	"id_aplicativo"	INTEGER NOT NULL,
	"preco"	INTEGER NOT NULL,
	"quantidade"	INTEGER NOT NULL,
	PRIMARY KEY("id_item_venda" AUTOINCREMENT),
	CONSTRAINT "fk-id_aplicativo" FOREIGN KEY("id_aplicativo") REFERENCES "aplicativo"("id_aplicativo"),
	CONSTRAINT "fk-id_venda" FOREIGN KEY("id_venda") REFERENCES "venda"("id_venda")
);

INSERT INTO item_venda (id_venda, id_aplicativo, preco, quantidade) VALUES (1, 1, 1.99, 1);
INSERT INTO item_venda (id_venda, id_aplicativo, preco, quantidade) VALUES (2, 2, 2.99, 1);
INSERT INTO item_venda (id_venda, id_aplicativo, preco, quantidade) VALUES (3, 3, 3.99, 1);
INSERT INTO item_venda (id_venda, id_aplicativo, preco, quantidade) VALUES (4, 4, 4.99, 1);
INSERT INTO item_venda (id_venda, id_aplicativo, preco, quantidade) VALUES (5, 5, 5.99, 1);


-- Trigger inicializa saldo do usuário
CREATE TRIGGER "saldo_inicial_usuario" 
AFTER INSERT ON "usuario"
FOR EACH ROW
BEGIN
    -- Atualiza o saldo do usuário recém-inserido para 0
    UPDATE "usuario" SET saldo = 0 WHERE id_usuario = new.id_usuario;
END;


-- Trigger inicializa saldo do desenvolvedor
CREATE TRIGGER "saldo_inicial_desenvolvedor" 
AFTER INSERT ON "desenvolvedor"
FOR EACH ROW
BEGIN
    -- Atualiza o saldo do usuário recém-inserido para 0
    UPDATE "desenvolvedor" SET saldo = 0 WHERE id_desenvolvedor = new.id_desenvolvedor;
END;


-- Trigger atualiza saldo do usuário
CREATE TRIGGER atualiza_saldo_usuario AFTER INSERT ON item_venda
FOR EACH ROW
BEGIN
	UPDATE usuario SET saldo = saldo - (new.preco * new.quantidade) WHERE id_usuario = (SELECT id_usuario FROM venda WHERE id_venda = new.id_venda);
END;


-- Trigger atualiza saldo do desenvolvedor
CREATE TRIGGER "atualiza_saldo_desenvolvedor" AFTER INSERT ON "item_venda"
FOR EACH ROW
BEGIN
	UPDATE "desenvolvedor" SET saldo = saldo + (new.preco * new.quantidade) WHERE id_desenvolvedor = (SELECT id_desenvolvedor FROM aplicativo WHERE id_aplicativo = new.id_aplicativo);
END;


-- Trigger atualiza valor da compra
CREATE TRIGGER "atualiza_total_compra" AFTER INSERT ON "item_venda"
FOR EACH ROW
BEGIN
	UPDATE "venda" SET total = total + (new.preco * new.quantidade) WHERE id_venda = new.id_venda;
END;

SELECT * FROM item_venda JOIN aplicativo ON item_venda.id_aplicativo = aplicativo.id_aplicativo JOIN venda ON item_venda.id_venda = venda.id_venda WHERE venda.id_usuario = ?;