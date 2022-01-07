const db = require('./js/_postgres')

async function create(){
    db.connect()

    await db.query(
        "CREATE TABLE artista(id_artista VARCHAR(255) PRIMARY KEY, nome VARCHAR(255) NOT NULL, url_foto VARCHAR(500) NOT NULL)"
    ).then(

    await db.query(
        "CREATE TABLE musica(id_musica VARCHAR(255) PRIMARY KEY, nome VARCHAR(255) NOT NULL, nota NUMERIC, url_foto VARCHAR(255))"
    )).then(

    await db.query(
        "CREATE TABLE musica_artista(id_musica VARCHAR(255),FOREIGN KEY (id_musica) REFERENCES musica(id_musica), id_artista VARCHAR(255),FOREIGN KEY (id_artista) REFERENCES artista(id_artista))"
    )).then(

    await db.query(
        "CREATE TABLE artista_genero(id_artista VARCHAR(255),FOREIGN KEY (id_artista) REFERENCES artista(id_artista), genero VARCHAR(255))"
    )).then(

    await db.query(
        "CREATE TABLE usuario(id_usuario VARCHAR(255) PRIMARY KEY, nome VARCHAR(255) NOT NULL, url_foto VARCHAR(500) NOT NULL)"
    )).then(

    await db.query(
        "CREATE TABLE avaliacao(id_avaliacao Serial PRIMARY KEY, id_musica VARCHAR(255) NOT NULL,FOREIGN KEY (id_musica) REFERENCES musica(id_musica), id_usuario VARCHAR(255) NOT NULL,FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario), nota INTEGER NOT NULL, comentario VARCHAR(500) NULL, data TIMESTAMP with time zone NOT NULL, relevancia INTEGER DEFAULT 0)"
    )).then(

    await db.query(
        "CREATE TABLE curtidas(id_usuario VARCHAR(255) NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario), id_avaliacao INTEGER NOT NULL, FOREIGN KEY (id_avaliacao) REFERENCES avaliacao(id_avaliacao) ON DELETE CASCADE)"
    )).then(

    db.end())
}

create()