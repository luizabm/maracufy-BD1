const Spotify = require('spotify-web-api-js');
const s = new Spotify();

if($("body#index").length > 0) {
(function() {
    function login(callback) {
        var CLIENT_ID = '';
        var REDIRECT_URI = 'https://maracufy.herokuapp.com/busca';
        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
        }
        
        var url = getLoginURL([
            'user-read-email',
            'user-read-private',
            'playlist-modify-private',
            'user-read-recently-played',
            'user-top-read'
        ]);
    
        window.addEventListener("message", function(event){
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);
        
        var w = window.open(url,
                            '_self',
                            'Spotify'
                           );
        
    }

    function getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            }
        });
    }

    var loginButton = document.getElementById('btn-login');
    
    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    loginButton.style.display = 'none';
                });
        });
    });
})();
}

if($("body#busca").length > 0) {
  
(async function QuandoCarrega() {
    let hashcontent = new URL(document.URL).hash
    if(hashcontent.length > 0)
    {
        let aux = hashcontent.split("access_token=")[1]
        let token = aux.split("&")[0]
        s.setAccessToken(token);
        window.localStorage.setItem('access-token',token);
        let idu = await s.getMe()
        window.location.replace(`https://maracufy.herokuapp.com/busca/?id=${idu.id}`)
    }
    else{   
        let token = window.localStorage.getItem('access-token');
        if(token == null)
        {
            window.alert("É necessário estar logado no spotify para utilizar o Maracufy")
            window.location.replace('https://maracufy.herokuapp.com/')
        }
        s.setAccessToken(token);
    }

    
})();

function printValues(data)
{
    let field = document.getElementById("conteudo-busca")
    field.innerHTML = ""
    
    for(var i = 0; i<data.tracks.items.length; i++) {
        var link = document.createElement("a");
        link.setAttribute('href', `https://maracufy.herokuapp.com/musica/?id=${data.tracks.items[i].id}`);
        link.className = 'musica-link';

        var song = document.createElement("div");
        song.className = 'musica';

        song.innerHTML += '<img class="musica-capa" src=' + `${data.tracks.items[i].album.images[2].url}` + '><\img>'
        song.innerHTML += '<p class="musica-nome">' + `${data.tracks.items[i].name}` + '<\p>';
        song.innerHTML += '<p class="musica-artista">' + `${data.tracks.items[i].artists[0].name}` + '<\p>';

        link.appendChild(song);
        field.appendChild(link);
    } 
}

function updateResult(query) {
        s.searchTracks(query, {limit: 30}).then(
        function (data) {
            console.log(data);
             printValues(data);
        },
        function (err) {
             console.error(err);
        }
        );
}

const barrabusca = document.getElementById("barradebusca");
barrabusca.addEventListener('keyup', function(){updateResult(barrabusca.value)});

}

if($("body#perfil").length > 0) {
    
const songsShortTerm = document.getElementById("songs-shortterm");
let listSongsShortTerm = 0;

songsShortTerm.addEventListener('click', function() {
    if (listSongsShortTerm == 0) {
        s.getMyTopTracks({time_range: 'short_term',limit: 50}).then(
            function (data) {
                listSongsShortTerm = data;
                printUserSongs(data);
                console.log(data);
            },
            function (err) {
                 console.error(err);
            }
        )
    }
    else printUserSongs(listSongsShortTerm);
});

const songsMediumTerm = document.getElementById("songs-mediumterm");
let listSongsMediumTerm = 0;

songsMediumTerm.addEventListener('click', function() {
    if (listSongsMediumTerm == 0) {
        s.getMyTopTracks({time_range: 'medium_term',limit: 50}).then(
            function (data) {
                listSongsMediumTerm = data;
                printUserSongs(data);
                console.log(data);
            },
            function (err) {
                 console.error(err);
            }
        )
    }
    else printUserSongs(listSongsMediumTerm);
});

const songsLongTerm = document.getElementById("songs-longterm");
let listSongsLongTerm = 0;

songsLongTerm.addEventListener('click', function() {
    if (listSongsLongTerm == 0) {
        s.getMyTopTracks({time_range: 'long_term',limit: 50}).then(
            function (data) {
                listSongsLongTerm = data;
                printUserSongs(data);
                console.log(data);
            },
            function (err) {
                 console.error(err);
            }
        )
    }
    else printUserSongs(listSongsLongTerm);
});

const artistsShortTerm = document.getElementById("artists-shortterm");
let listArtistsShortTerm = 0;

artistsShortTerm.addEventListener('click', function() {
    if (listArtistsShortTerm == 0) {
        s.getMyTopArtists({time_range: 'short_term',limit: 20}).then(
            function (data) {
                listArtistsShortTerm = data;
                printUserArtists(data);
                console.log(data);
            },
            function (err) {
                 console.error(err);
            }
        )
    }
    else printUserArtists(listArtistsShortTerm);
});

const artistsMediumTerm = document.getElementById("artists-mediumterm");
let listArtistsMediumTerm = 0;

artistsMediumTerm.addEventListener('click', function() {
    if (listArtistsMediumTerm == 0) {
        s.getMyTopArtists({time_range: 'medium_term',limit: 20}).then(
            function (data) {
                listArtistsMediumTerm = data;
                printUserArtists(data);
                console.log(data);
            },
            function (err) {
                 console.error(err);
            }
        )
    }
    else printUserArtists(listArtistsMediumTerm);
});

const artistsLongTerm = document.getElementById("artists-longterm");
let listArtistsLongTerm = 0;

artistsLongTerm.addEventListener('click', function() {
    if (listArtistsLongTerm == 0) {
        s.getMyTopArtists({time_range: 'long_term',limit: 20}).then(
            function (data) {
                listArtistsLongTerm = data;
                printUserArtists(data);
                console.log(data);
            },
            function (err) {
                 console.error(err);
            }
        )
    }
    else printUserArtists(listArtistsLongTerm);
});

function printUser(data) {
    let field = document.getElementById("userdata")

    let dados = document.createElement("div");
    dados.className = 'dados';

    dados.innerHTML +=  '<div class="nomefoto-profile"><p id="dado-nome">' + `${data.display_name}` + '</p>'+
                        '<img id="dado-foto" src=' + `${data.images[0].url}` + '></div>'

    dados.innerHTML +=  '<div class= "resto-profile"> <a href=' + `${data.external_urls.spotify}` + ' target="_blank"><img id="logo-spotify" src="../img/spotify.png"></img></a> <p id="dado-pais">País: ' + `${data.country}` + '</p>'+
                        '<p id="dado-seguidores"> Seguidores: ' + `${data.followers.total}` + '</p> </div>'

    field.appendChild(dados);

}

function printUserArtists(data) {
    let field = document.getElementById("topartists");
    field.innerHTML = "";

    let dados = document.createElement("div");
    dados.className = 'dados-artistas';

    for(var i = 0; i<data.items.length; i++) {
        var artist = document.createElement("div");
        artist.className = 'dado-artista';

        let currentArtist = i+1;
        artist.innerHTML += '<div class="dado-artista-circulo"><p class="dado-artista-numero">'+ currentArtist + '</p></div>';
        artist.innerHTML += '<img class="dado-artista-foto" src=' + `${data.items[i].images[2].url}` + '></img>'
        artist.innerHTML += '<div id="dado-artista-span"><p class="dado-artista-nome">' + `${data.items[i].name}` + '</p></div>';

        field.appendChild(artist);
    }

}

function printUserSongs(data) {

    let field2 = document.getElementById("toptracks");
    field2.innerHTML = "";

    let dados2 = document.createElement("div");
    dados2.className = 'dados2';

    for(var i = 0; i<data.items.length; i++) {
        var songData = document.createElement("div");
        songData.className = 'dado-musica';
        let currentSong = i+1;
        songData.innerHTML += '<div class="dado-musica-circulo"><p class="dado-musica-numero">'+ currentSong + '</p></div>';
        songData.innerHTML += '<img class="dado-musica-capa" src=' + `${data.items[i].album.images[2].url}` + '></img>'
        songData.innerHTML += '<div id="dado-musica-span"><a href=https://maracufy.herokuapp.com/musica/?id=' + `${data.items[i].id}` + ' target="_blank"><p class="dado-musica-nome">' + `${data.items[i].name}` + '</p></a>' +
                              '<p class="dado-musica-artista">' + `${data.items[i].artists[0].name}` + '</p></div>';

        field2.appendChild(songData);
    }

}

(function getUserData() {

    let token = window.localStorage.getItem('access-token');
    if(token == null)
    {
        window.alert("É necessário estar logado no spotify para utilizar o Maracufy")
        window.location.replace('https://maracufy.herokuapp.com/')
    }
    s.setAccessToken(token);
    console.log(s.getAccessToken());

    s.getMe().then(
        function (data) {
            printUser(data);
            console.log(data);
        },
        function (err) {
             console.error(err);
        }
    )

    s.getMyTopTracks({time_range: 'short_term',limit: 50}).then(
        function (data) {
            listSongsShortTerm = data;
            printUserSongs(data);
            console.log(data);
        },
        function (err) {
             console.error(err);
        }
    )

    s.getMyTopArtists({time_range: 'short_term',limit: 20}).then(
        function (data) {
            listArtistsShortTerm = data;
            printUserArtists(data);
            console.log(data);
        },
        function (err) {
             console.error(err);
        }
    )

})();

}

if($("body#musica").length > 0) {

    let idArtista;
    let idAlbum;

    const infoArtista = document.getElementById("artista-info");
    let listArtistInfo = 0;

    infoArtista.addEventListener('click', function() {
        if (listArtistInfo == 0) {
            s.getArtist(idArtista).then(
                function (data) {
                    listArtistInfo = data;
                    console.log(data);
                    printArtistData(data);
                },
                function (err) {
                    console.error(err);
                }
            )
        }
        else printArtistData(listArtistInfo);
    });

    const similarArtists = document.getElementById("artistas-similares");
    let listSimilarArtists = 0;

    similarArtists.addEventListener('click', function() {
        if (listSimilarArtists == 0) {
            s.getArtistRelatedArtists(idArtista).then(
                function (data) {
                    listSimilarArtists = data;
                    console.log(data);
                    printArtistRelatedArtistsData(data);
                },
                function (err) {
                    console.error(err);
                }
            )
        }
        else printArtistRelatedArtistsData(listSimilarArtists);
    });

    const albumTracks = document.getElementById("album-faixas");
    let listAlbumTracks = 0;

    albumTracks.addEventListener('click', function() {
        if (listAlbumTracks == 0) {
            s.getAlbumTracks(idAlbum).then(
                function (data) {
                    listAlbumTracks = data;
                    console.log(data);
                    printAlbumData(data);
                },
                function (err) {
                    console.error(err);
                }
            )
        }
        else printAlbumData(listAlbumTracks);
    });

    const albumPlayer = document.getElementById("album-player");
    albumPlayer.addEventListener('click', function() {
        let fieldAlbum = document.getElementById("conteudo-album")
        fieldAlbum.innerHTML = ""
        fieldAlbum.innerHTML += '<iframe src="https://open.spotify.com/embed/album/' + idAlbum + '" width="90%" height="210" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
    });

    function printSongData(data) {

        let field = document.getElementById("conteudo-musica")

        let dados = document.createElement("div");
        dados.className = 'dados-musica';
    
        dados.innerHTML += '<img id="dado-foto" src=' + `${data.album.images[0].url}` + '></img>'

        let dadosMusica = document.createElement("div");
        dadosMusica.className = 'dado-musica';
        dadosMusica.innerHTML += '<p id="dado-nome">' + `${data.name}` + '</p>'+
                                '<p id="dado-nome-album">' + `${data.album.name}` + '</p>'
        
        let dadosArtista = document.createElement("p");
        dadosArtista.className = 'dado-artista';
        
        for (let i = 0; i < data.artists.length; i++) {
            if (i == (data.artists.length - 1)) 
                dadosArtista.innerHTML += ' ' + `${data.artists[i].name}`
            else 
                dadosArtista.innerHTML +=  ' ' + `${data.artists[i].name}` + ','
        }

        let playerMusica = document.createElement("div");
        playerMusica.className = 'player-musica';
        playerMusica.innerHTML += '<p id="player-titulo">Player: </p>';
        playerMusica.innerHTML += '<iframe src="https://open.spotify.com/embed/track/' + data.id + '" width="95%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>'

        dadosMusica.appendChild(dadosArtista);
        dados.appendChild(dadosMusica);
        field.appendChild(dados);
        field.appendChild(playerMusica);

        let field2 = document.getElementById("titulo-avaliar-musica")
        field2.innerHTML += '<h3 style="text-align:center">Avalie ' + `${data.name}` + '</h3>'
    }

    function printArtistData(data) {
        let field = document.getElementById("conteudo-artista")
        field.innerHTML = "";

        let dados = document.createElement("div");
        dados.className = 'dados-artista';
    
        dados.innerHTML += '<img id="dado-foto-artista" src=' + `${data.images[0].url}` + '></img>'

        let dadosArtista = document.createElement("div");
        dadosArtista.className = 'dado-artista';
        dadosArtista.innerHTML += '<p id="dado-nome-artista">' + `${data.name}` + '</p>'
        dadosArtista.innerHTML += '<p>Seguidores: ' + `${data.followers.total}` + '</p>'
        dadosArtista.innerHTML += '<p>Popularidade: ' + `${data.popularity}` + '</p>'
        dadosArtista.innerHTML += '<a href=' + `${data.external_urls.spotify}` + ' target="_blank"><img id="logo-spotify" src="../img/spotify.png"></img></a>'

        dados.appendChild(dadosArtista);
        field.appendChild(dados);

        if (data.genres.length > 0) {
            let dadosGeneros = document.createElement("div");
            dadosGeneros.className = 'dado-generos';
            dadosGeneros.innerHTML += '<p id="dado-genero-titulo">Gêneros: </p>';
            
            for (let i = 0; i < data.genres.length; i++) {
                dadosGeneros.innerHTML += '<span class="dado-genero-nome"> ' + `${data.genres[i]}` + '</span>'
            }

            field.appendChild(dadosGeneros);
        }
    }

    function printArtistRelatedArtistsData(data) {
        let field = document.getElementById("conteudo-artista")
        field.innerHTML = "";

        for(var i = 0; i<data.artists.length; i++) {
            var artist = document.createElement("div");
            artist.className = 'dado-artista-similar';
    
            artist.innerHTML += '<img class="dado-artista-similar-foto" src=' + `${data.artists[i].images[2].url}` + '></img>'
            artist.innerHTML += '<div id="dado-artista-similar-span"><p class="dado-artista-similar-nome">' + `${data.artists[i].name}` + '</p></div>';
    
            field.appendChild(artist);
        }
    }

    function printAudioFeaturesTrack(data) {
        let field = document.getElementById("conteudo-atributos")

        field.innerHTML += '<span class="nome-atributo">Dançabilidade: </span>'
        field.innerHTML += '<span>' + `${data.danceability}` + '</span>'
        field.innerHTML += '<div id="barra-progresso"><div style="width: ' + (`${data.danceability}` * 100) + '%"></div></div>'
        field.innerHTML += '<p>O quanto a faixa é apropriada para dançar baseado em uma combinação de elementos musicais, incluindo ritmo, batida e regularidade. Varia entre 0.0 e 1.0.</p>'
        
        field.innerHTML += '<span class="nome-atributo">Acústica: </span>'
        field.innerHTML += '<span>' + `${data.acousticness}` + '</span>'
        field.innerHTML += '<div id="barra-progresso"><div style="width: ' + (`${data.acousticness}` * 100) + '%"></div></div>'
        field.innerHTML += '<p>O quanto a faixa é acústica. Varia entre 0.0 e 1.0.</p>'
       
        field.innerHTML += '<span class="nome-atributo">Valence: </span>'
        field.innerHTML += '<span>' + `${data.valence}` + '</span>'
        field.innerHTML += '<div id="barra-progresso"><div style="width: ' + (`${data.valence}` * 100) + '%"></div></div>'
        field.innerHTML += '<p>O quanto a faixa é positiva musicalmente. Varia entre 0.0 e 1.0.</p>'
    }

    function printAlbumData(data) {

        let field = document.getElementById("conteudo-album");
        field.innerHTML = "";

        let dados2 = document.createElement("div");
        dados2.className = 'dados2';

        for(var i = 0; i<data.items.length; i++) {
            var songData = document.createElement("div");
            songData.className = 'dado-musica-album';
            let currentSong = i+1;
            songData.innerHTML += '<div class="dado-musica-circulo"><p class="dado-musica-numero">'+ currentSong + '</p></div>';
            songData.innerHTML += '<div id="dado-musica-span"><a href=https://maracufy.herokuapp.com/musica/?id=' + `${data.items[i].id}` + ' target="_blank"><p class="dado-musica-nome">' + `${data.items[i].name}` + '</p></a></div>';

            field.appendChild(songData);
        }
    }

    
    (function getSongData() {

        let token = window.localStorage.getItem('access-token');
        if(token == null)
        {
            window.alert("É necessário estar logado no spotify para utilizar o Maracufy")
            window.location.replace('https://maracufy.herokuapp.com')
        }
        s.setAccessToken(token);

        const params = new URLSearchParams(window.location.search)
        idMusica = params.get("id")

        s.getTrack(idMusica).then(
            function (data) {
                console.log(data);

                idArtista = data.artists[0].id;
                idAlbum = data.album.id;
                
                s.getArtist(idArtista).then(
                    function (data) {
                        console.log(data);
                        printArtistData(data);
                    },
                    function (err) {
                        console.error(err);
                    }
                )
                
                s.getAlbumTracks(idAlbum).then(
                    function (data) {
                        console.log(data);
                        printAlbumData(data);
                    },
                    function (err) {
                        console.error(err);
                    }
                )

                printSongData(data);
            },
            function (err) {
                 console.error(err);
            }
        )

        s.getAudioFeaturesForTrack(idMusica).then(
            function (data) {
                console.log(data);
                printAudioFeaturesTrack(data);
            },
            function (err) {
                console.error(err);
            }
        )
        
    
    })();
    
}