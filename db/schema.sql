CREATE TABLE IF NOT EXISTS works (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  client      TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags        TEXT NOT NULL DEFAULT '',
  year        INTEGER,
  cover       TEXT NOT NULL DEFAULT '',
  images      TEXT NOT NULL DEFAULT '[]',
  published   INTEGER NOT NULL DEFAULT 1,
  featured    INTEGER NOT NULL DEFAULT 0,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_works_pub ON works (published, position, id);

INSERT OR IGNORE INTO works (slug,title,client,category,description,tags,year,cover,images,published,featured,position) VALUES
('vipoceania-voos-melbourne','Divulgação de voos saindo de Melbourne','VipOceania','campanhas','Arte de divulgação de voos saindo de Melbourne, com avião e preço em destaque.','Campanha,Divulgação',NULL,'/img/w1.webp','["/img/w1.webp"]',1,1,-4),
('sedetec-economia-solidaria','Campanha Economia Solidária','SEDETEC São Leopoldo','campanhas','Post da campanha Economia Solidária, com um agricultor segurando uma alface.','Campanha,Comunicação institucional',NULL,'/img/w2.webp','["/img/w2.webp"]',1,1,-3),
('sedetec-semana-do-mei','Semana do MEI','SEDETEC São Leopoldo','campanhas','Post da Semana do MEI, com foco no rosto sorridente e no texto de chamada.','Campanha,Comunicação institucional',NULL,'/img/w3.webp','["/img/w3.webp"]',1,1,-2),
('amz-natural-centella-asiatica','Peça de produto, Centella Asiática','AMZ Natural','campanhas','Peça de produto com o pote do suplemento Centella Asiática sobre fundo de folhas.','Peça de produto',NULL,'/img/w4.webp','["/img/w4.webp"]',1,1,-1);
