const express = require("express")
const Spotify = require('spotify-web-api-node')
const session = require('cookie-session')
const fetch = require('node-fetch');

const app = express()
const spotify = new Spotify({
    clientId: '',
    clientSecret: ''
    /*
    The MIT License (MIT)
    Copyright (c) 2014-2021 Michael Thelin
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.*/
  });

const handlebars = require('express-handlebars');
const client = require("./js/_postgres");
const { redirect } = require("express/lib/response");
client.connect()

const port = process.env.PORT || 5000

//Template Engine
const handlebarsconfig = handlebars.create({defaultLayout: 'main'})
app.engine('handlebars', handlebarsconfig.engine)
app.set('view engine', 'handlebars')
app.set('views', './views')

handlebarsconfig.handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});


//Body-Parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Sessão
app.use(session({
    name: 'session',
    secret: '',

    maxAge: 1000*60*60 //1 hora
    
}))

//static files
app.use("/css", express.static(__dirname+"/css"))
app.use("/img", express.static(__dirname+"/img"))
app.use("/js", express.static(__dirname+"/js"))

//Routes
app.get("/",function(req, res){
    res.sendFile(__dirname + "/html/index.html")
})

app.get("/busca",async function(req, res){
    req.session.idusuario = (req.query.id || req.session.idusuario )
    console.log(req.session.idusuario)
    if(req.query.id != undefined)
    {
        await updateUserData(req.session.idusuario)
        await createUser(req.session.idusuario).catch((err) => {console.log(err)})   
    }   
    res.sendFile(__dirname + "/html/busca.html")
})

app.get("/estatisticas",async function(req, res){
    let mus_semana = await getBestTracksOfTheWeek()
    let arts_semana = await getBestArtistsOfTheWeek()
    let usu_semana = await getBestUsersOfTheWeek()
    let reviews_recentes= await getLatestReviews()
    let mus_sempre = await getBestTracks()
    let mus_populares = await getPopularTracks()
    let reviews_pop = await getPopularReviews()
    let arts_sempre = await getBestArtists()
    let arts_pop = await getPopularArtists()
    let usu_populares = await getBestUsers()
    res.render('estatisticas', 
    {
        musicas_destaques_semana: mus_semana,
        artistas_destaques_semana: arts_semana, 
        usuarios_destaques_semana: usu_semana,
        reviews_recentes: reviews_recentes,
        musicas_destaques: mus_sempre,
        musicas_populares: mus_populares,
        reviews_populares: reviews_pop,
        artistas_destaques: arts_sempre,
        artistas_populares: arts_pop,
        usuarios_populares: usu_populares
    })
})

app.get("/perfil",async function(req, res){
    let getReviews = await getUserReviews(req.session.idusuario)
    let getLikes = await getRecentLikes(req.session.idusuario)
    res.render('perfil', {reviews:getReviews, likes:getLikes})
})

app.get("/musica",async function(req, res){
    let idm = req.query.id
    let err = req.query.err || false
    let reviews = await getReviews(idm, req.session.idusuario)
    res.render('musica', {analises:reviews, idm:idm, error:err})
})

app.post("/musica",async function(req, res){
    let idm = req.query.id
    await createTrack(idm)
    let err = await createReview(idm, req.session.idusuario, req.body.nota, req.body.comentario).catch((err) => {console.log("erro na criação da review: "+err)})
    await updateScore(idm)

    res.redirect(`/musica/?id=${idm}&code=${err}`)
})

app.post("/like",async function(req, res){
    let idm = req.query.id
    let idr = req.body.idr
    let idu = req.session.idusuario
    await likeReview(idr, idu)
    await updateLikes(idr)
    res.redirect(`/musica/?id=${idm}`)
})

app.post("/delete",async function(req, res){
    let idr = req.body.idr
    let idm = req.body.idm

    await deleteReview(idr)
    await updateScore(idm)
  
    res.redirect(`/musica/?id=${idm}`)
})

//Funções
async function updateScore(id)
{
    try{
        let media = await client.query(`SELECT AVG(nota) FROM avaliacao WHERE id_musica='${id}'`)
      
        console.log(media.rows[0].avg)
        if(media.rows[0].avg == null)
        {
            await client.query(`UPDATE musica SET nota=0 WHERE id_musica='${id}'`)
        }
        else
            await client.query(`UPDATE musica SET nota=${media.rows[0].avg} WHERE id_musica='${id}'`)
    } 
    catch(err)
    {
        console.log("erro na atualização da nota: "+err.stack)
    }  
}

async function createUser(id)
{
    try{
        let exists = await client.query(`SELECT EXISTS(SELECT id_usuario from usuario WHERE id_usuario = '${id}')`)
        if(!exists.rows[0].exists)
        {
            spotify.clientCredentialsGrant().then(
                (data)=>{
                    spotify.setAccessToken(data.body['access_token']);
                    return spotify.getUser(id)
                },
                (err)=>{
                    console.log("Erro no access token: "+err)
                }
            ).then(async (data)=>{
                foto = data.body.images[0]
                if(foto)
                    writeUserDB(data.body.id, data.body.display_name, data.body.images[0].url)
                else
                    writeUserDB(data.body.id, data.body.display_name, '')
            })
        }
    }
    catch(err)
    {
        console.log(err.stack)
    }
}

async function writeUserDB(userId, userName, url)
{
    try{
        await client.query(`INSERT INTO usuario (id_usuario, nome, url_foto) VALUES ('${userId}','${userName}','${url}')`)
    }
    catch(err)
    {
        console.log(err.stack)
    }
}

async function updateUserData(id)
{
    try
    {
        let exists = await client.query(`SELECT EXISTS(SELECT id_usuario from usuario WHERE id_usuario = '${id}')`)
        if(exists.rows[0].exists)
        {
            spotify.clientCredentialsGrant().then(
                (data)=>{
                    spotify.setAccessToken(data.body['access_token']);
                    return spotify.getUser(id)
                },
                (err)=>{
                    console.log("Erro no access token: "+err)
                }
            ).then(async (data)=>{
                foto = data.body.images[0]
                if(foto)
                {
                    await client.query(`UPDATE usuario SET nome='${data.body.display_name}',
                    url_foto = '${data.body.images[0].url}' 
                    WHERE id_usuario='${data.body.id}'`)
                }
                else
                    await client.query(`UPDATE usuario SET nome='${data.body.display_name}',
                    url_foto = ''  
                    WHERE id_usuario='${data.body.id}'`)
            }).catch((e)=>{console.log(e)})
        }
    }
    catch(err)
    {
        console.log(err.stack)
    }
}

async function createTrack(id)
{
    let exists = await client.query(`SELECT EXISTS(SELECT id_musica from musica WHERE id_musica = '${id}')`)
    if(!exists.rows[0].exists)
    {
        spotify.clientCredentialsGrant().then(
            (data)=>{
                spotify.setAccessToken(data.body['access_token']);
                return spotify.getTrack(id)
            },
            (err)=>{
                console.log("Erro no access token: "+err)
            }
        ).then(async (data)=>{
           await writeTrackDB(data.body.id, data.body.name, data.body.album.images[0].url)
           for(artist of data.body.artists)
           {
                await createArtist(artist.id)
                console.log(data.body.id)
                await linkTrackArtist(data.body.id, artist.id)
           }
        }).catch((err)=>console.log(err))
    }
}

async function writeTrackDB(trackId, trackName, url_album_foto)
{
    try{
        await client.query(`INSERT INTO musica (id_musica, nome, nota, url_foto) VALUES ('${trackId}','${trackName}', 0, '${url_album_foto}')`)
    }
    catch(err)
    {
        console.log(err.stack)
    }
}

async function linkTrackArtist(id_musica, id_artista)
{
    try{
        let exists = await client.query(`SELECT EXISTS(SELECT id_musica, id_artista from musica_artista WHERE id_musica = '${id_musica}' AND id_artista='${id_artista}')`)

        if(!exists.rows[0].exists)
        {
            await client.query(`INSERT INTO musica_artista VALUES('${id_musica}','${id_artista}')`)
        }
        else{console.log("musica já existe")}
    }
    catch(err)
    {
        console.log(err.stack)
    }
}

async function createArtist(id)
{
    let exists = await client.query(`SELECT EXISTS(SELECT id_artista from artista WHERE id_artista = '${id}')`)
    if(!exists.rows[0].exists)
    {
        spotify.clientCredentialsGrant().then(
            (data)=>{
                spotify.setAccessToken(data.body['access_token']);
                return spotify.getArtist(id)
            },
            (err)=>{
                console.log("Erro no access token (artista): "+err)
            }
        ).then(async (data)=>
        {
            await writeArtistDB(data.body.id, data.body.name, data.body.images[0].url)
            for(genre of data.body.genres)
            {
                await linkArtistGenre(data.body.id, genre)
            }

        }).catch((err)=>console.log(err))
        .finally(()=>{return true})
    }
}

async function writeArtistDB(artistId, name, url_foto)
{
    try
    {
        await client.query(`INSERT INTO artista (id_artista, nome, url_foto) VALUES ('${artistId}','${name}','${url_foto}')`)
    }
    catch(err)
    {
        console.log("erro na escrita do artista: "+err.stack)
    }
}

async function linkArtistGenre(id_artista, genero)
{
    try{
        let exists = await client.query(`SELECT EXISTS(SELECT id_artista, genero from artista_genero WHERE id_artista = '${id_artista}' AND genero='${genero}')`)

        if(!exists.rows[0].exists)
        {
            await client.query(`INSERT INTO artista_genero VALUES('${id_artista}','${genero}')`)
        }
        else{console.log("artista já existe")}
    }
    catch(err)
    {
        console.log(err.stack)
    }
}

async function getReviews(spotifyId, userId){
    try{
        const res = await client.query(`SELECT u.url_foto, u.nome, a.id_avaliacao, a.id_musica, a.data, a.nota, a.relevancia, a.comentario FROM avaliacao a INNER JOIN usuario u ON a.id_usuario = u.id_usuario WHERE a.id_musica = '${spotifyId}'`)
        const reviews = res.rows
        for(review of reviews)
        {
            apagar = await checkReviewer(review.id_avaliacao, userId)
            curtida = await checkLike(review.id_avaliacao, userId)
            review.curtida = curtida
            review.apagar = apagar
        }
        return reviews;
    }
    catch(err)
    {
        console.log(err.stack)
    }
}

async function createReview(spotifyId, idusuario, nota, comentario){
    try{
        let rawDate = new Date()
        let date = rawDate.getFullYear()+"-"+(parseInt(rawDate.getMonth())+1)+"-"+rawDate.getDate()+" "+rawDate.getHours()+":"+rawDate.getMinutes()+":"+rawDate.getSeconds()
        let exists = await client.query(`SELECT EXISTS(SELECT id_usuario from avaliacao WHERE id_usuario = '${idusuario}' AND id_musica='${spotifyId}')`)
        if(!exists.rows[0].exists)
        {
            await client.query(`INSERT INTO avaliacao(id_musica, id_usuario, nota, comentario, data) VALUES ('${spotifyId}', '${idusuario}', ${nota}, '${comentario}', '${date}')`)
            return false
        }
        else
        {
            return true
        }
    }
    catch(err)
    {
        console.log(err.stack)
    }
}

async function checkLike(idReview, idUsuario)
{
    try{
        let exists = await client.query(`SELECT EXISTS(SELECT id_usuario from curtidas WHERE id_usuario = '${idUsuario}' AND id_avaliacao = ${idReview})`)
        return exists.rows[0].exists
    }
    catch(err)
    {
        console.log("erro no checkLike: "+err.stack)
    }
}

async function checkReviewer(idReview, idUsuario)
{
    try{
        let resp = await client.query(`SELECT EXISTS(SELECT id_usuario from avaliacao WHERE id_usuario = '${idUsuario}' AND id_avaliacao=${idReview})`)
        return resp.rows[0].exists
    }
    catch(err)
    {
        console.log("erro no checkLike: "+err.stack)
    }
}

async function likeReview(idReview, idUsuario)
{
    try{
        let exists = await checkLike(idReview, idUsuario)
        if(!exists)
        {
            await client.query(`INSERT INTO curtidas VALUES ('${idUsuario}', ${idReview})`)
        }
        else
        {
            await client.query(`DELETE FROM curtidas WHERE id_usuario = '${idUsuario}' AND id_avaliacao = ${idReview}`)
        }
    }
    catch(err)
    {
        console.log("erro no likeReview: "+err.stack)
    }
}

async function deleteReview(idReview)
{
    try
    {
        await client.query(`DELETE FROM avaliacao WHERE id_avaliacao = ${idReview}`)
        return true
    }
    catch(err)
    {
        console.log(err.stack)
        return false
    }
}       
    
async function updateLikes(idReview)
{
    let data = await client.query({
        text: `SELECT id_avaliacao FROM curtidas WHERE id_avaliacao=${idReview}`,
        rowMode: "array"
    })
    let numLikes = data.rowCount

    await client.query(`UPDATE avaliacao SET relevancia=${numLikes} WHERE id_avaliacao=${idReview}`)
}

function getPastWeek()
{
    let rawDate = new Date()
    let UTCDate = new Date(Date.UTC(rawDate.getFullYear(),rawDate.getMonth(), rawDate.getDate(), rawDate.getHours(), rawDate.getMinutes(), rawDate.getSeconds()))
    UTCDate.setDate(UTCDate.getDate()-7)
    let date = UTCDate.getFullYear()+"-"+(UTCDate.getMonth()+1)+"-"+UTCDate.getDate()+" "+UTCDate.getHours()+":"+UTCDate.getMinutes()+":"+UTCDate.getSeconds()
    return date    
}

async function getBestTracksOfTheWeek()
{
    try
    {
        let date = getPastWeek()
        
        let data = await client.query(
            `SELECT musica.nome, musica.id_musica, musica.url_foto, artistas.nomes as nomesartistas, TRUNC(notas.nota, 2) as nota, reviews from
            (SELECT musica.id_musica, ARRAY_AGG(artista.nome) as nomes 
            from musica 
            inner join musica_artista USING(id_musica)
            inner join artista USING(id_artista)
            GROUP BY id_musica) artistas
            INNER JOIN musica USING(id_musica)
			INNER JOIN (SELECT AVG(avaliacao.nota) as nota, avaliacao.id_musica, COUNT(*) as reviews 
						FROM avaliacao 
						WHERE avaliacao.data>'${date}' 
						GROUP BY id_musica) notas USING(id_musica) WHERE notas.nota>0 AND reviews>1
            ORDER BY nota DESC LIMIT 20`
            )

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getBestArtistsOfTheWeek()
{
    try
    {
        let date = getPastWeek()

        let data = await client.query(
        `SELECT artista.id_artista, artista.nome, 
        TRUNC(id_nota.nota, 2) as nota, 
        generos.generos, artista.url_foto, reviews from
        (SELECT AVG(avaliacao.nota) as nota, id_artista, COUNT(*) reviews 
		FROM
        avaliacao 
		INNER JOIN musica_artista USING(id_musica)
        INNER JOIN artista USING(id_artista) WHERE avaliacao.data>'${date}'
        GROUP BY(id_artista)) id_nota 
		LEFT JOIN (SELECT id_artista, ARRAY_AGG(genero) generos from
        artista_genero GROUP BY id_artista) generos USING(id_artista)
        INNER JOIN artista USING(id_artista) WHERE nota>0 AND reviews>1
        ORDER BY nota DESC LIMIT 20`
        )

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getBestUsersOfTheWeek()
{
    try
    {
        let date = getPastWeek()

        let data = await client.query(`SELECT u.nome, u.url_foto, likes FROM 
        (SELECT a.id_usuario , COUNT(*) as likes FROM avaliacao a INNER JOIN curtidas USING(id_avaliacao) WHERE a.data>'${date}' GROUP BY a.id_usuario) relevancia
        INNER JOIN usuario u USING(id_usuario) ORDER BY likes DESC LIMIT 20`)

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getLatestReviews()
{
    try
    {
        let date = getPastWeek()

        let data = await client.query(`SELECT u.nome, a.nota, a.data, a.relevancia,a.comentario, musica.nome as nome_musica, musica.url_foto as album_foto, musica.id_musica, artistas.nomes 
        FROM usuario u INNER JOIN avaliacao a USING(id_usuario) INNER JOIN
        (SELECT musica.id_musica, ARRAY_AGG(artista.nome) as nomes 
            from musica 
            inner join musica_artista USING(id_musica)
            inner join artista USING(id_artista) 
            GROUP BY id_musica) artistas USING(id_musica)
        INNER JOIN musica USING(id_musica)
        ORDER BY data DESC
        LIMIT 50`)

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getBestTracks()
{
    try
    {   
        let data = await client.query(
            `SELECT musica.nome, musica.id_musica, musica.url_foto, artistas.nomes as nomesartistas, TRUNC(musica.nota , 2) as nota, musicas.reviews from
            (SELECT musica.id_musica, ARRAY_AGG(artista.nome) as nomes 
            from musica
            inner join musica_artista USING(id_musica)
            inner join artista USING(id_artista) 
            GROUP BY id_musica) artistas
            INNER JOIN musica USING(id_musica) 
			inner join (SELECT id_musica, COUNT(*) as reviews FROM musica INNER JOIN avaliacao USING(id_musica) GROUP BY id_musica) as musicas USING(id_musica)
			WHERE nota>0 AND reviews>1
            ORDER BY nota DESC LIMIT 20`)

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getPopularTracks()
{
    try
    {   
        let data = await client.query(
            `SELECT DISTINCT musica.nome, musica.url_foto,musica.id_musica, artistas.nomes as nomesArtistas, pop.popularidade from 
            (SELECT musica.id_musica, ARRAY_AGG(artista.nome) as nomes 
                        from musica 
                        inner join musica_artista USING(id_musica)
                        inner join artista USING(id_artista) 
                        GROUP BY id_musica) artistas inner join
            (SELECT COUNT(a.nota) as popularidade, a.id_musica from avaliacao a group by a.id_musica order by
            AVG(a.nota))pop using(id_musica)
            inner join musica using(id_musica) ORDER BY popularidade DESC LIMIT 20`)

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getPopularReviews()
{
    try
    {   
        let data = await client.query(
            `SELECT usuario.nome, a.nota, a.data, a.relevancia,a.comentario, 
            musica.nome as nome_musica, musica.url_foto as album_foto, 
            musica.id_musica, artistas.nomes as artistas FROM
            usuario INNER JOIN 
            avaliacao a USING(id_usuario) 
            INNER JOIN (SELECT musica.id_musica, ARRAY_AGG(artista.nome) as nomes 
                        from musica 
                        inner join musica_artista USING(id_musica)
                        inner join artista USING(id_artista) 
                        GROUP BY id_musica) artistas USING(id_musica) 
            INNER JOIN musica USING(id_musica) WHERE relevancia>0
			ORDER BY relevancia DESC LIMIT 20`
            )

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
    
}

async function getBestArtists()
{
    try
    {
        let data = await client.query(`SELECT artista.id_artista, artista.nome, TRUNC(id_nota.nota, 2) as nota, generos.generos, artista.url_foto, reviews from
        (SELECT AVG(avaliacao.nota) as nota, id_artista from 
        avaliacao INNER JOIN musica_artista USING(id_musica)
        INNER JOIN artista USING(id_artista)
        GROUP BY(id_artista)) id_nota LEFT JOIN 
        (SELECT artista.id_artista, ARRAY_AGG(genero) generos from
        artista INNER JOIN artista_genero USING(id_artista) GROUP BY id_artista) generos USING(id_artista)
        INNER JOIN artista USING(id_artista) 
        INNER JOIN (SELECT id_artista, COUNT(*) as reviews FROM musica_artista INNER JOIN avaliacao USING(id_musica) GROUP BY id_artista) as musicas USING(id_artista)
        WHERE nota>0 AND reviews>1
        ORDER BY nota DESC LIMIT 20`)

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getPopularArtists()
{
    try
    {
        let data = await client.query(`SELECT artista.nome, generos.generos, id_reviews.nreviews, artista.url_foto from	
        (SELECT artista_genero.id_artista, ARRAY_AGG(genero)generos from artista_genero GROUP BY id_artista) generos
        RIGHT JOIN (SELECT musica_artista.id_artista, COUNT(*) as nreviews FROM 
                    avaliacao INNER JOIN musica_artista USING(id_musica) 
                    GROUP BY musica_artista.id_artista) 
        id_reviews USING(id_artista)
        INNER JOIN artista USING(id_artista) WHERE nreviews>0
        ORDER BY nreviews DESC LIMIT 20`)

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getBestUsers()
{
    try
    {
        let data = await client.query(

        `SELECT u.nome, u.url_foto, likes FROM 
        (SELECT a.id_usuario , COUNT(*) as likes FROM avaliacao a INNER JOIN curtidas USING(id_avaliacao) GROUP BY a.id_usuario) relevancia
        INNER JOIN usuario u USING(id_usuario) ORDER BY likes DESC LIMIT 20`

        )

        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getUserReviews(id)
{
    try
    {
        let data = await client.query(`SELECT a.nota, a.relevancia, a.comentario, musica.nome,musica.id_musica, musica.url_foto, artistas.nomes as artistas FROM
        avaliacao a INNER JOIN
                (SELECT musica.id_musica, ARRAY_AGG(artista.nome) as nomes 
                                from musica 
                                inner join musica_artista USING(id_musica)
                                inner join artista USING(id_artista) 
                                GROUP BY id_musica) artistas USING(id_musica) INNER JOIN
        musica USING(id_musica) INNER JOIN
        usuario u USING(id_usuario)
        WHERE u.id_usuario='${id}' ORDER BY data DESC`)
        console.log("reviews: "+data.rows)
        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

async function getRecentLikes(id)
{
    try
    {
        let data = await client.query(`SELECT musica.id_musica, musica.url_foto, musica.nome, artistas.nomes as artistas, u.nome as curtidor, reviews.data FROM
        (SELECT musica.id_musica, ARRAY_AGG(artista.nome) as nomes 
            from musica 
            inner join musica_artista USING(id_musica)
            inner join artista USING(id_artista) 
            GROUP BY id_musica) artistas 
        INNER JOIN musica USING(id_musica)
        INNER JOIN (SELECT id_avaliacao, id_musica, a.data FROM avaliacao a WHERE id_usuario='${id}') reviews USING(id_musica)
                INNER JOIN curtidas USING(id_avaliacao)
                INNER JOIN usuario u USING(id_usuario)
        ORDER BY reviews.data DESC LIMIT 30`)
        console.log("likes: "+data.rows)
        return data.rows
    }
    catch(err)
    {
        console.log("erro: "+err)
    }
}

app.listen(port, ()=>{console.info("servidor rodando na porta: "+port)})