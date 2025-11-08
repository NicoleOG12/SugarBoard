CREATE DATABASE IF NOT EXISTS doceria;

USE doceria;

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS doces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  subtitulo VARCHAR(150),
  valor DECIMAL(10,2) NOT NULL,
  peso VARCHAR(50),
  imagem VARCHAR(255),
  estoque INT DEFAULT 0,
  categoria_id INT,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO categorias (nome) VALUES
('Doces Tradicionais'),
('Bolos'),
('Tortas'),
('Trufas'),
('Doces Finos'),
('Sobremesas');

INSERT INTO doces (nome, subtitulo, valor, peso, imagem, estoque, categoria_id) VALUES
('Banoffe', 'Banana, doce de leite e chantilly', 38.00, '900g', 'uploads/Banoffe.svg', 10, 3),
('Macarons', 'Coloridos e crocantes por fora', 5.50, '15g', 'uploads/Macarons.svg', 80, 5),
('Mousse de Maracujá', 'Sobremesa leve e cremosa', 8.00, '120g', 'uploads/Mousse de Maracujá.svg', 30, 6),
('Bolo de Cenoura', 'Com cobertura de chocolate', 25.00, '1kg', 'uploads/Bolo de Cenoura.svg', 10, 2),
('Trufa de Chocolate', 'Recheio cremoso e sabor intenso', 4.50, '30g', 'uploads/Trufas de Chocolate.svg', 60, 4),
('Rocambole Red Velvet', 'Com recheio de cream cheese', 42.00, '1kg', 'uploads/Rocambole.svg', 8, 2),
('Pavê de Chocolates', 'Camadas de creme e biscoito', 30.00, '900g', 'uploads/Pave.svg', 12, 6),
('Mini Sonhos', 'Recheados com creme e açúcar', 3.00, '25g', 'uploads/Mini Sonhos.svg', 100, 1),
('Torta de Limão', 'Base crocante e creme de limão', 35.00, '800g', 'uploads/TortaLimao.jpeg', 8, 3),
('Trufa de Morango', 'Chocolate com recheio de morango', 4.50, '30g', 'uploads/TrufaMorango.jpeg', 60, 4);

