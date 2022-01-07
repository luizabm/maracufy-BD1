(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        // field.appendChild(song);
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

        // getAlbumTracks()
        // getArtistRelatedArtists()
        // getAudioFeaturesForTrack()
        //let idMusica = new URL(document.URL).hash
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
                /*
                let fieldAlbum = document.getElementById("conteudo-album")
                fieldAlbum.innerHTML += '<iframe src="https://open.spotify.com/embed/album/' + idAlbum + '" width="100%" height="300" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
                */

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
},{"spotify-web-api-js":2}],2:[function(require,module,exports){
/* global module */
'use strict';

/**
 * Class representing the API
 */
var SpotifyWebApi = (function () {
  var _baseUri = 'https://api.spotify.com/v1';
  var _accessToken = null;
  var _promiseImplementation = null;

  var WrapPromiseWithAbort = function (promise, onAbort) {
    promise.abort = onAbort;
    return promise;
  };

  var _promiseProvider = function (promiseFunction, onAbort) {
    var returnedPromise;
    if (_promiseImplementation !== null) {
      var deferred = _promiseImplementation.defer();
      promiseFunction(
        function (resolvedResult) {
          deferred.resolve(resolvedResult);
        },
        function (rejectedResult) {
          deferred.reject(rejectedResult);
        }
      );
      returnedPromise = deferred.promise;
    } else {
      if (window.Promise) {
        returnedPromise = new window.Promise(promiseFunction);
      }
    }

    if (returnedPromise) {
      return new WrapPromiseWithAbort(returnedPromise, onAbort);
    } else {
      return null;
    }
  };

  var _extend = function () {
    var args = Array.prototype.slice.call(arguments);
    var target = args[0];
    var objects = args.slice(1);
    target = target || {};
    objects.forEach(function (object) {
      for (var j in object) {
        if (object.hasOwnProperty(j)) {
          target[j] = object[j];
        }
      }
    });
    return target;
  };

  var _buildUrl = function (url, parameters) {
    var qs = '';
    for (var key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        var value = parameters[key];
        qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
      }
    }
    if (qs.length > 0) {
      // chop off last '&'
      qs = qs.substring(0, qs.length - 1);
      url = url + '?' + qs;
    }
    return url;
  };

  var _performRequest = function (requestData, callback) {
    var req = new XMLHttpRequest();

    var promiseFunction = function (resolve, reject) {
      function success(data) {
        if (resolve) {
          resolve(data);
        }
        if (callback) {
          callback(null, data);
        }
      }

      function failure() {
        if (reject) {
          reject(req);
        }
        if (callback) {
          callback(req, null);
        }
      }

      var type = requestData.type || 'GET';
      req.open(type, _buildUrl(requestData.url, requestData.params));
      if (_accessToken) {
        req.setRequestHeader('Authorization', 'Bearer ' + _accessToken);
      }

      req.onreadystatechange = function () {
        if (req.readyState === 4) {
          var data = null;
          try {
            data = req.responseText ? JSON.parse(req.responseText) : '';
          } catch (e) {
            console.error(e);
          }

          if (req.status >= 200 && req.status < 300) {
            success(data);
          } else {
            failure();
          }
        }
      };

      if (type === 'GET') {
        req.send(null);
      } else {
        var postData = null;
        if (requestData.postData) {
          if (requestData.contentType === 'image/jpeg') {
            postData = requestData.postData;
            req.setRequestHeader('Content-Type', requestData.contentType);
          } else {
            postData = JSON.stringify(requestData.postData);
            req.setRequestHeader('Content-Type', 'application/json');
          }
        }
        req.send(postData);
      }
    };

    if (callback) {
      promiseFunction();
      return null;
    } else {
      return _promiseProvider(promiseFunction, function () {
        req.abort();
      });
    }
  };

  var _checkParamsAndPerformRequest = function (
    requestData,
    options,
    callback,
    optionsAlwaysExtendParams
  ) {
    var opt = {};
    var cb = null;

    if (typeof options === 'object') {
      opt = options;
      cb = callback;
    } else if (typeof options === 'function') {
      cb = options;
    }

    // options extend postData, if any. Otherwise they extend parameters sent in the url
    var type = requestData.type || 'GET';
    if (type !== 'GET' && requestData.postData && !optionsAlwaysExtendParams) {
      requestData.postData = _extend(requestData.postData, opt);
    } else {
      requestData.params = _extend(requestData.params, opt);
    }
    return _performRequest(requestData, cb);
  };

  /**
   * Creates an instance of the wrapper
   * @constructor
   */
  var Constr = function () {};

  Constr.prototype = {
    constructor: SpotifyWebApi
  };

  /**
   * Fetches a resource through a generic GET request.
   *
   * @param {string} url The URL to be fetched
   * @param {function(Object,Object)} callback An optional callback
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getGeneric = function (url, callback) {
    var requestData = {
      url: url
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Fetches information about the current user.
   * See [Get Current User's Profile](https://developer.spotify.com/web-api/get-current-users-profile/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMe = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches current user's saved tracks.
   * See [Get Current User's Saved Tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMySavedTracks = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Adds a list of tracks to the current user's saved tracks.
   * See [Save Tracks for Current User](https://developer.spotify.com/web-api/save-tracks-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addToMySavedTracks = function (trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks',
      type: 'PUT',
      postData: trackIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove a list of tracks from the current user's saved tracks.
   * See [Remove Tracks for Current User](https://developer.spotify.com/web-api/remove-tracks-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeFromMySavedTracks = function (
    trackIds,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/me/tracks',
      type: 'DELETE',
      postData: trackIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Checks if the current user's saved tracks contains a certain list of tracks.
   * See [Check Current User's Saved Tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.containsMySavedTracks = function (
    trackIds,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/me/tracks/contains',
      params: { ids: trackIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a list of the albums saved in the current Spotify user's "Your Music" library.
   * See [Get Current User's Saved Albums](https://developer.spotify.com/web-api/get-users-saved-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMySavedAlbums = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Save one or more albums to the current user's "Your Music" library.
   * See [Save Albums for Current User](https://developer.spotify.com/web-api/save-albums-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addToMySavedAlbums = function (albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums',
      type: 'PUT',
      postData: albumIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove one or more albums from the current user's "Your Music" library.
   * See [Remove Albums for Current User](https://developer.spotify.com/web-api/remove-albums-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeFromMySavedAlbums = function (
    albumIds,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/me/albums',
      type: 'DELETE',
      postData: albumIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Check if one or more albums is already saved in the current Spotify user's "Your Music" library.
   * See [Check User's Saved Albums](https://developer.spotify.com/web-api/check-users-saved-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.containsMySavedAlbums = function (
    albumIds,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/me/albums/contains',
      params: { ids: albumIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get the current user’s top artists based on calculated affinity.
   * See [Get a User’s Top Artists](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyTopArtists = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me/top/artists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get the current user’s top tracks based on calculated affinity.
   * See [Get a User’s Top Tracks](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyTopTracks = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me/top/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get tracks from the current user’s recently played tracks.
   * See [Get Current User’s Recently Played Tracks](https://developer.spotify.com/web-api/web-api-personalization-endpoints/get-recently-played/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyRecentlyPlayedTracks = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me/player/recently-played'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Adds the current user as a follower of one or more other Spotify users.
   * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.followUsers = function (userIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'PUT',
      params: {
        ids: userIds.join(','),
        type: 'user'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Adds the current user as a follower of one or more artists.
   * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.followArtists = function (artistIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'PUT',
      params: {
        ids: artistIds.join(','),
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Add the current user as a follower of one playlist.
   * See [Follow a Playlist](https://developer.spotify.com/web-api/follow-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} options A JSON object with options that can be passed. For instance,
   * whether you want the playlist to be followed privately ({public: false})
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.followPlaylist = function (playlistId, options, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/followers',
      type: 'PUT',
      postData: {}
    };

    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Removes the current user as a follower of one or more other Spotify users.
   * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.unfollowUsers = function (userIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'DELETE',
      params: {
        ids: userIds.join(','),
        type: 'user'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Removes the current user as a follower of one or more artists.
   * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.unfollowArtists = function (artistIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'DELETE',
      params: {
        ids: artistIds.join(','),
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Remove the current user as a follower of one playlist.
   * See [Unfollow a Playlist](https://developer.spotify.com/web-api/unfollow-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.unfollowPlaylist = function (playlistId, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/followers',
      type: 'DELETE'
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Checks to see if the current user is following one or more other Spotify users.
   * See [Check if Current User Follows Users or Artists](https://developer.spotify.com/web-api/check-current-user-follows/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an array of boolean values that indicate
   * whether the user is following the users sent in the request.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.isFollowingUsers = function (userIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/contains',
      type: 'GET',
      params: {
        ids: userIds.join(','),
        type: 'user'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Checks to see if the current user is following one or more artists.
   * See [Check if Current User Follows](https://developer.spotify.com/web-api/check-current-user-follows/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an array of boolean values that indicate
   * whether the user is following the artists sent in the request.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.isFollowingArtists = function (artistIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/contains',
      type: 'GET',
      params: {
        ids: artistIds.join(','),
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Check to see if one or more Spotify users are following a specified playlist.
   * See [Check if Users Follow a Playlist](https://developer.spotify.com/web-api/check-user-following-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an array of boolean values that indicate
   * whether the users are following the playlist sent in the request.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.areFollowingPlaylist = function (
    playlistId,
    userIds,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/followers/contains',
      type: 'GET',
      params: {
        ids: userIds.join(',')
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Get the current user's followed artists.
   * See [Get User's Followed Artists](https://developer.spotify.com/web-api/get-followed-artists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} [options] Options, being after and limit.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an object with a paged object containing
   * artists.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object which contains
   * artists objects. Not returned if a callback is given.
   */
  Constr.prototype.getFollowedArtists = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me/following',
      type: 'GET',
      params: {
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches information about a specific user.
   * See [Get a User's Profile](https://developer.spotify.com/web-api/get-users-profile/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the id (e.g. spotify:user:<here_is_the_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getUser = function (userId, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId)
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of the current user's playlists.
   * See [Get a List of a User's Playlists](https://developer.spotify.com/web-api/get-list-users-playlists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId An optional id of the user. If you know the Spotify URI it is easy
   * to find the id (e.g. spotify:user:<here_is_the_id>). If not provided, the id of the user that granted
   * the permissions will be used.
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getUserPlaylists = function (userId, options, callback) {
    var requestData;
    if (typeof userId === 'string') {
      requestData = {
        url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists'
      };
    } else {
      requestData = {
        url: _baseUri + '/me/playlists'
      };
      callback = options;
      options = userId;
    }
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a specific playlist.
   * See [Get a Playlist](https://developer.spotify.com/web-api/get-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getPlaylist = function (playlistId, options, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the tracks from a specific playlist.
   * See [Get a Playlist's Tracks](https://developer.spotify.com/web-api/get-playlists-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getPlaylistTracks = function (
    playlistId,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Gets the current image associated with a specific playlist.
   * See [Get a Playlist Cover Image](https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist-cover/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:playlist:<here_is_the_playlist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getPlaylistCoverImage = function (playlistId, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/images'
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Creates a playlist and stores it in the current user's library.
   * See [Create a Playlist](https://developer.spotify.com/web-api/create-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the id (e.g. spotify:user:<here_is_the_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.createPlaylist = function (userId, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists',
      type: 'POST',
      postData: options
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Change a playlist's name and public/private state
   * See [Change a Playlist's Details](https://developer.spotify.com/web-api/change-playlist-details/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} data A JSON object with the data to update. E.g. {name: 'A new name', public: true}
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.changePlaylistDetails = function (
    playlistId,
    data,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId,
      type: 'PUT',
      postData: data
    };
    return _checkParamsAndPerformRequest(requestData, data, callback);
  };

  /**
   * Add tracks to a playlist.
   * See [Add Tracks to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<string>} uris An array of Spotify URIs for the tracks
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addTracksToPlaylist = function (
    playlistId,
    uris,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'POST',
      postData: {
        uris: uris
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback, true);
  };

  /**
   * Replace the tracks of a playlist
   * See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<string>} uris An array of Spotify URIs for the tracks
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.replaceTracksInPlaylist = function (
    playlistId,
    uris,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'PUT',
      postData: { uris: uris }
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Reorder tracks in a playlist
   * See [Reorder a Playlist’s Tracks](https://developer.spotify.com/web-api/reorder-playlists-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {number} rangeStart The position of the first track to be reordered.
   * @param {number} insertBefore The position where the tracks should be inserted. To reorder the tracks to
   * the end of the playlist, simply set insert_before to the position after the last track.
   * @param {Object} options An object with optional parameters (range_length, snapshot_id)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.reorderTracksInPlaylist = function (
    playlistId,
    rangeStart,
    insertBefore,
    options,
    callback
  ) {
    /* eslint-disable camelcase */
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'PUT',
      postData: {
        range_start: rangeStart,
        insert_before: insertBefore
      }
    };
    /* eslint-enable camelcase */
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove tracks from a playlist
   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
   * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
   * string) and `positions` (which is an array of integers).
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeTracksFromPlaylist = function (
    playlistId,
    uris,
    callback
  ) {
    var dataToBeSent = uris.map(function (uri) {
      if (typeof uri === 'string') {
        return { uri: uri };
      } else {
        return uri;
      }
    });

    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'DELETE',
      postData: { tracks: dataToBeSent }
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Remove tracks from a playlist, specifying a snapshot id.
   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
   * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
   * string) and `positions` (which is an array of integers).
   * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeTracksFromPlaylistWithSnapshotId = function (
    playlistId,
    uris,
    snapshotId,
    callback
  ) {
    var dataToBeSent = uris.map(function (uri) {
      if (typeof uri === 'string') {
        return { uri: uri };
      } else {
        return uri;
      }
    });
    /* eslint-disable camelcase */
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'DELETE',
      postData: {
        tracks: dataToBeSent,
        snapshot_id: snapshotId
      }
    };
    /* eslint-enable camelcase */
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Remove tracks from a playlist, specifying the positions of the tracks to be removed.
   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<number>} positions array of integers containing the positions of the tracks to remove
   * from the playlist.
   * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeTracksFromPlaylistInPositions = function (
    playlistId,
    positions,
    snapshotId,
    callback
  ) {
    /* eslint-disable camelcase */
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'DELETE',
      postData: {
        positions: positions,
        snapshot_id: snapshotId
      }
    };
    /* eslint-enable camelcase */
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Upload a custom playlist cover image.
   * See [Upload A Custom Playlist Cover Image](https://developer.spotify.com/web-api/upload-a-custom-playlist-cover-image/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {string} imageData Base64 encoded JPEG image data, maximum payload size is 256 KB.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.uploadCustomPlaylistCoverImage = function (
    playlistId,
    imageData,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/images',
      type: 'PUT',
      postData: imageData.replace(/^data:image\/jpeg;base64,/, ''),
      contentType: 'image/jpeg'
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Fetches an album from the Spotify catalog.
   * See [Get an Album](https://developer.spotify.com/web-api/get-album/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
   * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAlbum = function (albumId, options, callback) {
    var requestData = {
      url: _baseUri + '/albums/' + albumId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the tracks of an album from the Spotify catalog.
   * See [Get an Album's Tracks](https://developer.spotify.com/web-api/get-albums-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
   * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAlbumTracks = function (albumId, options, callback) {
    var requestData = {
      url: _baseUri + '/albums/' + albumId + '/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple albums from the Spotify catalog.
   * See [Get Several Albums](https://developer.spotify.com/web-api/get-several-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAlbums = function (albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/albums/',
      params: { ids: albumIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a track from the Spotify catalog.
   * See [Get a Track](https://developer.spotify.com/web-api/get-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getTrack = function (trackId, options, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/tracks/' + trackId;
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple tracks from the Spotify catalog.
   * See [Get Several Tracks](https://developer.spotify.com/web-api/get-several-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getTracks = function (trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/tracks/',
      params: { ids: trackIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches an artist from the Spotify catalog.
   * See [Get an Artist](https://developer.spotify.com/web-api/get-artist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtist = function (artistId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple artists from the Spotify catalog.
   * See [Get Several Artists](https://developer.spotify.com/web-api/get-several-artists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtists = function (artistIds, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/',
      params: { ids: artistIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the albums of an artist from the Spotify catalog.
   * See [Get an Artist's Albums](https://developer.spotify.com/web-api/get-artists-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtistAlbums = function (artistId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/albums'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of top tracks of an artist from the Spotify catalog, for a specific country.
   * See [Get an Artist's Top Tracks](https://developer.spotify.com/web-api/get-artists-top-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {string} countryId The id of the country (e.g. ES for Spain or US for United States)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtistTopTracks = function (
    artistId,
    countryId,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/top-tracks',
      params: { country: countryId }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of artists related with a given one from the Spotify catalog.
   * See [Get an Artist's Related Artists](https://developer.spotify.com/web-api/get-related-artists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtistRelatedArtists = function (
    artistId,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/related-artists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of Spotify featured playlists (shown, for example, on a Spotify player's "Browse" tab).
   * See [Get a List of Featured Playlists](https://developer.spotify.com/web-api/get-list-featured-playlists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getFeaturedPlaylists = function (options, callback) {
    var requestData = {
      url: _baseUri + '/browse/featured-playlists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
   * See [Get a List of New Releases](https://developer.spotify.com/web-api/get-list-new-releases/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getNewReleases = function (options, callback) {
    var requestData = {
      url: _baseUri + '/browse/new-releases'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
   * See [Get a List of Categories](https://developer.spotify.com/web-api/get-list-categories/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getCategories = function (options, callback) {
    var requestData = {
      url: _baseUri + '/browse/categories'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
   * See [Get a Category](https://developer.spotify.com/web-api/get-category/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} categoryId The id of the category. These can be found with the getCategories function
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getCategory = function (categoryId, options, callback) {
    var requestData = {
      url: _baseUri + '/browse/categories/' + categoryId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a list of Spotify playlists tagged with a particular category.
   * See [Get a Category's Playlists](https://developer.spotify.com/web-api/get-categorys-playlists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} categoryId The id of the category. These can be found with the getCategories function
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getCategoryPlaylists = function (
    categoryId,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/browse/categories/' + categoryId + '/playlists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get Spotify catalog information about artists, albums, tracks or playlists that match a keyword string.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Array<string>} types An array of item types to search across.
   * Valid types are: 'album', 'artist', 'playlist', and 'track'.
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.search = function (query, types, options, callback) {
    var requestData = {
      url: _baseUri + '/search/',
      params: {
        q: query,
        type: types.join(',')
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches albums from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchAlbums = function (query, options, callback) {
    return this.search(query, ['album'], options, callback);
  };

  /**
   * Fetches artists from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchArtists = function (query, options, callback) {
    return this.search(query, ['artist'], options, callback);
  };

  /**
   * Fetches tracks from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchTracks = function (query, options, callback) {
    return this.search(query, ['track'], options, callback);
  };

  /**
   * Fetches playlists from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchPlaylists = function (query, options, callback) {
    return this.search(query, ['playlist'], options, callback);
  };

  /**
   * Fetches shows from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchShows = function (query, options, callback) {
    return this.search(query, ['show'], options, callback);
  };

  /**
   * Fetches episodes from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchEpisodes = function (query, options, callback) {
    return this.search(query, ['episode'], options, callback);
  };

  /**
   * Get audio features for a single track identified by its unique Spotify ID.
   * See [Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioFeaturesForTrack = function (trackId, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/audio-features/' + trackId;
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get audio features for multiple tracks based on their Spotify IDs.
   * See [Get Audio Features for Several Tracks](https://developer.spotify.com/web-api/get-several-audio-features/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioFeaturesForTracks = function (trackIds, callback) {
    var requestData = {
      url: _baseUri + '/audio-features',
      params: { ids: trackIds }
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get audio analysis for a single track identified by its unique Spotify ID.
   * See [Get Audio Analysis for a Track](https://developer.spotify.com/web-api/get-audio-analysis/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioAnalysisForTrack = function (trackId, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/audio-analysis/' + trackId;
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Create a playlist-style listening experience based on seed artists, tracks and genres.
   * See [Get Recommendations Based on Seeds](https://developer.spotify.com/web-api/get-recommendations/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getRecommendations = function (options, callback) {
    var requestData = {
      url: _baseUri + '/recommendations'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Retrieve a list of available genres seed parameter values for recommendations.
   * See [Available Genre Seeds](https://developer.spotify.com/web-api/get-recommendations/#available-genre-seeds) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAvailableGenreSeeds = function (callback) {
    var requestData = {
      url: _baseUri + '/recommendations/available-genre-seeds'
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get information about a user’s available devices.
   * See [Get a User’s Available Devices](https://developer.spotify.com/web-api/get-a-users-available-devices/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyDevices = function (callback) {
    var requestData = {
      url: _baseUri + '/me/player/devices'
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get information about the user’s current playback state, including track, track progress, and active device.
   * See [Get Information About The User’s Current Playback](https://developer.spotify.com/web-api/get-information-about-the-users-current-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyCurrentPlaybackState = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me/player'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get the object currently being played on the user’s Spotify account.
   * See [Get the User’s Currently Playing Track](https://developer.spotify.com/web-api/get-the-users-currently-playing-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyCurrentPlayingTrack = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me/player/currently-playing'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Transfer playback to a new device and determine if it should start playing.
   * See [Transfer a User’s Playback](https://developer.spotify.com/web-api/transfer-a-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} deviceIds A JSON array containing the ID of the device on which playback should be started/transferred.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.transferMyPlayback = function (
    deviceIds,
    options,
    callback
  ) {
    var postData = options || {};
    postData.device_ids = deviceIds;
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player',
      postData: postData
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Play a track on the user's active device
   * See [Start/Resume a User's Playback](https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.play = function (options, callback) {
    options = options || {};
    var params =
      'device_id' in options ? { device_id: options.device_id } : null;
    var postData = {};
    ['context_uri', 'uris', 'offset', 'position_ms'].forEach(function (field) {
      if (field in options) {
        postData[field] = options[field];
      }
    });
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/play',
      params: params,
      postData: postData
    };

    // need to clear options so it doesn't add all of them to the query params
    var newOptions = typeof options === 'function' ? options : {};
    return _checkParamsAndPerformRequest(requestData, newOptions, callback);
  };

  /**
   * Add an item to the end of the user’s current playback queue.
   * See [Add an Item to the User's Playback Queue](https://developer.spotify.com/documentation/web-api/reference/player/add-to-queue/) on
   * the Spotify Developer site for more information about the endpoint.
   * @param {string} uri The uri of the item to add to the queue. Must be a track or an episode uri.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.queue = function (uri, options, callback) {
    options = options || {};
    var params =
      'device_id' in options
        ? { uri: uri, device_id: options.device_id }
        : { uri: uri };
    var requestData = {
      type: 'POST',
      url: _baseUri + '/me/player/queue',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Pause playback on the user’s account.
   * See [Pause a User’s Playback](https://developer.spotify.com/web-api/pause-a-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.pause = function (options, callback) {
    options = options || {};
    var params =
      'device_id' in options ? { device_id: options.device_id } : null;
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/pause',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Skips to next track in the user’s queue.
   * See [Skip User’s Playback To Next Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.skipToNext = function (options, callback) {
    options = options || {};
    var params =
      'device_id' in options ? { device_id: options.device_id } : null;
    var requestData = {
      type: 'POST',
      url: _baseUri + '/me/player/next',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Skips to previous track in the user’s queue.
   * Note that this will ALWAYS skip to the previous track, regardless of the current track’s progress.
   * Returning to the start of the current track should be performed using `.seek()`
   * See [Skip User’s Playback To Previous Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.skipToPrevious = function (options, callback) {
    options = options || {};
    var params =
      'device_id' in options ? { device_id: options.device_id } : null;
    var requestData = {
      type: 'POST',
      url: _baseUri + '/me/player/previous',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Seeks to the given position in the user’s currently playing track.
   * See [Seek To Position In Currently Playing Track](https://developer.spotify.com/web-api/seek-to-position-in-currently-playing-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {number} position_ms The position in milliseconds to seek to. Must be a positive number.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.seek = function (position_ms, options, callback) {
    options = options || {};
    var params = {
      position_ms: position_ms
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/seek',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Set the repeat mode for the user’s playback. Options are repeat-track, repeat-context, and off.
   * See [Set Repeat Mode On User’s Playback](https://developer.spotify.com/web-api/set-repeat-mode-on-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {String} state A string set to 'track', 'context' or 'off'.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.setRepeat = function (state, options, callback) {
    options = options || {};
    var params = {
      state: state
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/repeat',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Set the volume for the user’s current playback device.
   * See [Set Volume For User’s Playback](https://developer.spotify.com/web-api/set-volume-for-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {number} volume_percent The volume to set. Must be a value from 0 to 100 inclusive.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.setVolume = function (volume_percent, options, callback) {
    options = options || {};
    var params = {
      volume_percent: volume_percent
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/volume',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Toggle shuffle on or off for user’s playback.
   * See [Toggle Shuffle For User’s Playback](https://developer.spotify.com/web-api/toggle-shuffle-for-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {bool} state Whether or not to shuffle user's playback.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.setShuffle = function (state, options, callback) {
    options = options || {};
    var params = {
      state: state
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/shuffle',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a show from the Spotify catalog.
   * See [Get a Show](https://developer.spotify.com/documentation/web-api/reference/shows/get-a-show/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} showId The id of the show. If you know the Spotify URI it is easy
   * to find the show id (e.g. spotify:show:<here_is_the_show_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getShow = function (showId, options, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/shows/' + showId;
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple shows from the Spotify catalog.
   * See [Get Several Shows](https://developer.spotify.com/documentation/web-api/reference/shows/get-several-shows/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} showIds The ids of the shows. If you know their Spotify URI it is easy
   * to find their show id (e.g. spotify:show:<here_is_the_show_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getShows = function (showIds, options, callback) {
    var requestData = {
      url: _baseUri + '/shows/',
      params: { ids: showIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches current user's saved shows.
   * See [Get Current User's Saved Shows](https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-shows/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMySavedShows = function (options, callback) {
    var requestData = {
      url: _baseUri + '/me/shows'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Adds a list of shows to the current user's saved shows.
   * See [Save Shows for Current User](https://developer.spotify.com/documentation/web-api/reference/library/save-shows-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} showIds The ids of the shows. If you know their Spotify URI it is easy
   * to find their show id (e.g. spotify:show:<here_is_the_show_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addToMySavedShows = function (showIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/shows',
      type: 'PUT',
      postData: showIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove a list of shows from the current user's saved shows.
   * See [Remove Shows for Current User](https://developer.spotify.com/documentation/web-api/reference/library/remove-shows-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} showIds The ids of the shows. If you know their Spotify URI it is easy
   * to find their show id (e.g. spotify:show:<here_is_the_show_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeFromMySavedShows = function (
    showIds,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/me/shows',
      type: 'DELETE',
      postData: showIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Checks if the current user's saved shows contains a certain list of shows.
   * See [Check Current User's Saved Shows](https://developer.spotify.com/documentation/web-api/reference/library/check-users-saved-shows/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} showIds The ids of the shows. If you know their Spotify URI it is easy
   * to find their show id (e.g. spotify:show:<here_is_the_show_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.containsMySavedShows = function (
    showIds,
    options,
    callback
  ) {
    var requestData = {
      url: _baseUri + '/me/shows/contains',
      params: { ids: showIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the episodes of a show from the Spotify catalog.
   * See [Get a Show's Episodes](https://developer.spotify.com/documentation/web-api/reference/shows/get-shows-episodes/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} showId The id of the show. If you know the Spotify URI it is easy
   * to find the show id (e.g. spotify:show:<here_is_the_show_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getShowEpisodes = function (showId, options, callback) {
    var requestData = {
      url: _baseUri + '/shows/' + showId + '/episodes'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches an episode from the Spotify catalog.
   * See [Get an Episode](https://developer.spotify.com/documentation/web-api/reference/episodes/get-an-episode/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} episodeId The id of the episode. If you know the Spotify URI it is easy
   * to find the episode id (e.g. spotify:episode:<here_is_the_episode_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getEpisode = function (episodeId, options, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/episodes/' + episodeId;
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple episodes from the Spotify catalog.
   * See [Get Several Episodes](https://developer.spotify.com/documentation/web-api/reference/episodes/get-several-episodes/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} episodeIds The ids of the episodes. If you know their Spotify URI it is easy
   * to find their episode id (e.g. spotify:episode:<here_is_the_episode_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getEpisodes = function (episodeIds, options, callback) {
    var requestData = {
      url: _baseUri + '/episodes/',
      params: { ids: episodeIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Gets the access token in use.
   *
   * @return {string} accessToken The access token
   */
  Constr.prototype.getAccessToken = function () {
    return _accessToken;
  };

  /**
   * Sets the access token to be used.
   * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on
   * the Spotify Developer site for more information about obtaining an access token.
   *
   * @param {string} accessToken The access token
   * @return {void}
   */
  Constr.prototype.setAccessToken = function (accessToken) {
    _accessToken = accessToken;
  };

  /**
   * Sets an implementation of Promises/A+ to be used. E.g. Q, when.
   * See [Conformant Implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)
   * for a list of some available options
   *
   * @param {Object} PromiseImplementation A Promises/A+ valid implementation
   * @throws {Error} If the implementation being set doesn't conform with Promises/A+
   * @return {void}
   */
  Constr.prototype.setPromiseImplementation = function (PromiseImplementation) {
    var valid = false;
    try {
      var p = new PromiseImplementation(function (resolve) {
        resolve();
      });
      if (typeof p.then === 'function' && typeof p.catch === 'function') {
        valid = true;
      }
    } catch (e) {
      console.error(e);
    }
    if (valid) {
      _promiseImplementation = PromiseImplementation;
    } else {
      throw new Error('Unsupported implementation of Promises/A+');
    }
  };

  return Constr;
})();

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = SpotifyWebApi;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1JhcGhhZWwvQXBwRGF0YS9Sb2FtaW5nL25wbS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvc2NyaXB0LmpzIiwibm9kZV9tb2R1bGVzL3Nwb3RpZnktd2ViLWFwaS1qcy9zcmMvc3BvdGlmeS13ZWItYXBpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2htQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBTcG90aWZ5ID0gcmVxdWlyZSgnc3BvdGlmeS13ZWItYXBpLWpzJyk7XHJcbmNvbnN0IHMgPSBuZXcgU3BvdGlmeSgpO1xyXG5cclxuaWYoJChcImJvZHkjaW5kZXhcIikubGVuZ3RoID4gMCkge1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICBmdW5jdGlvbiBsb2dpbihjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBDTElFTlRfSUQgPSAnMmRhYTZjMDFmZTdmNGE0NTg4OTkxOTQyNTc1ZTMxYjMnO1xyXG4gICAgICAgIHZhciBSRURJUkVDVF9VUkkgPSAnaHR0cHM6Ly9tYXJhY3VmeS5oZXJva3VhcHAuY29tL2J1c2NhJztcclxuICAgICAgICBmdW5jdGlvbiBnZXRMb2dpblVSTChzY29wZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdodHRwczovL2FjY291bnRzLnNwb3RpZnkuY29tL2F1dGhvcml6ZT9jbGllbnRfaWQ9JyArIENMSUVOVF9JRCArXHJcbiAgICAgICAgICAgICAgJyZyZWRpcmVjdF91cmk9JyArIGVuY29kZVVSSUNvbXBvbmVudChSRURJUkVDVF9VUkkpICtcclxuICAgICAgICAgICAgICAnJnNjb3BlPScgKyBlbmNvZGVVUklDb21wb25lbnQoc2NvcGVzLmpvaW4oJyAnKSkgK1xyXG4gICAgICAgICAgICAgICcmcmVzcG9uc2VfdHlwZT10b2tlbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB1cmwgPSBnZXRMb2dpblVSTChbXHJcbiAgICAgICAgICAgICd1c2VyLXJlYWQtZW1haWwnLFxyXG4gICAgICAgICAgICAndXNlci1yZWFkLXByaXZhdGUnLFxyXG4gICAgICAgICAgICAncGxheWxpc3QtbW9kaWZ5LXByaXZhdGUnLFxyXG4gICAgICAgICAgICAndXNlci1yZWFkLXJlY2VudGx5LXBsYXllZCcsXHJcbiAgICAgICAgICAgICd1c2VyLXRvcC1yZWFkJ1xyXG4gICAgICAgIF0pO1xyXG4gICAgXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgdmFyIGhhc2ggPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoaGFzaC50eXBlID09ICdhY2Nlc3NfdG9rZW4nKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhoYXNoLmFjY2Vzc190b2tlbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHcgPSB3aW5kb3cub3Blbih1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnX3NlbGYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1Nwb3RpZnknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlckRhdGEoYWNjZXNzVG9rZW4pIHtcclxuICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkuc3BvdGlmeS5jb20vdjEvbWUnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgYWNjZXNzVG9rZW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsb2dpbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG4tbG9naW4nKTtcclxuICAgIFxyXG4gICAgbG9naW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsb2dpbihmdW5jdGlvbihhY2Nlc3NUb2tlbikge1xyXG4gICAgICAgICAgICBnZXRVc2VyRGF0YShhY2Nlc3NUb2tlbilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9naW5CdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pKCk7XHJcbn1cclxuXHJcbmlmKCQoXCJib2R5I2J1c2NhXCIpLmxlbmd0aCA+IDApIHtcclxuICBcclxuKGFzeW5jIGZ1bmN0aW9uIFF1YW5kb0NhcnJlZ2EoKSB7XHJcbiAgICBsZXQgaGFzaGNvbnRlbnQgPSBuZXcgVVJMKGRvY3VtZW50LlVSTCkuaGFzaFxyXG4gICAgaWYoaGFzaGNvbnRlbnQubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICBsZXQgYXV4ID0gaGFzaGNvbnRlbnQuc3BsaXQoXCJhY2Nlc3NfdG9rZW49XCIpWzFdXHJcbiAgICAgICAgbGV0IHRva2VuID0gYXV4LnNwbGl0KFwiJlwiKVswXVxyXG4gICAgICAgIHMuc2V0QWNjZXNzVG9rZW4odG9rZW4pO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWNjZXNzLXRva2VuJyx0b2tlbik7XHJcbiAgICAgICAgbGV0IGlkdSA9IGF3YWl0IHMuZ2V0TWUoKVxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGBodHRwczovL21hcmFjdWZ5Lmhlcm9rdWFwcC5jb20vYnVzY2EvP2lkPSR7aWR1LmlkfWApXHJcbiAgICB9XHJcbiAgICBlbHNleyAgIFxyXG4gICAgICAgIGxldCB0b2tlbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjZXNzLXRva2VuJyk7XHJcbiAgICAgICAgaWYodG9rZW4gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydChcIsOJIG5lY2Vzc8OhcmlvIGVzdGFyIGxvZ2FkbyBubyBzcG90aWZ5IHBhcmEgdXRpbGl6YXIgbyBNYXJhY3VmeVwiKVxyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgnaHR0cHM6Ly9tYXJhY3VmeS5oZXJva3VhcHAuY29tLycpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHMuc2V0QWNjZXNzVG9rZW4odG9rZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gcHJpbnRWYWx1ZXMoZGF0YSlcclxue1xyXG4gICAgbGV0IGZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZXVkby1idXNjYVwiKVxyXG4gICAgZmllbGQuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpPGRhdGEudHJhY2tzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIGBodHRwczovL21hcmFjdWZ5Lmhlcm9rdWFwcC5jb20vbXVzaWNhLz9pZD0ke2RhdGEudHJhY2tzLml0ZW1zW2ldLmlkfWApO1xyXG4gICAgICAgIGxpbmsuY2xhc3NOYW1lID0gJ211c2ljYS1saW5rJztcclxuXHJcbiAgICAgICAgdmFyIHNvbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNvbmcuY2xhc3NOYW1lID0gJ211c2ljYSc7XHJcblxyXG4gICAgICAgIHNvbmcuaW5uZXJIVE1MICs9ICc8aW1nIGNsYXNzPVwibXVzaWNhLWNhcGFcIiBzcmM9JyArIGAke2RhdGEudHJhY2tzLml0ZW1zW2ldLmFsYnVtLmltYWdlc1syXS51cmx9YCArICc+PFxcaW1nPidcclxuICAgICAgICBzb25nLmlubmVySFRNTCArPSAnPHAgY2xhc3M9XCJtdXNpY2Etbm9tZVwiPicgKyBgJHtkYXRhLnRyYWNrcy5pdGVtc1tpXS5uYW1lfWAgKyAnPFxccD4nO1xyXG4gICAgICAgIHNvbmcuaW5uZXJIVE1MICs9ICc8cCBjbGFzcz1cIm11c2ljYS1hcnRpc3RhXCI+JyArIGAke2RhdGEudHJhY2tzLml0ZW1zW2ldLmFydGlzdHNbMF0ubmFtZX1gICsgJzxcXHA+JztcclxuXHJcbiAgICAgICAgbGluay5hcHBlbmRDaGlsZChzb25nKTtcclxuICAgICAgICAvLyBmaWVsZC5hcHBlbmRDaGlsZChzb25nKTtcclxuICAgICAgICBmaWVsZC5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIH0gXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVJlc3VsdChxdWVyeSkge1xyXG4gICAgICAgIHMuc2VhcmNoVHJhY2tzKHF1ZXJ5LCB7bGltaXQ6IDMwfSkudGhlbihcclxuICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgIHByaW50VmFsdWVzKGRhdGEpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICApO1xyXG59XHJcblxyXG5jb25zdCBiYXJyYWJ1c2NhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYXJyYWRlYnVzY2FcIik7XHJcbmJhcnJhYnVzY2EuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbigpe3VwZGF0ZVJlc3VsdChiYXJyYWJ1c2NhLnZhbHVlKX0pO1xyXG5cclxufVxyXG5cclxuaWYoJChcImJvZHkjcGVyZmlsXCIpLmxlbmd0aCA+IDApIHtcclxuICAgIFxyXG5jb25zdCBzb25nc1Nob3J0VGVybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZ3Mtc2hvcnR0ZXJtXCIpO1xyXG5sZXQgbGlzdFNvbmdzU2hvcnRUZXJtID0gMDtcclxuXHJcbnNvbmdzU2hvcnRUZXJtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAobGlzdFNvbmdzU2hvcnRUZXJtID09IDApIHtcclxuICAgICAgICBzLmdldE15VG9wVHJhY2tzKHt0aW1lX3JhbmdlOiAnc2hvcnRfdGVybScsbGltaXQ6IDUwfSkudGhlbihcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxpc3RTb25nc1Nob3J0VGVybSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICBwcmludFVzZXJTb25ncyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgZWxzZSBwcmludFVzZXJTb25ncyhsaXN0U29uZ3NTaG9ydFRlcm0pO1xyXG59KTtcclxuXHJcbmNvbnN0IHNvbmdzTWVkaXVtVGVybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZ3MtbWVkaXVtdGVybVwiKTtcclxubGV0IGxpc3RTb25nc01lZGl1bVRlcm0gPSAwO1xyXG5cclxuc29uZ3NNZWRpdW1UZXJtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAobGlzdFNvbmdzTWVkaXVtVGVybSA9PSAwKSB7XHJcbiAgICAgICAgcy5nZXRNeVRvcFRyYWNrcyh7dGltZV9yYW5nZTogJ21lZGl1bV90ZXJtJyxsaW1pdDogNTB9KS50aGVuKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdFNvbmdzTWVkaXVtVGVybSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICBwcmludFVzZXJTb25ncyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgZWxzZSBwcmludFVzZXJTb25ncyhsaXN0U29uZ3NNZWRpdW1UZXJtKTtcclxufSk7XHJcblxyXG5jb25zdCBzb25nc0xvbmdUZXJtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb25ncy1sb25ndGVybVwiKTtcclxubGV0IGxpc3RTb25nc0xvbmdUZXJtID0gMDtcclxuXHJcbnNvbmdzTG9uZ1Rlcm0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGlmIChsaXN0U29uZ3NMb25nVGVybSA9PSAwKSB7XHJcbiAgICAgICAgcy5nZXRNeVRvcFRyYWNrcyh7dGltZV9yYW5nZTogJ2xvbmdfdGVybScsbGltaXQ6IDUwfSkudGhlbihcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxpc3RTb25nc0xvbmdUZXJtID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIHByaW50VXNlclNvbmdzKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBlbHNlIHByaW50VXNlclNvbmdzKGxpc3RTb25nc0xvbmdUZXJtKTtcclxufSk7XHJcblxyXG5jb25zdCBhcnRpc3RzU2hvcnRUZXJtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcnRpc3RzLXNob3J0dGVybVwiKTtcclxubGV0IGxpc3RBcnRpc3RzU2hvcnRUZXJtID0gMDtcclxuXHJcbmFydGlzdHNTaG9ydFRlcm0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGlmIChsaXN0QXJ0aXN0c1Nob3J0VGVybSA9PSAwKSB7XHJcbiAgICAgICAgcy5nZXRNeVRvcEFydGlzdHMoe3RpbWVfcmFuZ2U6ICdzaG9ydF90ZXJtJyxsaW1pdDogMjB9KS50aGVuKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdEFydGlzdHNTaG9ydFRlcm0gPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgcHJpbnRVc2VyQXJ0aXN0cyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgZWxzZSBwcmludFVzZXJBcnRpc3RzKGxpc3RBcnRpc3RzU2hvcnRUZXJtKTtcclxufSk7XHJcblxyXG5jb25zdCBhcnRpc3RzTWVkaXVtVGVybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJ0aXN0cy1tZWRpdW10ZXJtXCIpO1xyXG5sZXQgbGlzdEFydGlzdHNNZWRpdW1UZXJtID0gMDtcclxuXHJcbmFydGlzdHNNZWRpdW1UZXJtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAobGlzdEFydGlzdHNNZWRpdW1UZXJtID09IDApIHtcclxuICAgICAgICBzLmdldE15VG9wQXJ0aXN0cyh7dGltZV9yYW5nZTogJ21lZGl1bV90ZXJtJyxsaW1pdDogMjB9KS50aGVuKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdEFydGlzdHNNZWRpdW1UZXJtID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIHByaW50VXNlckFydGlzdHMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxuICAgIGVsc2UgcHJpbnRVc2VyQXJ0aXN0cyhsaXN0QXJ0aXN0c01lZGl1bVRlcm0pO1xyXG59KTtcclxuXHJcbmNvbnN0IGFydGlzdHNMb25nVGVybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJ0aXN0cy1sb25ndGVybVwiKTtcclxubGV0IGxpc3RBcnRpc3RzTG9uZ1Rlcm0gPSAwO1xyXG5cclxuYXJ0aXN0c0xvbmdUZXJtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAobGlzdEFydGlzdHNMb25nVGVybSA9PSAwKSB7XHJcbiAgICAgICAgcy5nZXRNeVRvcEFydGlzdHMoe3RpbWVfcmFuZ2U6ICdsb25nX3Rlcm0nLGxpbWl0OiAyMH0pLnRoZW4oXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0QXJ0aXN0c0xvbmdUZXJtID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIHByaW50VXNlckFydGlzdHMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxuICAgIGVsc2UgcHJpbnRVc2VyQXJ0aXN0cyhsaXN0QXJ0aXN0c0xvbmdUZXJtKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBwcmludFVzZXIoZGF0YSkge1xyXG4gICAgbGV0IGZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyZGF0YVwiKVxyXG5cclxuICAgIGxldCBkYWRvcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkYWRvcy5jbGFzc05hbWUgPSAnZGFkb3MnO1xyXG5cclxuICAgIGRhZG9zLmlubmVySFRNTCArPSAgJzxkaXYgY2xhc3M9XCJub21lZm90by1wcm9maWxlXCI+PHAgaWQ9XCJkYWRvLW5vbWVcIj4nICsgYCR7ZGF0YS5kaXNwbGF5X25hbWV9YCArICc8L3A+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbWcgaWQ9XCJkYWRvLWZvdG9cIiBzcmM9JyArIGAke2RhdGEuaW1hZ2VzWzBdLnVybH1gICsgJz48L2Rpdj4nXHJcblxyXG4gICAgZGFkb3MuaW5uZXJIVE1MICs9ICAnPGRpdiBjbGFzcz0gXCJyZXN0by1wcm9maWxlXCI+IDxhIGhyZWY9JyArIGAke2RhdGEuZXh0ZXJuYWxfdXJscy5zcG90aWZ5fWAgKyAnIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgaWQ9XCJsb2dvLXNwb3RpZnlcIiBzcmM9XCIuLi9pbWcvc3BvdGlmeS5wbmdcIj48L2ltZz48L2E+IDxwIGlkPVwiZGFkby1wYWlzXCI+UGHDrXM6ICcgKyBgJHtkYXRhLmNvdW50cnl9YCArICc8L3A+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGlkPVwiZGFkby1zZWd1aWRvcmVzXCI+IFNlZ3VpZG9yZXM6ICcgKyBgJHtkYXRhLmZvbGxvd2Vycy50b3RhbH1gICsgJzwvcD4gPC9kaXY+J1xyXG5cclxuICAgIGZpZWxkLmFwcGVuZENoaWxkKGRhZG9zKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByaW50VXNlckFydGlzdHMoZGF0YSkge1xyXG4gICAgbGV0IGZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3BhcnRpc3RzXCIpO1xyXG4gICAgZmllbGQuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICBsZXQgZGFkb3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZGFkb3MuY2xhc3NOYW1lID0gJ2RhZG9zLWFydGlzdGFzJztcclxuXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpPGRhdGEuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgYXJ0aXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBhcnRpc3QuY2xhc3NOYW1lID0gJ2RhZG8tYXJ0aXN0YSc7XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50QXJ0aXN0ID0gaSsxO1xyXG4gICAgICAgIGFydGlzdC5pbm5lckhUTUwgKz0gJzxkaXYgY2xhc3M9XCJkYWRvLWFydGlzdGEtY2lyY3Vsb1wiPjxwIGNsYXNzPVwiZGFkby1hcnRpc3RhLW51bWVyb1wiPicrIGN1cnJlbnRBcnRpc3QgKyAnPC9wPjwvZGl2Pic7XHJcbiAgICAgICAgYXJ0aXN0LmlubmVySFRNTCArPSAnPGltZyBjbGFzcz1cImRhZG8tYXJ0aXN0YS1mb3RvXCIgc3JjPScgKyBgJHtkYXRhLml0ZW1zW2ldLmltYWdlc1syXS51cmx9YCArICc+PC9pbWc+J1xyXG4gICAgICAgIGFydGlzdC5pbm5lckhUTUwgKz0gJzxkaXYgaWQ9XCJkYWRvLWFydGlzdGEtc3BhblwiPjxwIGNsYXNzPVwiZGFkby1hcnRpc3RhLW5vbWVcIj4nICsgYCR7ZGF0YS5pdGVtc1tpXS5uYW1lfWAgKyAnPC9wPjwvZGl2Pic7XHJcblxyXG4gICAgICAgIGZpZWxkLmFwcGVuZENoaWxkKGFydGlzdCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBwcmludFVzZXJTb25ncyhkYXRhKSB7XHJcblxyXG4gICAgbGV0IGZpZWxkMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9wdHJhY2tzXCIpO1xyXG4gICAgZmllbGQyLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgbGV0IGRhZG9zMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkYWRvczIuY2xhc3NOYW1lID0gJ2RhZG9zMic7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaTxkYXRhLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHNvbmdEYXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzb25nRGF0YS5jbGFzc05hbWUgPSAnZGFkby1tdXNpY2EnO1xyXG4gICAgICAgIGxldCBjdXJyZW50U29uZyA9IGkrMTtcclxuICAgICAgICBzb25nRGF0YS5pbm5lckhUTUwgKz0gJzxkaXYgY2xhc3M9XCJkYWRvLW11c2ljYS1jaXJjdWxvXCI+PHAgY2xhc3M9XCJkYWRvLW11c2ljYS1udW1lcm9cIj4nKyBjdXJyZW50U29uZyArICc8L3A+PC9kaXY+JztcclxuICAgICAgICBzb25nRGF0YS5pbm5lckhUTUwgKz0gJzxpbWcgY2xhc3M9XCJkYWRvLW11c2ljYS1jYXBhXCIgc3JjPScgKyBgJHtkYXRhLml0ZW1zW2ldLmFsYnVtLmltYWdlc1syXS51cmx9YCArICc+PC9pbWc+J1xyXG4gICAgICAgIHNvbmdEYXRhLmlubmVySFRNTCArPSAnPGRpdiBpZD1cImRhZG8tbXVzaWNhLXNwYW5cIj48YSBocmVmPWh0dHBzOi8vbWFyYWN1ZnkuaGVyb2t1YXBwLmNvbS9tdXNpY2EvP2lkPScgKyBgJHtkYXRhLml0ZW1zW2ldLmlkfWAgKyAnIHRhcmdldD1cIl9ibGFua1wiPjxwIGNsYXNzPVwiZGFkby1tdXNpY2Etbm9tZVwiPicgKyBgJHtkYXRhLml0ZW1zW2ldLm5hbWV9YCArICc8L3A+PC9hPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJkYWRvLW11c2ljYS1hcnRpc3RhXCI+JyArIGAke2RhdGEuaXRlbXNbaV0uYXJ0aXN0c1swXS5uYW1lfWAgKyAnPC9wPjwvZGl2Pic7XHJcblxyXG4gICAgICAgIGZpZWxkMi5hcHBlbmRDaGlsZChzb25nRGF0YSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4oZnVuY3Rpb24gZ2V0VXNlckRhdGEoKSB7XHJcblxyXG4gICAgbGV0IHRva2VuID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2Nlc3MtdG9rZW4nKTtcclxuICAgIGlmKHRva2VuID09IG51bGwpXHJcbiAgICB7XHJcbiAgICAgICAgd2luZG93LmFsZXJ0KFwiw4kgbmVjZXNzw6FyaW8gZXN0YXIgbG9nYWRvIG5vIHNwb3RpZnkgcGFyYSB1dGlsaXphciBvIE1hcmFjdWZ5XCIpXHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoJ2h0dHBzOi8vbWFyYWN1ZnkuaGVyb2t1YXBwLmNvbS8nKVxyXG4gICAgfVxyXG4gICAgcy5zZXRBY2Nlc3NUb2tlbih0b2tlbik7XHJcbiAgICBjb25zb2xlLmxvZyhzLmdldEFjY2Vzc1Rva2VuKCkpO1xyXG5cclxuICAgIHMuZ2V0TWUoKS50aGVuKFxyXG4gICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHByaW50VXNlcihkYXRhKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgKVxyXG5cclxuICAgIHMuZ2V0TXlUb3BUcmFja3Moe3RpbWVfcmFuZ2U6ICdzaG9ydF90ZXJtJyxsaW1pdDogNTB9KS50aGVuKFxyXG4gICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGxpc3RTb25nc1Nob3J0VGVybSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHByaW50VXNlclNvbmdzKGRhdGEpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICApXHJcblxyXG4gICAgcy5nZXRNeVRvcEFydGlzdHMoe3RpbWVfcmFuZ2U6ICdzaG9ydF90ZXJtJyxsaW1pdDogMjB9KS50aGVuKFxyXG4gICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGxpc3RBcnRpc3RzU2hvcnRUZXJtID0gZGF0YTtcclxuICAgICAgICAgICAgcHJpbnRVc2VyQXJ0aXN0cyhkYXRhKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgKVxyXG5cclxufSkoKTtcclxuXHJcbn1cclxuXHJcbmlmKCQoXCJib2R5I211c2ljYVwiKS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgbGV0IGlkQXJ0aXN0YTtcclxuICAgIGxldCBpZEFsYnVtO1xyXG5cclxuICAgIGNvbnN0IGluZm9BcnRpc3RhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcnRpc3RhLWluZm9cIik7XHJcbiAgICBsZXQgbGlzdEFydGlzdEluZm8gPSAwO1xyXG5cclxuICAgIGluZm9BcnRpc3RhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKGxpc3RBcnRpc3RJbmZvID09IDApIHtcclxuICAgICAgICAgICAgcy5nZXRBcnRpc3QoaWRBcnRpc3RhKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0QXJ0aXN0SW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRBcnRpc3REYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBwcmludEFydGlzdERhdGEobGlzdEFydGlzdEluZm8pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc2ltaWxhckFydGlzdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFydGlzdGFzLXNpbWlsYXJlc1wiKTtcclxuICAgIGxldCBsaXN0U2ltaWxhckFydGlzdHMgPSAwO1xyXG5cclxuICAgIHNpbWlsYXJBcnRpc3RzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKGxpc3RTaW1pbGFyQXJ0aXN0cyA9PSAwKSB7XHJcbiAgICAgICAgICAgIHMuZ2V0QXJ0aXN0UmVsYXRlZEFydGlzdHMoaWRBcnRpc3RhKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0U2ltaWxhckFydGlzdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByaW50QXJ0aXN0UmVsYXRlZEFydGlzdHNEYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBwcmludEFydGlzdFJlbGF0ZWRBcnRpc3RzRGF0YShsaXN0U2ltaWxhckFydGlzdHMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgYWxidW1UcmFja3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsYnVtLWZhaXhhc1wiKTtcclxuICAgIGxldCBsaXN0QWxidW1UcmFja3MgPSAwO1xyXG5cclxuICAgIGFsYnVtVHJhY2tzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKGxpc3RBbGJ1bVRyYWNrcyA9PSAwKSB7XHJcbiAgICAgICAgICAgIHMuZ2V0QWxidW1UcmFja3MoaWRBbGJ1bSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdEFsYnVtVHJhY2tzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBwcmludEFsYnVtRGF0YShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgcHJpbnRBbGJ1bURhdGEobGlzdEFsYnVtVHJhY2tzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGFsYnVtUGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGJ1bS1wbGF5ZXJcIik7XHJcbiAgICBhbGJ1bVBsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBmaWVsZEFsYnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZXVkby1hbGJ1bVwiKVxyXG4gICAgICAgIGZpZWxkQWxidW0uaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgICAgIGZpZWxkQWxidW0uaW5uZXJIVE1MICs9ICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vb3Blbi5zcG90aWZ5LmNvbS9lbWJlZC9hbGJ1bS8nICsgaWRBbGJ1bSArICdcIiB3aWR0aD1cIjkwJVwiIGhlaWdodD1cIjIxMFwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93dHJhbnNwYXJlbmN5PVwidHJ1ZVwiIGFsbG93PVwiZW5jcnlwdGVkLW1lZGlhXCI+PC9pZnJhbWU+J1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gcHJpbnRTb25nRGF0YShkYXRhKSB7XHJcblxyXG4gICAgICAgIGxldCBmaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGV1ZG8tbXVzaWNhXCIpXHJcblxyXG4gICAgICAgIGxldCBkYWRvcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGFkb3MuY2xhc3NOYW1lID0gJ2RhZG9zLW11c2ljYSc7XHJcbiAgICBcclxuICAgICAgICBkYWRvcy5pbm5lckhUTUwgKz0gJzxpbWcgaWQ9XCJkYWRvLWZvdG9cIiBzcmM9JyArIGAke2RhdGEuYWxidW0uaW1hZ2VzWzBdLnVybH1gICsgJz48L2ltZz4nXHJcblxyXG4gICAgICAgIGxldCBkYWRvc011c2ljYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGFkb3NNdXNpY2EuY2xhc3NOYW1lID0gJ2RhZG8tbXVzaWNhJztcclxuICAgICAgICBkYWRvc011c2ljYS5pbm5lckhUTUwgKz0gJzxwIGlkPVwiZGFkby1ub21lXCI+JyArIGAke2RhdGEubmFtZX1gICsgJzwvcD4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cCBpZD1cImRhZG8tbm9tZS1hbGJ1bVwiPicgKyBgJHtkYXRhLmFsYnVtLm5hbWV9YCArICc8L3A+J1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkYWRvc0FydGlzdGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICBkYWRvc0FydGlzdGEuY2xhc3NOYW1lID0gJ2RhZG8tYXJ0aXN0YSc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmFydGlzdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPT0gKGRhdGEuYXJ0aXN0cy5sZW5ndGggLSAxKSkgXHJcbiAgICAgICAgICAgICAgICBkYWRvc0FydGlzdGEuaW5uZXJIVE1MICs9ICcgJyArIGAke2RhdGEuYXJ0aXN0c1tpXS5uYW1lfWBcclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIGRhZG9zQXJ0aXN0YS5pbm5lckhUTUwgKz0gICcgJyArIGAke2RhdGEuYXJ0aXN0c1tpXS5uYW1lfWAgKyAnLCdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwbGF5ZXJNdXNpY2EgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHBsYXllck11c2ljYS5jbGFzc05hbWUgPSAncGxheWVyLW11c2ljYSc7XHJcbiAgICAgICAgcGxheWVyTXVzaWNhLmlubmVySFRNTCArPSAnPHAgaWQ9XCJwbGF5ZXItdGl0dWxvXCI+UGxheWVyOiA8L3A+JztcclxuICAgICAgICBwbGF5ZXJNdXNpY2EuaW5uZXJIVE1MICs9ICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vb3Blbi5zcG90aWZ5LmNvbS9lbWJlZC90cmFjay8nICsgZGF0YS5pZCArICdcIiB3aWR0aD1cIjk1JVwiIGhlaWdodD1cIjgwXCIgZnJhbWVCb3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPVwiXCIgYWxsb3c9XCJhdXRvcGxheTsgY2xpcGJvYXJkLXdyaXRlOyBlbmNyeXB0ZWQtbWVkaWE7IGZ1bGxzY3JlZW47IHBpY3R1cmUtaW4tcGljdHVyZVwiPjwvaWZyYW1lPidcclxuXHJcbiAgICAgICAgZGFkb3NNdXNpY2EuYXBwZW5kQ2hpbGQoZGFkb3NBcnRpc3RhKTtcclxuICAgICAgICBkYWRvcy5hcHBlbmRDaGlsZChkYWRvc011c2ljYSk7XHJcbiAgICAgICAgZmllbGQuYXBwZW5kQ2hpbGQoZGFkb3MpO1xyXG4gICAgICAgIGZpZWxkLmFwcGVuZENoaWxkKHBsYXllck11c2ljYSk7XHJcblxyXG4gICAgICAgIGxldCBmaWVsZDIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpdHVsby1hdmFsaWFyLW11c2ljYVwiKVxyXG4gICAgICAgIGZpZWxkMi5pbm5lckhUTUwgKz0gJzxoMyBzdHlsZT1cInRleHQtYWxpZ246Y2VudGVyXCI+QXZhbGllICcgKyBgJHtkYXRhLm5hbWV9YCArICc8L2gzPidcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcmludEFydGlzdERhdGEoZGF0YSkge1xyXG4gICAgICAgIGxldCBmaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGV1ZG8tYXJ0aXN0YVwiKVxyXG4gICAgICAgIGZpZWxkLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGxldCBkYWRvcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGFkb3MuY2xhc3NOYW1lID0gJ2RhZG9zLWFydGlzdGEnO1xyXG4gICAgXHJcbiAgICAgICAgZGFkb3MuaW5uZXJIVE1MICs9ICc8aW1nIGlkPVwiZGFkby1mb3RvLWFydGlzdGFcIiBzcmM9JyArIGAke2RhdGEuaW1hZ2VzWzBdLnVybH1gICsgJz48L2ltZz4nXHJcblxyXG4gICAgICAgIGxldCBkYWRvc0FydGlzdGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRhZG9zQXJ0aXN0YS5jbGFzc05hbWUgPSAnZGFkby1hcnRpc3RhJztcclxuICAgICAgICBkYWRvc0FydGlzdGEuaW5uZXJIVE1MICs9ICc8cCBpZD1cImRhZG8tbm9tZS1hcnRpc3RhXCI+JyArIGAke2RhdGEubmFtZX1gICsgJzwvcD4nXHJcbiAgICAgICAgZGFkb3NBcnRpc3RhLmlubmVySFRNTCArPSAnPHA+U2VndWlkb3JlczogJyArIGAke2RhdGEuZm9sbG93ZXJzLnRvdGFsfWAgKyAnPC9wPidcclxuICAgICAgICBkYWRvc0FydGlzdGEuaW5uZXJIVE1MICs9ICc8cD5Qb3B1bGFyaWRhZGU6ICcgKyBgJHtkYXRhLnBvcHVsYXJpdHl9YCArICc8L3A+J1xyXG4gICAgICAgIGRhZG9zQXJ0aXN0YS5pbm5lckhUTUwgKz0gJzxhIGhyZWY9JyArIGAke2RhdGEuZXh0ZXJuYWxfdXJscy5zcG90aWZ5fWAgKyAnIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgaWQ9XCJsb2dvLXNwb3RpZnlcIiBzcmM9XCIuLi9pbWcvc3BvdGlmeS5wbmdcIj48L2ltZz48L2E+J1xyXG5cclxuICAgICAgICBkYWRvcy5hcHBlbmRDaGlsZChkYWRvc0FydGlzdGEpO1xyXG4gICAgICAgIGZpZWxkLmFwcGVuZENoaWxkKGRhZG9zKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEuZ2VucmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGRhZG9zR2VuZXJvcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGRhZG9zR2VuZXJvcy5jbGFzc05hbWUgPSAnZGFkby1nZW5lcm9zJztcclxuICAgICAgICAgICAgZGFkb3NHZW5lcm9zLmlubmVySFRNTCArPSAnPHAgaWQ9XCJkYWRvLWdlbmVyby10aXR1bG9cIj5Hw6puZXJvczogPC9wPic7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuZ2VucmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBkYWRvc0dlbmVyb3MuaW5uZXJIVE1MICs9ICc8c3BhbiBjbGFzcz1cImRhZG8tZ2VuZXJvLW5vbWVcIj4gJyArIGAke2RhdGEuZ2VucmVzW2ldfWAgKyAnPC9zcGFuPidcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmllbGQuYXBwZW5kQ2hpbGQoZGFkb3NHZW5lcm9zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJpbnRBcnRpc3RSZWxhdGVkQXJ0aXN0c0RhdGEoZGF0YSkge1xyXG4gICAgICAgIGxldCBmaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGV1ZG8tYXJ0aXN0YVwiKVxyXG4gICAgICAgIGZpZWxkLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGk8ZGF0YS5hcnRpc3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBhcnRpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBhcnRpc3QuY2xhc3NOYW1lID0gJ2RhZG8tYXJ0aXN0YS1zaW1pbGFyJztcclxuICAgIFxyXG4gICAgICAgICAgICBhcnRpc3QuaW5uZXJIVE1MICs9ICc8aW1nIGNsYXNzPVwiZGFkby1hcnRpc3RhLXNpbWlsYXItZm90b1wiIHNyYz0nICsgYCR7ZGF0YS5hcnRpc3RzW2ldLmltYWdlc1syXS51cmx9YCArICc+PC9pbWc+J1xyXG4gICAgICAgICAgICBhcnRpc3QuaW5uZXJIVE1MICs9ICc8ZGl2IGlkPVwiZGFkby1hcnRpc3RhLXNpbWlsYXItc3BhblwiPjxwIGNsYXNzPVwiZGFkby1hcnRpc3RhLXNpbWlsYXItbm9tZVwiPicgKyBgJHtkYXRhLmFydGlzdHNbaV0ubmFtZX1gICsgJzwvcD48L2Rpdj4nO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGZpZWxkLmFwcGVuZENoaWxkKGFydGlzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByaW50QXVkaW9GZWF0dXJlc1RyYWNrKGRhdGEpIHtcclxuICAgICAgICBsZXQgZmllbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRldWRvLWF0cmlidXRvc1wiKVxyXG5cclxuICAgICAgICBmaWVsZC5pbm5lckhUTUwgKz0gJzxzcGFuIGNsYXNzPVwibm9tZS1hdHJpYnV0b1wiPkRhbsOnYWJpbGlkYWRlOiA8L3NwYW4+J1xyXG4gICAgICAgIGZpZWxkLmlubmVySFRNTCArPSAnPHNwYW4+JyArIGAke2RhdGEuZGFuY2VhYmlsaXR5fWAgKyAnPC9zcGFuPidcclxuICAgICAgICBmaWVsZC5pbm5lckhUTUwgKz0gJzxkaXYgaWQ9XCJiYXJyYS1wcm9ncmVzc29cIj48ZGl2IHN0eWxlPVwid2lkdGg6ICcgKyAoYCR7ZGF0YS5kYW5jZWFiaWxpdHl9YCAqIDEwMCkgKyAnJVwiPjwvZGl2PjwvZGl2PidcclxuICAgICAgICBmaWVsZC5pbm5lckhUTUwgKz0gJzxwPk8gcXVhbnRvIGEgZmFpeGEgw6kgYXByb3ByaWFkYSBwYXJhIGRhbsOnYXIgYmFzZWFkbyBlbSB1bWEgY29tYmluYcOnw6NvIGRlIGVsZW1lbnRvcyBtdXNpY2FpcywgaW5jbHVpbmRvIHJpdG1vLCBiYXRpZGEgZSByZWd1bGFyaWRhZGUuIFZhcmlhIGVudHJlIDAuMCBlIDEuMC48L3A+J1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZpZWxkLmlubmVySFRNTCArPSAnPHNwYW4gY2xhc3M9XCJub21lLWF0cmlidXRvXCI+QWPDunN0aWNhOiA8L3NwYW4+J1xyXG4gICAgICAgIGZpZWxkLmlubmVySFRNTCArPSAnPHNwYW4+JyArIGAke2RhdGEuYWNvdXN0aWNuZXNzfWAgKyAnPC9zcGFuPidcclxuICAgICAgICBmaWVsZC5pbm5lckhUTUwgKz0gJzxkaXYgaWQ9XCJiYXJyYS1wcm9ncmVzc29cIj48ZGl2IHN0eWxlPVwid2lkdGg6ICcgKyAoYCR7ZGF0YS5hY291c3RpY25lc3N9YCAqIDEwMCkgKyAnJVwiPjwvZGl2PjwvZGl2PidcclxuICAgICAgICBmaWVsZC5pbm5lckhUTUwgKz0gJzxwPk8gcXVhbnRvIGEgZmFpeGEgw6kgYWPDunN0aWNhLiBWYXJpYSBlbnRyZSAwLjAgZSAxLjAuPC9wPidcclxuICAgICAgIFxyXG4gICAgICAgIGZpZWxkLmlubmVySFRNTCArPSAnPHNwYW4gY2xhc3M9XCJub21lLWF0cmlidXRvXCI+VmFsZW5jZTogPC9zcGFuPidcclxuICAgICAgICBmaWVsZC5pbm5lckhUTUwgKz0gJzxzcGFuPicgKyBgJHtkYXRhLnZhbGVuY2V9YCArICc8L3NwYW4+J1xyXG4gICAgICAgIGZpZWxkLmlubmVySFRNTCArPSAnPGRpdiBpZD1cImJhcnJhLXByb2dyZXNzb1wiPjxkaXYgc3R5bGU9XCJ3aWR0aDogJyArIChgJHtkYXRhLnZhbGVuY2V9YCAqIDEwMCkgKyAnJVwiPjwvZGl2PjwvZGl2PidcclxuICAgICAgICBmaWVsZC5pbm5lckhUTUwgKz0gJzxwPk8gcXVhbnRvIGEgZmFpeGEgw6kgcG9zaXRpdmEgbXVzaWNhbG1lbnRlLiBWYXJpYSBlbnRyZSAwLjAgZSAxLjAuPC9wPidcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcmludEFsYnVtRGF0YShkYXRhKSB7XHJcblxyXG4gICAgICAgIGxldCBmaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGV1ZG8tYWxidW1cIik7XHJcbiAgICAgICAgZmllbGQuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAgICAgbGV0IGRhZG9zMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGFkb3MyLmNsYXNzTmFtZSA9ICdkYWRvczInO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpPGRhdGEuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHNvbmdEYXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgc29uZ0RhdGEuY2xhc3NOYW1lID0gJ2RhZG8tbXVzaWNhLWFsYnVtJztcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTb25nID0gaSsxO1xyXG4gICAgICAgICAgICBzb25nRGF0YS5pbm5lckhUTUwgKz0gJzxkaXYgY2xhc3M9XCJkYWRvLW11c2ljYS1jaXJjdWxvXCI+PHAgY2xhc3M9XCJkYWRvLW11c2ljYS1udW1lcm9cIj4nKyBjdXJyZW50U29uZyArICc8L3A+PC9kaXY+JztcclxuICAgICAgICAgICAgc29uZ0RhdGEuaW5uZXJIVE1MICs9ICc8ZGl2IGlkPVwiZGFkby1tdXNpY2Etc3BhblwiPjxhIGhyZWY9aHR0cHM6Ly9tYXJhY3VmeS5oZXJva3VhcHAuY29tL211c2ljYS8/aWQ9JyArIGAke2RhdGEuaXRlbXNbaV0uaWR9YCArICcgdGFyZ2V0PVwiX2JsYW5rXCI+PHAgY2xhc3M9XCJkYWRvLW11c2ljYS1ub21lXCI+JyArIGAke2RhdGEuaXRlbXNbaV0ubmFtZX1gICsgJzwvcD48L2E+PC9kaXY+JztcclxuXHJcbiAgICAgICAgICAgIGZpZWxkLmFwcGVuZENoaWxkKHNvbmdEYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAoZnVuY3Rpb24gZ2V0U29uZ0RhdGEoKSB7XHJcblxyXG4gICAgICAgIGxldCB0b2tlbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjZXNzLXRva2VuJyk7XHJcbiAgICAgICAgaWYodG9rZW4gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydChcIsOJIG5lY2Vzc8OhcmlvIGVzdGFyIGxvZ2FkbyBubyBzcG90aWZ5IHBhcmEgdXRpbGl6YXIgbyBNYXJhY3VmeVwiKVxyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgnaHR0cHM6Ly9tYXJhY3VmeS5oZXJva3VhcHAuY29tJylcclxuICAgICAgICB9XHJcbiAgICAgICAgcy5zZXRBY2Nlc3NUb2tlbih0b2tlbik7XHJcblxyXG4gICAgICAgIC8vIGdldEFsYnVtVHJhY2tzKClcclxuICAgICAgICAvLyBnZXRBcnRpc3RSZWxhdGVkQXJ0aXN0cygpXHJcbiAgICAgICAgLy8gZ2V0QXVkaW9GZWF0dXJlc0ZvclRyYWNrKClcclxuICAgICAgICAvL2xldCBpZE11c2ljYSA9IG5ldyBVUkwoZG9jdW1lbnQuVVJMKS5oYXNoXHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxyXG4gICAgICAgIGlkTXVzaWNhID0gcGFyYW1zLmdldChcImlkXCIpXHJcblxyXG4gICAgICAgIHMuZ2V0VHJhY2soaWRNdXNpY2EpLnRoZW4oXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZEFydGlzdGEgPSBkYXRhLmFydGlzdHNbMF0uaWQ7XHJcbiAgICAgICAgICAgICAgICBpZEFsYnVtID0gZGF0YS5hbGJ1bS5pZDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcy5nZXRBcnRpc3QoaWRBcnRpc3RhKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludEFydGlzdERhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHMuZ2V0QWxidW1UcmFja3MoaWRBbGJ1bSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRBbGJ1bURhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgbGV0IGZpZWxkQWxidW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRldWRvLWFsYnVtXCIpXHJcbiAgICAgICAgICAgICAgICBmaWVsZEFsYnVtLmlubmVySFRNTCArPSAnPGlmcmFtZSBzcmM9XCJodHRwczovL29wZW4uc3BvdGlmeS5jb20vZW1iZWQvYWxidW0vJyArIGlkQWxidW0gKyAnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMzAwXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3d0cmFuc3BhcmVuY3k9XCJ0cnVlXCIgYWxsb3c9XCJlbmNyeXB0ZWQtbWVkaWFcIj48L2lmcmFtZT4nXHJcbiAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIHByaW50U29uZ0RhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcblxyXG4gICAgICAgIHMuZ2V0QXVkaW9GZWF0dXJlc0ZvclRyYWNrKGlkTXVzaWNhKS50aGVuKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBwcmludEF1ZGlvRmVhdHVyZXNUcmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgICAgIFxyXG4gICAgXHJcbiAgICB9KSgpO1xyXG4gICAgXHJcbn0iLCIvKiBnbG9iYWwgbW9kdWxlICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFQSVxyXG4gKi9cclxudmFyIFNwb3RpZnlXZWJBcGkgPSAoZnVuY3Rpb24gKCkge1xyXG4gIHZhciBfYmFzZVVyaSA9ICdodHRwczovL2FwaS5zcG90aWZ5LmNvbS92MSc7XHJcbiAgdmFyIF9hY2Nlc3NUb2tlbiA9IG51bGw7XHJcbiAgdmFyIF9wcm9taXNlSW1wbGVtZW50YXRpb24gPSBudWxsO1xyXG5cclxuICB2YXIgV3JhcFByb21pc2VXaXRoQWJvcnQgPSBmdW5jdGlvbiAocHJvbWlzZSwgb25BYm9ydCkge1xyXG4gICAgcHJvbWlzZS5hYm9ydCA9IG9uQWJvcnQ7XHJcbiAgICByZXR1cm4gcHJvbWlzZTtcclxuICB9O1xyXG5cclxuICB2YXIgX3Byb21pc2VQcm92aWRlciA9IGZ1bmN0aW9uIChwcm9taXNlRnVuY3Rpb24sIG9uQWJvcnQpIHtcclxuICAgIHZhciByZXR1cm5lZFByb21pc2U7XHJcbiAgICBpZiAoX3Byb21pc2VJbXBsZW1lbnRhdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgZGVmZXJyZWQgPSBfcHJvbWlzZUltcGxlbWVudGF0aW9uLmRlZmVyKCk7XHJcbiAgICAgIHByb21pc2VGdW5jdGlvbihcclxuICAgICAgICBmdW5jdGlvbiAocmVzb2x2ZWRSZXN1bHQpIHtcclxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x2ZWRSZXN1bHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKHJlamVjdGVkUmVzdWx0KSB7XHJcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVqZWN0ZWRSZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuZWRQcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh3aW5kb3cuUHJvbWlzZSkge1xyXG4gICAgICAgIHJldHVybmVkUHJvbWlzZSA9IG5ldyB3aW5kb3cuUHJvbWlzZShwcm9taXNlRnVuY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJldHVybmVkUHJvbWlzZSkge1xyXG4gICAgICByZXR1cm4gbmV3IFdyYXBQcm9taXNlV2l0aEFib3J0KHJldHVybmVkUHJvbWlzZSwgb25BYm9ydCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgX2V4dGVuZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuICAgIHZhciB0YXJnZXQgPSBhcmdzWzBdO1xyXG4gICAgdmFyIG9iamVjdHMgPSBhcmdzLnNsaWNlKDEpO1xyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHt9O1xyXG4gICAgb2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChvYmplY3QpIHtcclxuICAgICAgZm9yICh2YXIgaiBpbiBvYmplY3QpIHtcclxuICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGopKSB7XHJcbiAgICAgICAgICB0YXJnZXRbal0gPSBvYmplY3Rbal07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgfTtcclxuXHJcbiAgdmFyIF9idWlsZFVybCA9IGZ1bmN0aW9uICh1cmwsIHBhcmFtZXRlcnMpIHtcclxuICAgIHZhciBxcyA9ICcnO1xyXG4gICAgZm9yICh2YXIga2V5IGluIHBhcmFtZXRlcnMpIHtcclxuICAgICAgaWYgKHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcmFtZXRlcnNba2V5XTtcclxuICAgICAgICBxcyArPSBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkgKyAnJic7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChxcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIC8vIGNob3Agb2ZmIGxhc3QgJyYnXHJcbiAgICAgIHFzID0gcXMuc3Vic3RyaW5nKDAsIHFzLmxlbmd0aCAtIDEpO1xyXG4gICAgICB1cmwgPSB1cmwgKyAnPycgKyBxcztcclxuICAgIH1cclxuICAgIHJldHVybiB1cmw7XHJcbiAgfTtcclxuXHJcbiAgdmFyIF9wZXJmb3JtUmVxdWVzdCA9IGZ1bmN0aW9uIChyZXF1ZXN0RGF0YSwgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICB2YXIgcHJvbWlzZUZ1bmN0aW9uID0gZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcclxuICAgICAgICBpZiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGZhaWx1cmUoKSB7XHJcbiAgICAgICAgaWYgKHJlamVjdCkge1xyXG4gICAgICAgICAgcmVqZWN0KHJlcSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgY2FsbGJhY2socmVxLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB0eXBlID0gcmVxdWVzdERhdGEudHlwZSB8fCAnR0VUJztcclxuICAgICAgcmVxLm9wZW4odHlwZSwgX2J1aWxkVXJsKHJlcXVlc3REYXRhLnVybCwgcmVxdWVzdERhdGEucGFyYW1zKSk7XHJcbiAgICAgIGlmIChfYWNjZXNzVG9rZW4pIHtcclxuICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIF9hY2Nlc3NUb2tlbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgICAgICB2YXIgZGF0YSA9IG51bGw7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBkYXRhID0gcmVxLnJlc3BvbnNlVGV4dCA/IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCkgOiAnJztcclxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAocmVxLnN0YXR1cyA+PSAyMDAgJiYgcmVxLnN0YXR1cyA8IDMwMCkge1xyXG4gICAgICAgICAgICBzdWNjZXNzKGRhdGEpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmFpbHVyZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmICh0eXBlID09PSAnR0VUJykge1xyXG4gICAgICAgIHJlcS5zZW5kKG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBwb3N0RGF0YSA9IG51bGw7XHJcbiAgICAgICAgaWYgKHJlcXVlc3REYXRhLnBvc3REYXRhKSB7XHJcbiAgICAgICAgICBpZiAocmVxdWVzdERhdGEuY29udGVudFR5cGUgPT09ICdpbWFnZS9qcGVnJykge1xyXG4gICAgICAgICAgICBwb3N0RGF0YSA9IHJlcXVlc3REYXRhLnBvc3REYXRhO1xyXG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgcmVxdWVzdERhdGEuY29udGVudFR5cGUpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcG9zdERhdGEgPSBKU09OLnN0cmluZ2lmeShyZXF1ZXN0RGF0YS5wb3N0RGF0YSk7XHJcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXEuc2VuZChwb3N0RGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgIHByb21pc2VGdW5jdGlvbigpO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBfcHJvbWlzZVByb3ZpZGVyKHByb21pc2VGdW5jdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJlcS5hYm9ydCgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QgPSBmdW5jdGlvbiAoXHJcbiAgICByZXF1ZXN0RGF0YSxcclxuICAgIG9wdGlvbnMsXHJcbiAgICBjYWxsYmFjayxcclxuICAgIG9wdGlvbnNBbHdheXNFeHRlbmRQYXJhbXNcclxuICApIHtcclxuICAgIHZhciBvcHQgPSB7fTtcclxuICAgIHZhciBjYiA9IG51bGw7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBvcHQgPSBvcHRpb25zO1xyXG4gICAgICBjYiA9IGNhbGxiYWNrO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBjYiA9IG9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb3B0aW9ucyBleHRlbmQgcG9zdERhdGEsIGlmIGFueS4gT3RoZXJ3aXNlIHRoZXkgZXh0ZW5kIHBhcmFtZXRlcnMgc2VudCBpbiB0aGUgdXJsXHJcbiAgICB2YXIgdHlwZSA9IHJlcXVlc3REYXRhLnR5cGUgfHwgJ0dFVCc7XHJcbiAgICBpZiAodHlwZSAhPT0gJ0dFVCcgJiYgcmVxdWVzdERhdGEucG9zdERhdGEgJiYgIW9wdGlvbnNBbHdheXNFeHRlbmRQYXJhbXMpIHtcclxuICAgICAgcmVxdWVzdERhdGEucG9zdERhdGEgPSBfZXh0ZW5kKHJlcXVlc3REYXRhLnBvc3REYXRhLCBvcHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVxdWVzdERhdGEucGFyYW1zID0gX2V4dGVuZChyZXF1ZXN0RGF0YS5wYXJhbXMsIG9wdCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX3BlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBjYik7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgd3JhcHBlclxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHZhciBDb25zdHIgPSBmdW5jdGlvbiAoKSB7fTtcclxuXHJcbiAgQ29uc3RyLnByb3RvdHlwZSA9IHtcclxuICAgIGNvbnN0cnVjdG9yOiBTcG90aWZ5V2ViQXBpXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBhIHJlc291cmNlIHRocm91Z2ggYSBnZW5lcmljIEdFVCByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIGZldGNoZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFja1xyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRHZW5lcmljID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiB1cmxcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IHVzZXIuXHJcbiAgICogU2VlIFtHZXQgQ3VycmVudCBVc2VyJ3MgUHJvZmlsZV0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtY3VycmVudC11c2Vycy1wcm9maWxlLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRNZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZSdcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIGN1cnJlbnQgdXNlcidzIHNhdmVkIHRyYWNrcy5cclxuICAgKiBTZWUgW0dldCBDdXJyZW50IFVzZXIncyBTYXZlZCBUcmFja3NdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LXVzZXJzLXNhdmVkLXRyYWNrcy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0TXlTYXZlZFRyYWNrcyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS90cmFja3MnXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhIGxpc3Qgb2YgdHJhY2tzIHRvIHRoZSBjdXJyZW50IHVzZXIncyBzYXZlZCB0cmFja3MuXHJcbiAgICogU2VlIFtTYXZlIFRyYWNrcyBmb3IgQ3VycmVudCBVc2VyXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3NhdmUtdHJhY2tzLXVzZXIvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gdHJhY2tJZHMgVGhlIGlkcyBvZiB0aGUgdHJhY2tzLiBJZiB5b3Uga25vdyB0aGVpciBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGVpciB0cmFjayBpZCAoZS5nLiBzcG90aWZ5OnRyYWNrOjxoZXJlX2lzX3RoZV90cmFja19pZD4pXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuYWRkVG9NeVNhdmVkVHJhY2tzID0gZnVuY3Rpb24gKHRyYWNrSWRzLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS90cmFja3MnLFxyXG4gICAgICB0eXBlOiAnUFVUJyxcclxuICAgICAgcG9zdERhdGE6IHRyYWNrSWRzXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGEgbGlzdCBvZiB0cmFja3MgZnJvbSB0aGUgY3VycmVudCB1c2VyJ3Mgc2F2ZWQgdHJhY2tzLlxyXG4gICAqIFNlZSBbUmVtb3ZlIFRyYWNrcyBmb3IgQ3VycmVudCBVc2VyXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3JlbW92ZS10cmFja3MtdXNlci8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSB0cmFja0lkcyBUaGUgaWRzIG9mIHRoZSB0cmFja3MuIElmIHlvdSBrbm93IHRoZWlyIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZWlyIHRyYWNrIGlkIChlLmcuIHNwb3RpZnk6dHJhY2s6PGhlcmVfaXNfdGhlX3RyYWNrX2lkPilcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5yZW1vdmVGcm9tTXlTYXZlZFRyYWNrcyA9IGZ1bmN0aW9uIChcclxuICAgIHRyYWNrSWRzLFxyXG4gICAgb3B0aW9ucyxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3RyYWNrcycsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBwb3N0RGF0YTogdHJhY2tJZHNcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgdXNlcidzIHNhdmVkIHRyYWNrcyBjb250YWlucyBhIGNlcnRhaW4gbGlzdCBvZiB0cmFja3MuXHJcbiAgICogU2VlIFtDaGVjayBDdXJyZW50IFVzZXIncyBTYXZlZCBUcmFja3NdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvY2hlY2stdXNlcnMtc2F2ZWQtdHJhY2tzLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IHRyYWNrSWRzIFRoZSBpZHMgb2YgdGhlIHRyYWNrcy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlaXIgdHJhY2sgaWQgKGUuZy4gc3BvdGlmeTp0cmFjazo8aGVyZV9pc190aGVfdHJhY2tfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmNvbnRhaW5zTXlTYXZlZFRyYWNrcyA9IGZ1bmN0aW9uIChcclxuICAgIHRyYWNrSWRzLFxyXG4gICAgb3B0aW9ucyxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3RyYWNrcy9jb250YWlucycsXHJcbiAgICAgIHBhcmFtczogeyBpZHM6IHRyYWNrSWRzLmpvaW4oJywnKSB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGEgbGlzdCBvZiB0aGUgYWxidW1zIHNhdmVkIGluIHRoZSBjdXJyZW50IFNwb3RpZnkgdXNlcidzIFwiWW91ciBNdXNpY1wiIGxpYnJhcnkuXHJcbiAgICogU2VlIFtHZXQgQ3VycmVudCBVc2VyJ3MgU2F2ZWQgQWxidW1zXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC11c2Vycy1zYXZlZC1hbGJ1bXMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldE15U2F2ZWRBbGJ1bXMgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvbWUvYWxidW1zJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNhdmUgb25lIG9yIG1vcmUgYWxidW1zIHRvIHRoZSBjdXJyZW50IHVzZXIncyBcIllvdXIgTXVzaWNcIiBsaWJyYXJ5LlxyXG4gICAqIFNlZSBbU2F2ZSBBbGJ1bXMgZm9yIEN1cnJlbnQgVXNlcl0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9zYXZlLWFsYnVtcy11c2VyLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGFsYnVtSWRzIFRoZSBpZHMgb2YgdGhlIGFsYnVtcy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkksIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZWlyIGFsYnVtIGlkIChlLmcuIHNwb3RpZnk6YWxidW06PGhlcmVfaXNfdGhlX2FsYnVtX2lkPilcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5hZGRUb015U2F2ZWRBbGJ1bXMgPSBmdW5jdGlvbiAoYWxidW1JZHMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL2FsYnVtcycsXHJcbiAgICAgIHR5cGU6ICdQVVQnLFxyXG4gICAgICBwb3N0RGF0YTogYWxidW1JZHNcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgb25lIG9yIG1vcmUgYWxidW1zIGZyb20gdGhlIGN1cnJlbnQgdXNlcidzIFwiWW91ciBNdXNpY1wiIGxpYnJhcnkuXHJcbiAgICogU2VlIFtSZW1vdmUgQWxidW1zIGZvciBDdXJyZW50IFVzZXJdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvcmVtb3ZlLWFsYnVtcy11c2VyLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGFsYnVtSWRzIFRoZSBpZHMgb2YgdGhlIGFsYnVtcy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkksIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZWlyIGFsYnVtIGlkIChlLmcuIHNwb3RpZnk6YWxidW06PGhlcmVfaXNfdGhlX2FsYnVtX2lkPilcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5yZW1vdmVGcm9tTXlTYXZlZEFsYnVtcyA9IGZ1bmN0aW9uIChcclxuICAgIGFsYnVtSWRzLFxyXG4gICAgb3B0aW9ucyxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL2FsYnVtcycsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBwb3N0RGF0YTogYWxidW1JZHNcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBvbmUgb3IgbW9yZSBhbGJ1bXMgaXMgYWxyZWFkeSBzYXZlZCBpbiB0aGUgY3VycmVudCBTcG90aWZ5IHVzZXIncyBcIllvdXIgTXVzaWNcIiBsaWJyYXJ5LlxyXG4gICAqIFNlZSBbQ2hlY2sgVXNlcidzIFNhdmVkIEFsYnVtc10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9jaGVjay11c2Vycy1zYXZlZC1hbGJ1bXMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gYWxidW1JZHMgVGhlIGlkcyBvZiB0aGUgYWxidW1zLiBJZiB5b3Uga25vdyB0aGVpciBTcG90aWZ5IFVSSSwgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlaXIgYWxidW0gaWQgKGUuZy4gc3BvdGlmeTphbGJ1bTo8aGVyZV9pc190aGVfYWxidW1faWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmNvbnRhaW5zTXlTYXZlZEFsYnVtcyA9IGZ1bmN0aW9uIChcclxuICAgIGFsYnVtSWRzLFxyXG4gICAgb3B0aW9ucyxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL2FsYnVtcy9jb250YWlucycsXHJcbiAgICAgIHBhcmFtczogeyBpZHM6IGFsYnVtSWRzLmpvaW4oJywnKSB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBjdXJyZW50IHVzZXLigJlzIHRvcCBhcnRpc3RzIGJhc2VkIG9uIGNhbGN1bGF0ZWQgYWZmaW5pdHkuXHJcbiAgICogU2VlIFtHZXQgYSBVc2Vy4oCZcyBUb3AgQXJ0aXN0c10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtdXNlcnMtdG9wLWFydGlzdHMtYW5kLXRyYWNrcy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0TXlUb3BBcnRpc3RzID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3RvcC9hcnRpc3RzJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCB1c2Vy4oCZcyB0b3AgdHJhY2tzIGJhc2VkIG9uIGNhbGN1bGF0ZWQgYWZmaW5pdHkuXHJcbiAgICogU2VlIFtHZXQgYSBVc2Vy4oCZcyBUb3AgVHJhY2tzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC11c2Vycy10b3AtYXJ0aXN0cy1hbmQtdHJhY2tzLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRNeVRvcFRyYWNrcyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS90b3AvdHJhY2tzJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0cmFja3MgZnJvbSB0aGUgY3VycmVudCB1c2Vy4oCZcyByZWNlbnRseSBwbGF5ZWQgdHJhY2tzLlxyXG4gICAqIFNlZSBbR2V0IEN1cnJlbnQgVXNlcuKAmXMgUmVjZW50bHkgUGxheWVkIFRyYWNrc10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS93ZWItYXBpLXBlcnNvbmFsaXphdGlvbi1lbmRwb2ludHMvZ2V0LXJlY2VudGx5LXBsYXllZC8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0TXlSZWNlbnRseVBsYXllZFRyYWNrcyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9wbGF5ZXIvcmVjZW50bHktcGxheWVkJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgdGhlIGN1cnJlbnQgdXNlciBhcyBhIGZvbGxvd2VyIG9mIG9uZSBvciBtb3JlIG90aGVyIFNwb3RpZnkgdXNlcnMuXHJcbiAgICogU2VlIFtGb2xsb3cgQXJ0aXN0cyBvciBVc2Vyc10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9mb2xsb3ctYXJ0aXN0cy11c2Vycy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSB1c2VySWRzIFRoZSBpZHMgb2YgdGhlIHVzZXJzLiBJZiB5b3Uga25vdyB0aGVpciBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGVpciB1c2VyIGlkIChlLmcuIHNwb3RpZnk6dXNlcjo8aGVyZV9pc190aGVfdXNlcl9pZD4pXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgYW4gZW1wdHkgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5mb2xsb3dVc2VycyA9IGZ1bmN0aW9uICh1c2VySWRzLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9mb2xsb3dpbmcvJyxcclxuICAgICAgdHlwZTogJ1BVVCcsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIGlkczogdXNlcklkcy5qb2luKCcsJyksXHJcbiAgICAgICAgdHlwZTogJ3VzZXInXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHVzZXIgYXMgYSBmb2xsb3dlciBvZiBvbmUgb3IgbW9yZSBhcnRpc3RzLlxyXG4gICAqIFNlZSBbRm9sbG93IEFydGlzdHMgb3IgVXNlcnNdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZm9sbG93LWFydGlzdHMtdXNlcnMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gYXJ0aXN0SWRzIFRoZSBpZHMgb2YgdGhlIGFydGlzdHMuIElmIHlvdSBrbm93IHRoZWlyIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZWlyIGFydGlzdCBpZCAoZS5nLiBzcG90aWZ5OmFydGlzdDo8aGVyZV9pc190aGVfYXJ0aXN0X2lkPilcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyBhbiBlbXB0eSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmZvbGxvd0FydGlzdHMgPSBmdW5jdGlvbiAoYXJ0aXN0SWRzLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9mb2xsb3dpbmcvJyxcclxuICAgICAgdHlwZTogJ1BVVCcsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIGlkczogYXJ0aXN0SWRzLmpvaW4oJywnKSxcclxuICAgICAgICB0eXBlOiAnYXJ0aXN0J1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIHRoZSBjdXJyZW50IHVzZXIgYXMgYSBmb2xsb3dlciBvZiBvbmUgcGxheWxpc3QuXHJcbiAgICogU2VlIFtGb2xsb3cgYSBQbGF5bGlzdF0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9mb2xsb3ctcGxheWxpc3QvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwbGF5bGlzdElkIFRoZSBpZCBvZiB0aGUgcGxheWxpc3QuIElmIHlvdSBrbm93IHRoZSBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGUgcGxheWxpc3QgaWQgKGUuZy4gc3BvdGlmeTp1c2VyOnh4eHg6cGxheWxpc3Q6PGhlcmVfaXNfdGhlX3BsYXlsaXN0X2lkPilcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWQuIEZvciBpbnN0YW5jZSxcclxuICAgKiB3aGV0aGVyIHlvdSB3YW50IHRoZSBwbGF5bGlzdCB0byBiZSBmb2xsb3dlZCBwcml2YXRlbHkgKHtwdWJsaWM6IGZhbHNlfSlcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyBhbiBlbXB0eSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmZvbGxvd1BsYXlsaXN0ID0gZnVuY3Rpb24gKHBsYXlsaXN0SWQsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL3BsYXlsaXN0cy8nICsgcGxheWxpc3RJZCArICcvZm9sbG93ZXJzJyxcclxuICAgICAgdHlwZTogJ1BVVCcsXHJcbiAgICAgIHBvc3REYXRhOiB7fVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIHRoZSBjdXJyZW50IHVzZXIgYXMgYSBmb2xsb3dlciBvZiBvbmUgb3IgbW9yZSBvdGhlciBTcG90aWZ5IHVzZXJzLlxyXG4gICAqIFNlZSBbVW5mb2xsb3cgQXJ0aXN0cyBvciBVc2Vyc10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS91bmZvbGxvdy1hcnRpc3RzLXVzZXJzLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IHVzZXJJZHMgVGhlIGlkcyBvZiB0aGUgdXNlcnMuIElmIHlvdSBrbm93IHRoZWlyIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZWlyIHVzZXIgaWQgKGUuZy4gc3BvdGlmeTp1c2VyOjxoZXJlX2lzX3RoZV91c2VyX2lkPilcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyBhbiBlbXB0eSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnVuZm9sbG93VXNlcnMgPSBmdW5jdGlvbiAodXNlcklkcywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvbWUvZm9sbG93aW5nLycsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBwYXJhbXM6IHtcclxuICAgICAgICBpZHM6IHVzZXJJZHMuam9pbignLCcpLFxyXG4gICAgICAgIHR5cGU6ICd1c2VyJ1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyB0aGUgY3VycmVudCB1c2VyIGFzIGEgZm9sbG93ZXIgb2Ygb25lIG9yIG1vcmUgYXJ0aXN0cy5cclxuICAgKiBTZWUgW1VuZm9sbG93IEFydGlzdHMgb3IgVXNlcnNdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvdW5mb2xsb3ctYXJ0aXN0cy11c2Vycy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBhcnRpc3RJZHMgVGhlIGlkcyBvZiB0aGUgYXJ0aXN0cy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlaXIgYXJ0aXN0IGlkIChlLmcuIHNwb3RpZnk6YXJ0aXN0OjxoZXJlX2lzX3RoZV9hcnRpc3RfaWQ+KVxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIGFuIGVtcHR5IHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUudW5mb2xsb3dBcnRpc3RzID0gZnVuY3Rpb24gKGFydGlzdElkcywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvbWUvZm9sbG93aW5nLycsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBwYXJhbXM6IHtcclxuICAgICAgICBpZHM6IGFydGlzdElkcy5qb2luKCcsJyksXHJcbiAgICAgICAgdHlwZTogJ2FydGlzdCdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSB0aGUgY3VycmVudCB1c2VyIGFzIGEgZm9sbG93ZXIgb2Ygb25lIHBsYXlsaXN0LlxyXG4gICAqIFNlZSBbVW5mb2xsb3cgYSBQbGF5bGlzdF0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS91bmZvbGxvdy1wbGF5bGlzdC8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBsYXlsaXN0SWQgVGhlIGlkIG9mIHRoZSBwbGF5bGlzdC4gSWYgeW91IGtub3cgdGhlIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZSBwbGF5bGlzdCBpZCAoZS5nLiBzcG90aWZ5OnVzZXI6eHh4eDpwbGF5bGlzdDo8aGVyZV9pc190aGVfcGxheWxpc3RfaWQ+KVxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIGFuIGVtcHR5IHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUudW5mb2xsb3dQbGF5bGlzdCA9IGZ1bmN0aW9uIChwbGF5bGlzdElkLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9wbGF5bGlzdHMvJyArIHBsYXlsaXN0SWQgKyAnL2ZvbGxvd2VycycsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2tzIHRvIHNlZSBpZiB0aGUgY3VycmVudCB1c2VyIGlzIGZvbGxvd2luZyBvbmUgb3IgbW9yZSBvdGhlciBTcG90aWZ5IHVzZXJzLlxyXG4gICAqIFNlZSBbQ2hlY2sgaWYgQ3VycmVudCBVc2VyIEZvbGxvd3MgVXNlcnMgb3IgQXJ0aXN0c10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9jaGVjay1jdXJyZW50LXVzZXItZm9sbG93cy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSB1c2VySWRzIFRoZSBpZHMgb2YgdGhlIHVzZXJzLiBJZiB5b3Uga25vdyB0aGVpciBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGVpciB1c2VyIGlkIChlLmcuIHNwb3RpZnk6dXNlcjo8aGVyZV9pc190aGVfdXNlcl9pZD4pXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgYW4gYXJyYXkgb2YgYm9vbGVhbiB2YWx1ZXMgdGhhdCBpbmRpY2F0ZVxyXG4gICAqIHdoZXRoZXIgdGhlIHVzZXIgaXMgZm9sbG93aW5nIHRoZSB1c2VycyBzZW50IGluIHRoZSByZXF1ZXN0LlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5pc0ZvbGxvd2luZ1VzZXJzID0gZnVuY3Rpb24gKHVzZXJJZHMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL2ZvbGxvd2luZy9jb250YWlucycsXHJcbiAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICBwYXJhbXM6IHtcclxuICAgICAgICBpZHM6IHVzZXJJZHMuam9pbignLCcpLFxyXG4gICAgICAgIHR5cGU6ICd1c2VyJ1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2tzIHRvIHNlZSBpZiB0aGUgY3VycmVudCB1c2VyIGlzIGZvbGxvd2luZyBvbmUgb3IgbW9yZSBhcnRpc3RzLlxyXG4gICAqIFNlZSBbQ2hlY2sgaWYgQ3VycmVudCBVc2VyIEZvbGxvd3NdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvY2hlY2stY3VycmVudC11c2VyLWZvbGxvd3MvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gYXJ0aXN0SWRzIFRoZSBpZHMgb2YgdGhlIGFydGlzdHMuIElmIHlvdSBrbm93IHRoZWlyIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZWlyIGFydGlzdCBpZCAoZS5nLiBzcG90aWZ5OmFydGlzdDo8aGVyZV9pc190aGVfYXJ0aXN0X2lkPilcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyBhbiBhcnJheSBvZiBib29sZWFuIHZhbHVlcyB0aGF0IGluZGljYXRlXHJcbiAgICogd2hldGhlciB0aGUgdXNlciBpcyBmb2xsb3dpbmcgdGhlIGFydGlzdHMgc2VudCBpbiB0aGUgcmVxdWVzdC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuaXNGb2xsb3dpbmdBcnRpc3RzID0gZnVuY3Rpb24gKGFydGlzdElkcywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvbWUvZm9sbG93aW5nL2NvbnRhaW5zJyxcclxuICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIGlkczogYXJ0aXN0SWRzLmpvaW4oJywnKSxcclxuICAgICAgICB0eXBlOiAnYXJ0aXN0J1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgdG8gc2VlIGlmIG9uZSBvciBtb3JlIFNwb3RpZnkgdXNlcnMgYXJlIGZvbGxvd2luZyBhIHNwZWNpZmllZCBwbGF5bGlzdC5cclxuICAgKiBTZWUgW0NoZWNrIGlmIFVzZXJzIEZvbGxvdyBhIFBsYXlsaXN0XShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2NoZWNrLXVzZXItZm9sbG93aW5nLXBsYXlsaXN0Lykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGxheWxpc3RJZCBUaGUgaWQgb2YgdGhlIHBsYXlsaXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHBsYXlsaXN0IGlkIChlLmcuIHNwb3RpZnk6dXNlcjp4eHh4OnBsYXlsaXN0OjxoZXJlX2lzX3RoZV9wbGF5bGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSB1c2VySWRzIFRoZSBpZHMgb2YgdGhlIHVzZXJzLiBJZiB5b3Uga25vdyB0aGVpciBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGVpciB1c2VyIGlkIChlLmcuIHNwb3RpZnk6dXNlcjo8aGVyZV9pc190aGVfdXNlcl9pZD4pXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgYW4gYXJyYXkgb2YgYm9vbGVhbiB2YWx1ZXMgdGhhdCBpbmRpY2F0ZVxyXG4gICAqIHdoZXRoZXIgdGhlIHVzZXJzIGFyZSBmb2xsb3dpbmcgdGhlIHBsYXlsaXN0IHNlbnQgaW4gdGhlIHJlcXVlc3QuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmFyZUZvbGxvd2luZ1BsYXlsaXN0ID0gZnVuY3Rpb24gKFxyXG4gICAgcGxheWxpc3RJZCxcclxuICAgIHVzZXJJZHMsXHJcbiAgICBjYWxsYmFja1xyXG4gICkge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9wbGF5bGlzdHMvJyArIHBsYXlsaXN0SWQgKyAnL2ZvbGxvd2Vycy9jb250YWlucycsXHJcbiAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICBwYXJhbXM6IHtcclxuICAgICAgICBpZHM6IHVzZXJJZHMuam9pbignLCcpXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIGZvbGxvd2VkIGFydGlzdHMuXHJcbiAgICogU2VlIFtHZXQgVXNlcidzIEZvbGxvd2VkIEFydGlzdHNdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LWZvbGxvd2VkLWFydGlzdHMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gT3B0aW9ucywgYmVpbmcgYWZ0ZXIgYW5kIGxpbWl0LlxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIGFuIG9iamVjdCB3aXRoIGEgcGFnZWQgb2JqZWN0IGNvbnRhaW5pbmdcclxuICAgKiBhcnRpc3RzLlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfHVuZGVmaW5lZH0gQSBwcm9taXNlIHRoYXQgaWYgc3VjY2Vzc2Z1bCwgcmVzb2x2ZXMgdG8gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBwYWdpbmcgb2JqZWN0IHdoaWNoIGNvbnRhaW5zXHJcbiAgICogYXJ0aXN0cyBvYmplY3RzLiBOb3QgcmV0dXJuZWQgaWYgYSBjYWxsYmFjayBpcyBnaXZlbi5cclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEZvbGxvd2VkQXJ0aXN0cyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9mb2xsb3dpbmcnLFxyXG4gICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgdHlwZTogJ2FydGlzdCdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgaW5mb3JtYXRpb24gYWJvdXQgYSBzcGVjaWZpYyB1c2VyLlxyXG4gICAqIFNlZSBbR2V0IGEgVXNlcidzIFByb2ZpbGVdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LXVzZXJzLXByb2ZpbGUvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VySWQgVGhlIGlkIG9mIHRoZSB1c2VyLiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIGlkIChlLmcuIHNwb3RpZnk6dXNlcjo8aGVyZV9pc190aGVfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldFVzZXIgPSBmdW5jdGlvbiAodXNlcklkLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy91c2Vycy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHVzZXJJZClcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIGEgbGlzdCBvZiB0aGUgY3VycmVudCB1c2VyJ3MgcGxheWxpc3RzLlxyXG4gICAqIFNlZSBbR2V0IGEgTGlzdCBvZiBhIFVzZXIncyBQbGF5bGlzdHNdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LWxpc3QtdXNlcnMtcGxheWxpc3RzLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlcklkIEFuIG9wdGlvbmFsIGlkIG9mIHRoZSB1c2VyLiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIGlkIChlLmcuIHNwb3RpZnk6dXNlcjo8aGVyZV9pc190aGVfaWQ+KS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgaWQgb2YgdGhlIHVzZXIgdGhhdCBncmFudGVkXHJcbiAgICogdGhlIHBlcm1pc3Npb25zIHdpbGwgYmUgdXNlZC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRVc2VyUGxheWxpc3RzID0gZnVuY3Rpb24gKHVzZXJJZCwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YTtcclxuICAgIGlmICh0eXBlb2YgdXNlcklkID09PSAnc3RyaW5nJykge1xyXG4gICAgICByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgICB1cmw6IF9iYXNlVXJpICsgJy91c2Vycy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHVzZXJJZCkgKyAnL3BsYXlsaXN0cydcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3BsYXlsaXN0cydcclxuICAgICAgfTtcclxuICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xyXG4gICAgICBvcHRpb25zID0gdXNlcklkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBhIHNwZWNpZmljIHBsYXlsaXN0LlxyXG4gICAqIFNlZSBbR2V0IGEgUGxheWxpc3RdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LXBsYXlsaXN0Lykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGxheWxpc3RJZCBUaGUgaWQgb2YgdGhlIHBsYXlsaXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHBsYXlsaXN0IGlkIChlLmcuIHNwb3RpZnk6dXNlcjp4eHh4OnBsYXlsaXN0OjxoZXJlX2lzX3RoZV9wbGF5bGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0UGxheWxpc3QgPSBmdW5jdGlvbiAocGxheWxpc3RJZCwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvcGxheWxpc3RzLycgKyBwbGF5bGlzdElkXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyB0aGUgdHJhY2tzIGZyb20gYSBzcGVjaWZpYyBwbGF5bGlzdC5cclxuICAgKiBTZWUgW0dldCBhIFBsYXlsaXN0J3MgVHJhY2tzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC1wbGF5bGlzdHMtdHJhY2tzLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGxheWxpc3RJZCBUaGUgaWQgb2YgdGhlIHBsYXlsaXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHBsYXlsaXN0IGlkIChlLmcuIHNwb3RpZnk6dXNlcjp4eHh4OnBsYXlsaXN0OjxoZXJlX2lzX3RoZV9wbGF5bGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0UGxheWxpc3RUcmFja3MgPSBmdW5jdGlvbiAoXHJcbiAgICBwbGF5bGlzdElkLFxyXG4gICAgb3B0aW9ucyxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL3BsYXlsaXN0cy8nICsgcGxheWxpc3RJZCArICcvdHJhY2tzJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgaW1hZ2UgYXNzb2NpYXRlZCB3aXRoIGEgc3BlY2lmaWMgcGxheWxpc3QuXHJcbiAgICogU2VlIFtHZXQgYSBQbGF5bGlzdCBDb3ZlciBJbWFnZV0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vZG9jdW1lbnRhdGlvbi93ZWItYXBpL3JlZmVyZW5jZS9wbGF5bGlzdHMvZ2V0LXBsYXlsaXN0LWNvdmVyLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGxheWxpc3RJZCBUaGUgaWQgb2YgdGhlIHBsYXlsaXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHBsYXlsaXN0IGlkIChlLmcuIHNwb3RpZnk6cGxheWxpc3Q6PGhlcmVfaXNfdGhlX3BsYXlsaXN0X2lkPilcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRQbGF5bGlzdENvdmVySW1hZ2UgPSBmdW5jdGlvbiAocGxheWxpc3RJZCwgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvcGxheWxpc3RzLycgKyBwbGF5bGlzdElkICsgJy9pbWFnZXMnXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIHBsYXlsaXN0IGFuZCBzdG9yZXMgaXQgaW4gdGhlIGN1cnJlbnQgdXNlcidzIGxpYnJhcnkuXHJcbiAgICogU2VlIFtDcmVhdGUgYSBQbGF5bGlzdF0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9jcmVhdGUtcGxheWxpc3QvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VySWQgVGhlIGlkIG9mIHRoZSB1c2VyLiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIGlkIChlLmcuIHNwb3RpZnk6dXNlcjo8aGVyZV9pc190aGVfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmNyZWF0ZVBsYXlsaXN0ID0gZnVuY3Rpb24gKHVzZXJJZCwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvdXNlcnMvJyArIGVuY29kZVVSSUNvbXBvbmVudCh1c2VySWQpICsgJy9wbGF5bGlzdHMnLFxyXG4gICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgIHBvc3REYXRhOiBvcHRpb25zXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2hhbmdlIGEgcGxheWxpc3QncyBuYW1lIGFuZCBwdWJsaWMvcHJpdmF0ZSBzdGF0ZVxyXG4gICAqIFNlZSBbQ2hhbmdlIGEgUGxheWxpc3QncyBEZXRhaWxzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2NoYW5nZS1wbGF5bGlzdC1kZXRhaWxzLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGxheWxpc3RJZCBUaGUgaWQgb2YgdGhlIHBsYXlsaXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHBsYXlsaXN0IGlkIChlLmcuIHNwb3RpZnk6dXNlcjp4eHh4OnBsYXlsaXN0OjxoZXJlX2lzX3RoZV9wbGF5bGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQSBKU09OIG9iamVjdCB3aXRoIHRoZSBkYXRhIHRvIHVwZGF0ZS4gRS5nLiB7bmFtZTogJ0EgbmV3IG5hbWUnLCBwdWJsaWM6IHRydWV9XHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuY2hhbmdlUGxheWxpc3REZXRhaWxzID0gZnVuY3Rpb24gKFxyXG4gICAgcGxheWxpc3RJZCxcclxuICAgIGRhdGEsXHJcbiAgICBjYWxsYmFja1xyXG4gICkge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9wbGF5bGlzdHMvJyArIHBsYXlsaXN0SWQsXHJcbiAgICAgIHR5cGU6ICdQVVQnLFxyXG4gICAgICBwb3N0RGF0YTogZGF0YVxyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgZGF0YSwgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCB0cmFja3MgdG8gYSBwbGF5bGlzdC5cclxuICAgKiBTZWUgW0FkZCBUcmFja3MgdG8gYSBQbGF5bGlzdF0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9hZGQtdHJhY2tzLXRvLXBsYXlsaXN0Lykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGxheWxpc3RJZCBUaGUgaWQgb2YgdGhlIHBsYXlsaXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHBsYXlsaXN0IGlkIChlLmcuIHNwb3RpZnk6dXNlcjp4eHh4OnBsYXlsaXN0OjxoZXJlX2lzX3RoZV9wbGF5bGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSB1cmlzIEFuIGFycmF5IG9mIFNwb3RpZnkgVVJJcyBmb3IgdGhlIHRyYWNrc1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmFkZFRyYWNrc1RvUGxheWxpc3QgPSBmdW5jdGlvbiAoXHJcbiAgICBwbGF5bGlzdElkLFxyXG4gICAgdXJpcyxcclxuICAgIG9wdGlvbnMsXHJcbiAgICBjYWxsYmFja1xyXG4gICkge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9wbGF5bGlzdHMvJyArIHBsYXlsaXN0SWQgKyAnL3RyYWNrcycsXHJcbiAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgcG9zdERhdGE6IHtcclxuICAgICAgICB1cmlzOiB1cmlzXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrLCB0cnVlKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZXBsYWNlIHRoZSB0cmFja3Mgb2YgYSBwbGF5bGlzdFxyXG4gICAqIFNlZSBbUmVwbGFjZSBhIFBsYXlsaXN0J3MgVHJhY2tzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3JlcGxhY2UtcGxheWxpc3RzLXRyYWNrcy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBsYXlsaXN0SWQgVGhlIGlkIG9mIHRoZSBwbGF5bGlzdC4gSWYgeW91IGtub3cgdGhlIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZSBwbGF5bGlzdCBpZCAoZS5nLiBzcG90aWZ5OnVzZXI6eHh4eDpwbGF5bGlzdDo8aGVyZV9pc190aGVfcGxheWxpc3RfaWQ+KVxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gdXJpcyBBbiBhcnJheSBvZiBTcG90aWZ5IFVSSXMgZm9yIHRoZSB0cmFja3NcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5yZXBsYWNlVHJhY2tzSW5QbGF5bGlzdCA9IGZ1bmN0aW9uIChcclxuICAgIHBsYXlsaXN0SWQsXHJcbiAgICB1cmlzLFxyXG4gICAgY2FsbGJhY2tcclxuICApIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvcGxheWxpc3RzLycgKyBwbGF5bGlzdElkICsgJy90cmFja3MnLFxyXG4gICAgICB0eXBlOiAnUFVUJyxcclxuICAgICAgcG9zdERhdGE6IHsgdXJpczogdXJpcyB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCB7fSwgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlb3JkZXIgdHJhY2tzIGluIGEgcGxheWxpc3RcclxuICAgKiBTZWUgW1Jlb3JkZXIgYSBQbGF5bGlzdOKAmXMgVHJhY2tzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3Jlb3JkZXItcGxheWxpc3RzLXRyYWNrcy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBsYXlsaXN0SWQgVGhlIGlkIG9mIHRoZSBwbGF5bGlzdC4gSWYgeW91IGtub3cgdGhlIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZSBwbGF5bGlzdCBpZCAoZS5nLiBzcG90aWZ5OnVzZXI6eHh4eDpwbGF5bGlzdDo8aGVyZV9pc190aGVfcGxheWxpc3RfaWQ+KVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByYW5nZVN0YXJ0IFRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3QgdHJhY2sgdG8gYmUgcmVvcmRlcmVkLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnNlcnRCZWZvcmUgVGhlIHBvc2l0aW9uIHdoZXJlIHRoZSB0cmFja3Mgc2hvdWxkIGJlIGluc2VydGVkLiBUbyByZW9yZGVyIHRoZSB0cmFja3MgdG9cclxuICAgKiB0aGUgZW5kIG9mIHRoZSBwbGF5bGlzdCwgc2ltcGx5IHNldCBpbnNlcnRfYmVmb3JlIHRvIHRoZSBwb3NpdGlvbiBhZnRlciB0aGUgbGFzdCB0cmFjay5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCBvcHRpb25hbCBwYXJhbWV0ZXJzIChyYW5nZV9sZW5ndGgsIHNuYXBzaG90X2lkKVxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnJlb3JkZXJUcmFja3NJblBsYXlsaXN0ID0gZnVuY3Rpb24gKFxyXG4gICAgcGxheWxpc3RJZCxcclxuICAgIHJhbmdlU3RhcnQsXHJcbiAgICBpbnNlcnRCZWZvcmUsXHJcbiAgICBvcHRpb25zLFxyXG4gICAgY2FsbGJhY2tcclxuICApIHtcclxuICAgIC8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9wbGF5bGlzdHMvJyArIHBsYXlsaXN0SWQgKyAnL3RyYWNrcycsXHJcbiAgICAgIHR5cGU6ICdQVVQnLFxyXG4gICAgICBwb3N0RGF0YToge1xyXG4gICAgICAgIHJhbmdlX3N0YXJ0OiByYW5nZVN0YXJ0LFxyXG4gICAgICAgIGluc2VydF9iZWZvcmU6IGluc2VydEJlZm9yZVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyogZXNsaW50LWVuYWJsZSBjYW1lbGNhc2UgKi9cclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSB0cmFja3MgZnJvbSBhIHBsYXlsaXN0XHJcbiAgICogU2VlIFtSZW1vdmUgVHJhY2tzIGZyb20gYSBQbGF5bGlzdF0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9yZW1vdmUtdHJhY2tzLXBsYXlsaXN0Lykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGxheWxpc3RJZCBUaGUgaWQgb2YgdGhlIHBsYXlsaXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHBsYXlsaXN0IGlkIChlLmcuIHNwb3RpZnk6dXNlcjp4eHh4OnBsYXlsaXN0OjxoZXJlX2lzX3RoZV9wbGF5bGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSB1cmlzIEFuIGFycmF5IG9mIHRyYWNrcyB0byBiZSByZW1vdmVkLiBFYWNoIGVsZW1lbnQgb2YgdGhlIGFycmF5IGNhbiBiZSBlaXRoZXIgYVxyXG4gICAqIHN0cmluZywgaW4gd2hpY2ggY2FzZSBpdCBpcyB0cmVhdGVkIGFzIGEgVVJJLCBvciBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgcHJvcGVydGllcyBgdXJpYCAod2hpY2ggaXMgYVxyXG4gICAqIHN0cmluZykgYW5kIGBwb3NpdGlvbnNgICh3aGljaCBpcyBhbiBhcnJheSBvZiBpbnRlZ2VycykuXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUucmVtb3ZlVHJhY2tzRnJvbVBsYXlsaXN0ID0gZnVuY3Rpb24gKFxyXG4gICAgcGxheWxpc3RJZCxcclxuICAgIHVyaXMsXHJcbiAgICBjYWxsYmFja1xyXG4gICkge1xyXG4gICAgdmFyIGRhdGFUb0JlU2VudCA9IHVyaXMubWFwKGZ1bmN0aW9uICh1cmkpIHtcclxuICAgICAgaWYgKHR5cGVvZiB1cmkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgdXJpOiB1cmkgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdXJpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL3BsYXlsaXN0cy8nICsgcGxheWxpc3RJZCArICcvdHJhY2tzJyxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIHBvc3REYXRhOiB7IHRyYWNrczogZGF0YVRvQmVTZW50IH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIHt9LCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIHRyYWNrcyBmcm9tIGEgcGxheWxpc3QsIHNwZWNpZnlpbmcgYSBzbmFwc2hvdCBpZC5cclxuICAgKiBTZWUgW1JlbW92ZSBUcmFja3MgZnJvbSBhIFBsYXlsaXN0XShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3JlbW92ZS10cmFja3MtcGxheWxpc3QvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwbGF5bGlzdElkIFRoZSBpZCBvZiB0aGUgcGxheWxpc3QuIElmIHlvdSBrbm93IHRoZSBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGUgcGxheWxpc3QgaWQgKGUuZy4gc3BvdGlmeTp1c2VyOnh4eHg6cGxheWxpc3Q6PGhlcmVfaXNfdGhlX3BsYXlsaXN0X2lkPilcclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHVyaXMgQW4gYXJyYXkgb2YgdHJhY2tzIHRvIGJlIHJlbW92ZWQuIEVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXkgY2FuIGJlIGVpdGhlciBhXHJcbiAgICogc3RyaW5nLCBpbiB3aGljaCBjYXNlIGl0IGlzIHRyZWF0ZWQgYXMgYSBVUkksIG9yIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBwcm9wZXJ0aWVzIGB1cmlgICh3aGljaCBpcyBhXHJcbiAgICogc3RyaW5nKSBhbmQgYHBvc2l0aW9uc2AgKHdoaWNoIGlzIGFuIGFycmF5IG9mIGludGVnZXJzKS5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc25hcHNob3RJZCBUaGUgcGxheWxpc3QncyBzbmFwc2hvdCBJRCBhZ2FpbnN0IHdoaWNoIHlvdSB3YW50IHRvIG1ha2UgdGhlIGNoYW5nZXNcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5yZW1vdmVUcmFja3NGcm9tUGxheWxpc3RXaXRoU25hcHNob3RJZCA9IGZ1bmN0aW9uIChcclxuICAgIHBsYXlsaXN0SWQsXHJcbiAgICB1cmlzLFxyXG4gICAgc25hcHNob3RJZCxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICB2YXIgZGF0YVRvQmVTZW50ID0gdXJpcy5tYXAoZnVuY3Rpb24gKHVyaSkge1xyXG4gICAgICBpZiAodHlwZW9mIHVyaSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4geyB1cmk6IHVyaSB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL3BsYXlsaXN0cy8nICsgcGxheWxpc3RJZCArICcvdHJhY2tzJyxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIHBvc3REYXRhOiB7XHJcbiAgICAgICAgdHJhY2tzOiBkYXRhVG9CZVNlbnQsXHJcbiAgICAgICAgc25hcHNob3RfaWQ6IHNuYXBzaG90SWRcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qIGVzbGludC1lbmFibGUgY2FtZWxjYXNlICovXHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIHt9LCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIHRyYWNrcyBmcm9tIGEgcGxheWxpc3QsIHNwZWNpZnlpbmcgdGhlIHBvc2l0aW9ucyBvZiB0aGUgdHJhY2tzIHRvIGJlIHJlbW92ZWQuXHJcbiAgICogU2VlIFtSZW1vdmUgVHJhY2tzIGZyb20gYSBQbGF5bGlzdF0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9yZW1vdmUtdHJhY2tzLXBsYXlsaXN0Lykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGxheWxpc3RJZCBUaGUgaWQgb2YgdGhlIHBsYXlsaXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHBsYXlsaXN0IGlkIChlLmcuIHNwb3RpZnk6dXNlcjp4eHh4OnBsYXlsaXN0OjxoZXJlX2lzX3RoZV9wbGF5bGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSBwb3NpdGlvbnMgYXJyYXkgb2YgaW50ZWdlcnMgY29udGFpbmluZyB0aGUgcG9zaXRpb25zIG9mIHRoZSB0cmFja3MgdG8gcmVtb3ZlXHJcbiAgICogZnJvbSB0aGUgcGxheWxpc3QuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNuYXBzaG90SWQgVGhlIHBsYXlsaXN0J3Mgc25hcHNob3QgSUQgYWdhaW5zdCB3aGljaCB5b3Ugd2FudCB0byBtYWtlIHRoZSBjaGFuZ2VzXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUucmVtb3ZlVHJhY2tzRnJvbVBsYXlsaXN0SW5Qb3NpdGlvbnMgPSBmdW5jdGlvbiAoXHJcbiAgICBwbGF5bGlzdElkLFxyXG4gICAgcG9zaXRpb25zLFxyXG4gICAgc25hcHNob3RJZCxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvcGxheWxpc3RzLycgKyBwbGF5bGlzdElkICsgJy90cmFja3MnLFxyXG4gICAgICB0eXBlOiAnREVMRVRFJyxcclxuICAgICAgcG9zdERhdGE6IHtcclxuICAgICAgICBwb3NpdGlvbnM6IHBvc2l0aW9ucyxcclxuICAgICAgICBzbmFwc2hvdF9pZDogc25hcHNob3RJZFxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyogZXNsaW50LWVuYWJsZSBjYW1lbGNhc2UgKi9cclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwge30sIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBVcGxvYWQgYSBjdXN0b20gcGxheWxpc3QgY292ZXIgaW1hZ2UuXHJcbiAgICogU2VlIFtVcGxvYWQgQSBDdXN0b20gUGxheWxpc3QgQ292ZXIgSW1hZ2VdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvdXBsb2FkLWEtY3VzdG9tLXBsYXlsaXN0LWNvdmVyLWltYWdlLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGxheWxpc3RJZCBUaGUgaWQgb2YgdGhlIHBsYXlsaXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHBsYXlsaXN0IGlkIChlLmcuIHNwb3RpZnk6dXNlcjp4eHh4OnBsYXlsaXN0OjxoZXJlX2lzX3RoZV9wbGF5bGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGltYWdlRGF0YSBCYXNlNjQgZW5jb2RlZCBKUEVHIGltYWdlIGRhdGEsIG1heGltdW0gcGF5bG9hZCBzaXplIGlzIDI1NiBLQi5cclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS51cGxvYWRDdXN0b21QbGF5bGlzdENvdmVySW1hZ2UgPSBmdW5jdGlvbiAoXHJcbiAgICBwbGF5bGlzdElkLFxyXG4gICAgaW1hZ2VEYXRhLFxyXG4gICAgY2FsbGJhY2tcclxuICApIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvcGxheWxpc3RzLycgKyBwbGF5bGlzdElkICsgJy9pbWFnZXMnLFxyXG4gICAgICB0eXBlOiAnUFVUJyxcclxuICAgICAgcG9zdERhdGE6IGltYWdlRGF0YS5yZXBsYWNlKC9eZGF0YTppbWFnZVxcL2pwZWc7YmFzZTY0LC8sICcnKSxcclxuICAgICAgY29udGVudFR5cGU6ICdpbWFnZS9qcGVnJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwge30sIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIGFuIGFsYnVtIGZyb20gdGhlIFNwb3RpZnkgY2F0YWxvZy5cclxuICAgKiBTZWUgW0dldCBhbiBBbGJ1bV0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtYWxidW0vKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGJ1bUlkIFRoZSBpZCBvZiB0aGUgYWxidW0uIElmIHlvdSBrbm93IHRoZSBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGUgYWxidW0gaWQgKGUuZy4gc3BvdGlmeTphbGJ1bTo8aGVyZV9pc190aGVfYWxidW1faWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEFsYnVtID0gZnVuY3Rpb24gKGFsYnVtSWQsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL2FsYnVtcy8nICsgYWxidW1JZFxyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgdGhlIHRyYWNrcyBvZiBhbiBhbGJ1bSBmcm9tIHRoZSBTcG90aWZ5IGNhdGFsb2cuXHJcbiAgICogU2VlIFtHZXQgYW4gQWxidW0ncyBUcmFja3NdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LWFsYnVtcy10cmFja3MvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGJ1bUlkIFRoZSBpZCBvZiB0aGUgYWxidW0uIElmIHlvdSBrbm93IHRoZSBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGUgYWxidW0gaWQgKGUuZy4gc3BvdGlmeTphbGJ1bTo8aGVyZV9pc190aGVfYWxidW1faWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEFsYnVtVHJhY2tzID0gZnVuY3Rpb24gKGFsYnVtSWQsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL2FsYnVtcy8nICsgYWxidW1JZCArICcvdHJhY2tzJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgbXVsdGlwbGUgYWxidW1zIGZyb20gdGhlIFNwb3RpZnkgY2F0YWxvZy5cclxuICAgKiBTZWUgW0dldCBTZXZlcmFsIEFsYnVtc10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtc2V2ZXJhbC1hbGJ1bXMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gYWxidW1JZHMgVGhlIGlkcyBvZiB0aGUgYWxidW1zLiBJZiB5b3Uga25vdyB0aGVpciBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGVpciBhbGJ1bSBpZCAoZS5nLiBzcG90aWZ5OmFsYnVtOjxoZXJlX2lzX3RoZV9hbGJ1bV9pZD4pXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0QWxidW1zID0gZnVuY3Rpb24gKGFsYnVtSWRzLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9hbGJ1bXMvJyxcclxuICAgICAgcGFyYW1zOiB7IGlkczogYWxidW1JZHMuam9pbignLCcpIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIGEgdHJhY2sgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nLlxyXG4gICAqIFNlZSBbR2V0IGEgVHJhY2tdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LXRyYWNrLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJhY2tJZCBUaGUgaWQgb2YgdGhlIHRyYWNrLiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIHRyYWNrIGlkIChlLmcuIHNwb3RpZnk6dHJhY2s6PGhlcmVfaXNfdGhlX3RyYWNrX2lkPilcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRUcmFjayA9IGZ1bmN0aW9uICh0cmFja0lkLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge307XHJcbiAgICByZXF1ZXN0RGF0YS51cmwgPSBfYmFzZVVyaSArICcvdHJhY2tzLycgKyB0cmFja0lkO1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBtdWx0aXBsZSB0cmFja3MgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nLlxyXG4gICAqIFNlZSBbR2V0IFNldmVyYWwgVHJhY2tzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC1zZXZlcmFsLXRyYWNrcy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSB0cmFja0lkcyBUaGUgaWRzIG9mIHRoZSB0cmFja3MuIElmIHlvdSBrbm93IHRoZWlyIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZWlyIHRyYWNrIGlkIChlLmcuIHNwb3RpZnk6dHJhY2s6PGhlcmVfaXNfdGhlX3RyYWNrX2lkPilcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRUcmFja3MgPSBmdW5jdGlvbiAodHJhY2tJZHMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL3RyYWNrcy8nLFxyXG4gICAgICBwYXJhbXM6IHsgaWRzOiB0cmFja0lkcy5qb2luKCcsJykgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgYW4gYXJ0aXN0IGZyb20gdGhlIFNwb3RpZnkgY2F0YWxvZy5cclxuICAgKiBTZWUgW0dldCBhbiBBcnRpc3RdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LWFydGlzdC8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFydGlzdElkIFRoZSBpZCBvZiB0aGUgYXJ0aXN0LiBJZiB5b3Uga25vdyB0aGUgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlIGFydGlzdCBpZCAoZS5nLiBzcG90aWZ5OmFydGlzdDo8aGVyZV9pc190aGVfYXJ0aXN0X2lkPilcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRBcnRpc3QgPSBmdW5jdGlvbiAoYXJ0aXN0SWQsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL2FydGlzdHMvJyArIGFydGlzdElkXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBtdWx0aXBsZSBhcnRpc3RzIGZyb20gdGhlIFNwb3RpZnkgY2F0YWxvZy5cclxuICAgKiBTZWUgW0dldCBTZXZlcmFsIEFydGlzdHNdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LXNldmVyYWwtYXJ0aXN0cy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBhcnRpc3RJZHMgVGhlIGlkcyBvZiB0aGUgYXJ0aXN0cy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlaXIgYXJ0aXN0IGlkIChlLmcuIHNwb3RpZnk6YXJ0aXN0OjxoZXJlX2lzX3RoZV9hcnRpc3RfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEFydGlzdHMgPSBmdW5jdGlvbiAoYXJ0aXN0SWRzLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9hcnRpc3RzLycsXHJcbiAgICAgIHBhcmFtczogeyBpZHM6IGFydGlzdElkcy5qb2luKCcsJykgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgdGhlIGFsYnVtcyBvZiBhbiBhcnRpc3QgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nLlxyXG4gICAqIFNlZSBbR2V0IGFuIEFydGlzdCdzIEFsYnVtc10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtYXJ0aXN0cy1hbGJ1bXMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcnRpc3RJZCBUaGUgaWQgb2YgdGhlIGFydGlzdC4gSWYgeW91IGtub3cgdGhlIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZSBhcnRpc3QgaWQgKGUuZy4gc3BvdGlmeTphcnRpc3Q6PGhlcmVfaXNfdGhlX2FydGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0QXJ0aXN0QWxidW1zID0gZnVuY3Rpb24gKGFydGlzdElkLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9hcnRpc3RzLycgKyBhcnRpc3RJZCArICcvYWxidW1zJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgYSBsaXN0IG9mIHRvcCB0cmFja3Mgb2YgYW4gYXJ0aXN0IGZyb20gdGhlIFNwb3RpZnkgY2F0YWxvZywgZm9yIGEgc3BlY2lmaWMgY291bnRyeS5cclxuICAgKiBTZWUgW0dldCBhbiBBcnRpc3QncyBUb3AgVHJhY2tzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC1hcnRpc3RzLXRvcC10cmFja3MvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcnRpc3RJZCBUaGUgaWQgb2YgdGhlIGFydGlzdC4gSWYgeW91IGtub3cgdGhlIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZSBhcnRpc3QgaWQgKGUuZy4gc3BvdGlmeTphcnRpc3Q6PGhlcmVfaXNfdGhlX2FydGlzdF9pZD4pXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvdW50cnlJZCBUaGUgaWQgb2YgdGhlIGNvdW50cnkgKGUuZy4gRVMgZm9yIFNwYWluIG9yIFVTIGZvciBVbml0ZWQgU3RhdGVzKVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEFydGlzdFRvcFRyYWNrcyA9IGZ1bmN0aW9uIChcclxuICAgIGFydGlzdElkLFxyXG4gICAgY291bnRyeUlkLFxyXG4gICAgb3B0aW9ucyxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL2FydGlzdHMvJyArIGFydGlzdElkICsgJy90b3AtdHJhY2tzJyxcclxuICAgICAgcGFyYW1zOiB7IGNvdW50cnk6IGNvdW50cnlJZCB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBhIGxpc3Qgb2YgYXJ0aXN0cyByZWxhdGVkIHdpdGggYSBnaXZlbiBvbmUgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nLlxyXG4gICAqIFNlZSBbR2V0IGFuIEFydGlzdCdzIFJlbGF0ZWQgQXJ0aXN0c10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtcmVsYXRlZC1hcnRpc3RzLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXJ0aXN0SWQgVGhlIGlkIG9mIHRoZSBhcnRpc3QuIElmIHlvdSBrbm93IHRoZSBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGUgYXJ0aXN0IGlkIChlLmcuIHNwb3RpZnk6YXJ0aXN0OjxoZXJlX2lzX3RoZV9hcnRpc3RfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEFydGlzdFJlbGF0ZWRBcnRpc3RzID0gZnVuY3Rpb24gKFxyXG4gICAgYXJ0aXN0SWQsXHJcbiAgICBvcHRpb25zLFxyXG4gICAgY2FsbGJhY2tcclxuICApIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvYXJ0aXN0cy8nICsgYXJ0aXN0SWQgKyAnL3JlbGF0ZWQtYXJ0aXN0cydcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIGEgbGlzdCBvZiBTcG90aWZ5IGZlYXR1cmVkIHBsYXlsaXN0cyAoc2hvd24sIGZvciBleGFtcGxlLCBvbiBhIFNwb3RpZnkgcGxheWVyJ3MgXCJCcm93c2VcIiB0YWIpLlxyXG4gICAqIFNlZSBbR2V0IGEgTGlzdCBvZiBGZWF0dXJlZCBQbGF5bGlzdHNdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LWxpc3QtZmVhdHVyZWQtcGxheWxpc3RzLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRGZWF0dXJlZFBsYXlsaXN0cyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9icm93c2UvZmVhdHVyZWQtcGxheWxpc3RzJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgYSBsaXN0IG9mIG5ldyBhbGJ1bSByZWxlYXNlcyBmZWF0dXJlZCBpbiBTcG90aWZ5IChzaG93biwgZm9yIGV4YW1wbGUsIG9uIGEgU3BvdGlmeSBwbGF5ZXIncyBcIkJyb3dzZVwiIHRhYikuXHJcbiAgICogU2VlIFtHZXQgYSBMaXN0IG9mIE5ldyBSZWxlYXNlc10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtbGlzdC1uZXctcmVsZWFzZXMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldE5ld1JlbGVhc2VzID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL2Jyb3dzZS9uZXctcmVsZWFzZXMnXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGEgbGlzdCBvZiBjYXRlZ29yaWVzIHVzZWQgdG8gdGFnIGl0ZW1zIGluIFNwb3RpZnkgKG9uLCBmb3IgZXhhbXBsZSwgdGhlIFNwb3RpZnkgcGxheWVyJ3MgXCJCcm93c2VcIiB0YWIpLlxyXG4gICAqIFNlZSBbR2V0IGEgTGlzdCBvZiBDYXRlZ29yaWVzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC1saXN0LWNhdGVnb3JpZXMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldENhdGVnb3JpZXMgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvYnJvd3NlL2NhdGVnb3JpZXMnXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGEgc2luZ2xlIGNhdGVnb3J5IHVzZWQgdG8gdGFnIGl0ZW1zIGluIFNwb3RpZnkgKG9uLCBmb3IgZXhhbXBsZSwgdGhlIFNwb3RpZnkgcGxheWVyJ3MgXCJCcm93c2VcIiB0YWIpLlxyXG4gICAqIFNlZSBbR2V0IGEgQ2F0ZWdvcnldKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LWNhdGVnb3J5Lykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2F0ZWdvcnlJZCBUaGUgaWQgb2YgdGhlIGNhdGVnb3J5LiBUaGVzZSBjYW4gYmUgZm91bmQgd2l0aCB0aGUgZ2V0Q2F0ZWdvcmllcyBmdW5jdGlvblxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldENhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5SWQsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL2Jyb3dzZS9jYXRlZ29yaWVzLycgKyBjYXRlZ29yeUlkXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGEgbGlzdCBvZiBTcG90aWZ5IHBsYXlsaXN0cyB0YWdnZWQgd2l0aCBhIHBhcnRpY3VsYXIgY2F0ZWdvcnkuXHJcbiAgICogU2VlIFtHZXQgYSBDYXRlZ29yeSdzIFBsYXlsaXN0c10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtY2F0ZWdvcnlzLXBsYXlsaXN0cy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhdGVnb3J5SWQgVGhlIGlkIG9mIHRoZSBjYXRlZ29yeS4gVGhlc2UgY2FuIGJlIGZvdW5kIHdpdGggdGhlIGdldENhdGVnb3JpZXMgZnVuY3Rpb25cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRDYXRlZ29yeVBsYXlsaXN0cyA9IGZ1bmN0aW9uIChcclxuICAgIGNhdGVnb3J5SWQsXHJcbiAgICBvcHRpb25zLFxyXG4gICAgY2FsbGJhY2tcclxuICApIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvYnJvd3NlL2NhdGVnb3JpZXMvJyArIGNhdGVnb3J5SWQgKyAnL3BsYXlsaXN0cydcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgU3BvdGlmeSBjYXRhbG9nIGluZm9ybWF0aW9uIGFib3V0IGFydGlzdHMsIGFsYnVtcywgdHJhY2tzIG9yIHBsYXlsaXN0cyB0aGF0IG1hdGNoIGEga2V5d29yZCBzdHJpbmcuXHJcbiAgICogU2VlIFtTZWFyY2ggZm9yIGFuIEl0ZW1dKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvc2VhcmNoLWl0ZW0vKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeSBUaGUgc2VhcmNoIHF1ZXJ5XHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSB0eXBlcyBBbiBhcnJheSBvZiBpdGVtIHR5cGVzIHRvIHNlYXJjaCBhY3Jvc3MuXHJcbiAgICogVmFsaWQgdHlwZXMgYXJlOiAnYWxidW0nLCAnYXJ0aXN0JywgJ3BsYXlsaXN0JywgYW5kICd0cmFjaycuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuc2VhcmNoID0gZnVuY3Rpb24gKHF1ZXJ5LCB0eXBlcywgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvc2VhcmNoLycsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIHE6IHF1ZXJ5LFxyXG4gICAgICAgIHR5cGU6IHR5cGVzLmpvaW4oJywnKVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBhbGJ1bXMgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nIGFjY29yZGluZyB0byBhIHF1ZXJ5LlxyXG4gICAqIFNlZSBbU2VhcmNoIGZvciBhbiBJdGVtXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3NlYXJjaC1pdGVtLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnkgVGhlIHNlYXJjaCBxdWVyeVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnNlYXJjaEFsYnVtcyA9IGZ1bmN0aW9uIChxdWVyeSwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiB0aGlzLnNlYXJjaChxdWVyeSwgWydhbGJ1bSddLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBhcnRpc3RzIGZyb20gdGhlIFNwb3RpZnkgY2F0YWxvZyBhY2NvcmRpbmcgdG8gYSBxdWVyeS5cclxuICAgKiBTZWUgW1NlYXJjaCBmb3IgYW4gSXRlbV0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9zZWFyY2gtaXRlbS8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5IFRoZSBzZWFyY2ggcXVlcnlcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5zZWFyY2hBcnRpc3RzID0gZnVuY3Rpb24gKHF1ZXJ5LCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIHRoaXMuc2VhcmNoKHF1ZXJ5LCBbJ2FydGlzdCddLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyB0cmFja3MgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nIGFjY29yZGluZyB0byBhIHF1ZXJ5LlxyXG4gICAqIFNlZSBbU2VhcmNoIGZvciBhbiBJdGVtXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3NlYXJjaC1pdGVtLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnkgVGhlIHNlYXJjaCBxdWVyeVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnNlYXJjaFRyYWNrcyA9IGZ1bmN0aW9uIChxdWVyeSwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiB0aGlzLnNlYXJjaChxdWVyeSwgWyd0cmFjayddLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBwbGF5bGlzdHMgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nIGFjY29yZGluZyB0byBhIHF1ZXJ5LlxyXG4gICAqIFNlZSBbU2VhcmNoIGZvciBhbiBJdGVtXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3NlYXJjaC1pdGVtLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnkgVGhlIHNlYXJjaCBxdWVyeVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnNlYXJjaFBsYXlsaXN0cyA9IGZ1bmN0aW9uIChxdWVyeSwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiB0aGlzLnNlYXJjaChxdWVyeSwgWydwbGF5bGlzdCddLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBzaG93cyBmcm9tIHRoZSBTcG90aWZ5IGNhdGFsb2cgYWNjb3JkaW5nIHRvIGEgcXVlcnkuXHJcbiAgICogU2VlIFtTZWFyY2ggZm9yIGFuIEl0ZW1dKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvc2VhcmNoLWl0ZW0vKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeSBUaGUgc2VhcmNoIHF1ZXJ5XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuc2VhcmNoU2hvd3MgPSBmdW5jdGlvbiAocXVlcnksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWFyY2gocXVlcnksIFsnc2hvdyddLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBlcGlzb2RlcyBmcm9tIHRoZSBTcG90aWZ5IGNhdGFsb2cgYWNjb3JkaW5nIHRvIGEgcXVlcnkuXHJcbiAgICogU2VlIFtTZWFyY2ggZm9yIGFuIEl0ZW1dKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvc2VhcmNoLWl0ZW0vKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeSBUaGUgc2VhcmNoIHF1ZXJ5XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuc2VhcmNoRXBpc29kZXMgPSBmdW5jdGlvbiAocXVlcnksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWFyY2gocXVlcnksIFsnZXBpc29kZSddLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGF1ZGlvIGZlYXR1cmVzIGZvciBhIHNpbmdsZSB0cmFjayBpZGVudGlmaWVkIGJ5IGl0cyB1bmlxdWUgU3BvdGlmeSBJRC5cclxuICAgKiBTZWUgW0dldCBBdWRpbyBGZWF0dXJlcyBmb3IgYSBUcmFja10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtYXVkaW8tZmVhdHVyZXMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmFja0lkIFRoZSBpZCBvZiB0aGUgdHJhY2suIElmIHlvdSBrbm93IHRoZSBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGUgdHJhY2sgaWQgKGUuZy4gc3BvdGlmeTp0cmFjazo8aGVyZV9pc190aGVfdHJhY2tfaWQ+KVxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEF1ZGlvRmVhdHVyZXNGb3JUcmFjayA9IGZ1bmN0aW9uICh0cmFja0lkLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge307XHJcbiAgICByZXF1ZXN0RGF0YS51cmwgPSBfYmFzZVVyaSArICcvYXVkaW8tZmVhdHVyZXMvJyArIHRyYWNrSWQ7XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIHt9LCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGF1ZGlvIGZlYXR1cmVzIGZvciBtdWx0aXBsZSB0cmFja3MgYmFzZWQgb24gdGhlaXIgU3BvdGlmeSBJRHMuXHJcbiAgICogU2VlIFtHZXQgQXVkaW8gRmVhdHVyZXMgZm9yIFNldmVyYWwgVHJhY2tzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC1zZXZlcmFsLWF1ZGlvLWZlYXR1cmVzLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IHRyYWNrSWRzIFRoZSBpZHMgb2YgdGhlIHRyYWNrcy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlaXIgdHJhY2sgaWQgKGUuZy4gc3BvdGlmeTp0cmFjazo8aGVyZV9pc190aGVfdHJhY2tfaWQ+KVxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEF1ZGlvRmVhdHVyZXNGb3JUcmFja3MgPSBmdW5jdGlvbiAodHJhY2tJZHMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL2F1ZGlvLWZlYXR1cmVzJyxcclxuICAgICAgcGFyYW1zOiB7IGlkczogdHJhY2tJZHMgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwge30sIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgYXVkaW8gYW5hbHlzaXMgZm9yIGEgc2luZ2xlIHRyYWNrIGlkZW50aWZpZWQgYnkgaXRzIHVuaXF1ZSBTcG90aWZ5IElELlxyXG4gICAqIFNlZSBbR2V0IEF1ZGlvIEFuYWx5c2lzIGZvciBhIFRyYWNrXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC1hdWRpby1hbmFseXNpcy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyYWNrSWQgVGhlIGlkIG9mIHRoZSB0cmFjay4gSWYgeW91IGtub3cgdGhlIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZSB0cmFjayBpZCAoZS5nLiBzcG90aWZ5OnRyYWNrOjxoZXJlX2lzX3RoZV90cmFja19pZD4pXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0QXVkaW9BbmFseXNpc0ZvclRyYWNrID0gZnVuY3Rpb24gKHRyYWNrSWQsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7fTtcclxuICAgIHJlcXVlc3REYXRhLnVybCA9IF9iYXNlVXJpICsgJy9hdWRpby1hbmFseXNpcy8nICsgdHJhY2tJZDtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwge30sIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBwbGF5bGlzdC1zdHlsZSBsaXN0ZW5pbmcgZXhwZXJpZW5jZSBiYXNlZCBvbiBzZWVkIGFydGlzdHMsIHRyYWNrcyBhbmQgZ2VucmVzLlxyXG4gICAqIFNlZSBbR2V0IFJlY29tbWVuZGF0aW9ucyBCYXNlZCBvbiBTZWVkc10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtcmVjb21tZW5kYXRpb25zLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWRcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRSZWNvbW1lbmRhdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvcmVjb21tZW5kYXRpb25zJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlIGEgbGlzdCBvZiBhdmFpbGFibGUgZ2VucmVzIHNlZWQgcGFyYW1ldGVyIHZhbHVlcyBmb3IgcmVjb21tZW5kYXRpb25zLlxyXG4gICAqIFNlZSBbQXZhaWxhYmxlIEdlbnJlIFNlZWRzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC1yZWNvbW1lbmRhdGlvbnMvI2F2YWlsYWJsZS1nZW5yZS1zZWVkcykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRBdmFpbGFibGVHZW5yZVNlZWRzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL3JlY29tbWVuZGF0aW9ucy9hdmFpbGFibGUtZ2VucmUtc2VlZHMnXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCB7fSwgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhIHVzZXLigJlzIGF2YWlsYWJsZSBkZXZpY2VzLlxyXG4gICAqIFNlZSBbR2V0IGEgVXNlcuKAmXMgQXZhaWxhYmxlIERldmljZXNdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvZ2V0LWEtdXNlcnMtYXZhaWxhYmxlLWRldmljZXMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldE15RGV2aWNlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9wbGF5ZXIvZGV2aWNlcydcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIHt9LCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IHRoZSB1c2Vy4oCZcyBjdXJyZW50IHBsYXliYWNrIHN0YXRlLCBpbmNsdWRpbmcgdHJhY2ssIHRyYWNrIHByb2dyZXNzLCBhbmQgYWN0aXZlIGRldmljZS5cclxuICAgKiBTZWUgW0dldCBJbmZvcm1hdGlvbiBBYm91dCBUaGUgVXNlcuKAmXMgQ3VycmVudCBQbGF5YmFja10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9nZXQtaW5mb3JtYXRpb24tYWJvdXQtdGhlLXVzZXJzLWN1cnJlbnQtcGxheWJhY2svKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZC5cclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRNeUN1cnJlbnRQbGF5YmFja1N0YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3BsYXllcidcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIG9iamVjdCBjdXJyZW50bHkgYmVpbmcgcGxheWVkIG9uIHRoZSB1c2Vy4oCZcyBTcG90aWZ5IGFjY291bnQuXHJcbiAgICogU2VlIFtHZXQgdGhlIFVzZXLigJlzIEN1cnJlbnRseSBQbGF5aW5nIFRyYWNrXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL2dldC10aGUtdXNlcnMtY3VycmVudGx5LXBsYXlpbmctdHJhY2svKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZC5cclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRNeUN1cnJlbnRQbGF5aW5nVHJhY2sgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvbWUvcGxheWVyL2N1cnJlbnRseS1wbGF5aW5nJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYW5zZmVyIHBsYXliYWNrIHRvIGEgbmV3IGRldmljZSBhbmQgZGV0ZXJtaW5lIGlmIGl0IHNob3VsZCBzdGFydCBwbGF5aW5nLlxyXG4gICAqIFNlZSBbVHJhbnNmZXIgYSBVc2Vy4oCZcyBQbGF5YmFja10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS90cmFuc2Zlci1hLXVzZXJzLXBsYXliYWNrLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGRldmljZUlkcyBBIEpTT04gYXJyYXkgY29udGFpbmluZyB0aGUgSUQgb2YgdGhlIGRldmljZSBvbiB3aGljaCBwbGF5YmFjayBzaG91bGQgYmUgc3RhcnRlZC90cmFuc2ZlcnJlZC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWQuXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUudHJhbnNmZXJNeVBsYXliYWNrID0gZnVuY3Rpb24gKFxyXG4gICAgZGV2aWNlSWRzLFxyXG4gICAgb3B0aW9ucyxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICB2YXIgcG9zdERhdGEgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgcG9zdERhdGEuZGV2aWNlX2lkcyA9IGRldmljZUlkcztcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdHlwZTogJ1BVVCcsXHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3BsYXllcicsXHJcbiAgICAgIHBvc3REYXRhOiBwb3N0RGF0YVxyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFBsYXkgYSB0cmFjayBvbiB0aGUgdXNlcidzIGFjdGl2ZSBkZXZpY2VcclxuICAgKiBTZWUgW1N0YXJ0L1Jlc3VtZSBhIFVzZXIncyBQbGF5YmFja10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vZG9jdW1lbnRhdGlvbi93ZWItYXBpL3JlZmVyZW5jZS9wbGF5ZXIvc3RhcnQtYS11c2Vycy1wbGF5YmFjay8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkLlxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgdmFyIHBhcmFtcyA9XHJcbiAgICAgICdkZXZpY2VfaWQnIGluIG9wdGlvbnMgPyB7IGRldmljZV9pZDogb3B0aW9ucy5kZXZpY2VfaWQgfSA6IG51bGw7XHJcbiAgICB2YXIgcG9zdERhdGEgPSB7fTtcclxuICAgIFsnY29udGV4dF91cmknLCAndXJpcycsICdvZmZzZXQnLCAncG9zaXRpb25fbXMnXS5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICBpZiAoZmllbGQgaW4gb3B0aW9ucykge1xyXG4gICAgICAgIHBvc3REYXRhW2ZpZWxkXSA9IG9wdGlvbnNbZmllbGRdO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdHlwZTogJ1BVVCcsXHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3BsYXllci9wbGF5JyxcclxuICAgICAgcGFyYW1zOiBwYXJhbXMsXHJcbiAgICAgIHBvc3REYXRhOiBwb3N0RGF0YVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBuZWVkIHRvIGNsZWFyIG9wdGlvbnMgc28gaXQgZG9lc24ndCBhZGQgYWxsIG9mIHRoZW0gdG8gdGhlIHF1ZXJ5IHBhcmFtc1xyXG4gICAgdmFyIG5ld09wdGlvbnMgPSB0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMgOiB7fTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgbmV3T3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBhbiBpdGVtIHRvIHRoZSBlbmQgb2YgdGhlIHVzZXLigJlzIGN1cnJlbnQgcGxheWJhY2sgcXVldWUuXHJcbiAgICogU2VlIFtBZGQgYW4gSXRlbSB0byB0aGUgVXNlcidzIFBsYXliYWNrIFF1ZXVlXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS9kb2N1bWVudGF0aW9uL3dlYi1hcGkvcmVmZXJlbmNlL3BsYXllci9hZGQtdG8tcXVldWUvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJpIFRoZSB1cmkgb2YgdGhlIGl0ZW0gdG8gYWRkIHRvIHRoZSBxdWV1ZS4gTXVzdCBiZSBhIHRyYWNrIG9yIGFuIGVwaXNvZGUgdXJpLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZC5cclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5xdWV1ZSA9IGZ1bmN0aW9uICh1cmksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHZhciBwYXJhbXMgPVxyXG4gICAgICAnZGV2aWNlX2lkJyBpbiBvcHRpb25zXHJcbiAgICAgICAgPyB7IHVyaTogdXJpLCBkZXZpY2VfaWQ6IG9wdGlvbnMuZGV2aWNlX2lkIH1cclxuICAgICAgICA6IHsgdXJpOiB1cmkgfTtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9wbGF5ZXIvcXVldWUnLFxyXG4gICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhdXNlIHBsYXliYWNrIG9uIHRoZSB1c2Vy4oCZcyBhY2NvdW50LlxyXG4gICAqIFNlZSBbUGF1c2UgYSBVc2Vy4oCZcyBQbGF5YmFja10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9wYXVzZS1hLXVzZXJzLXBsYXliYWNrLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWQuXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgdmFyIHBhcmFtcyA9XHJcbiAgICAgICdkZXZpY2VfaWQnIGluIG9wdGlvbnMgPyB7IGRldmljZV9pZDogb3B0aW9ucy5kZXZpY2VfaWQgfSA6IG51bGw7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHR5cGU6ICdQVVQnLFxyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9wbGF5ZXIvcGF1c2UnLFxyXG4gICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNraXBzIHRvIG5leHQgdHJhY2sgaW4gdGhlIHVzZXLigJlzIHF1ZXVlLlxyXG4gICAqIFNlZSBbU2tpcCBVc2Vy4oCZcyBQbGF5YmFjayBUbyBOZXh0IFRyYWNrXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3NraXAtdXNlcnMtcGxheWJhY2stdG8tbmV4dC10cmFjay8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkLlxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnNraXBUb05leHQgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgdmFyIHBhcmFtcyA9XHJcbiAgICAgICdkZXZpY2VfaWQnIGluIG9wdGlvbnMgPyB7IGRldmljZV9pZDogb3B0aW9ucy5kZXZpY2VfaWQgfSA6IG51bGw7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvbWUvcGxheWVyL25leHQnLFxyXG4gICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNraXBzIHRvIHByZXZpb3VzIHRyYWNrIGluIHRoZSB1c2Vy4oCZcyBxdWV1ZS5cclxuICAgKiBOb3RlIHRoYXQgdGhpcyB3aWxsIEFMV0FZUyBza2lwIHRvIHRoZSBwcmV2aW91cyB0cmFjaywgcmVnYXJkbGVzcyBvZiB0aGUgY3VycmVudCB0cmFja+KAmXMgcHJvZ3Jlc3MuXHJcbiAgICogUmV0dXJuaW5nIHRvIHRoZSBzdGFydCBvZiB0aGUgY3VycmVudCB0cmFjayBzaG91bGQgYmUgcGVyZm9ybWVkIHVzaW5nIGAuc2VlaygpYFxyXG4gICAqIFNlZSBbU2tpcCBVc2Vy4oCZcyBQbGF5YmFjayBUbyBQcmV2aW91cyBUcmFja10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9za2lwLXVzZXJzLXBsYXliYWNrLXRvLW5leHQtdHJhY2svKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZC5cclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5za2lwVG9QcmV2aW91cyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICB2YXIgcGFyYW1zID1cclxuICAgICAgJ2RldmljZV9pZCcgaW4gb3B0aW9ucyA/IHsgZGV2aWNlX2lkOiBvcHRpb25zLmRldmljZV9pZCB9IDogbnVsbDtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9wbGF5ZXIvcHJldmlvdXMnLFxyXG4gICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlZWtzIHRvIHRoZSBnaXZlbiBwb3NpdGlvbiBpbiB0aGUgdXNlcuKAmXMgY3VycmVudGx5IHBsYXlpbmcgdHJhY2suXHJcbiAgICogU2VlIFtTZWVrIFRvIFBvc2l0aW9uIEluIEN1cnJlbnRseSBQbGF5aW5nIFRyYWNrXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS93ZWItYXBpL3NlZWstdG8tcG9zaXRpb24taW4tY3VycmVudGx5LXBsYXlpbmctdHJhY2svKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbl9tcyBUaGUgcG9zaXRpb24gaW4gbWlsbGlzZWNvbmRzIHRvIHNlZWsgdG8uIE11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXIuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkLlxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnNlZWsgPSBmdW5jdGlvbiAocG9zaXRpb25fbXMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHZhciBwYXJhbXMgPSB7XHJcbiAgICAgIHBvc2l0aW9uX21zOiBwb3NpdGlvbl9tc1xyXG4gICAgfTtcclxuICAgIGlmICgnZGV2aWNlX2lkJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgIHBhcmFtcy5kZXZpY2VfaWQgPSBvcHRpb25zLmRldmljZV9pZDtcclxuICAgIH1cclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdHlwZTogJ1BVVCcsXHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3BsYXllci9zZWVrJyxcclxuICAgICAgcGFyYW1zOiBwYXJhbXNcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIHJlcGVhdCBtb2RlIGZvciB0aGUgdXNlcuKAmXMgcGxheWJhY2suIE9wdGlvbnMgYXJlIHJlcGVhdC10cmFjaywgcmVwZWF0LWNvbnRleHQsIGFuZCBvZmYuXHJcbiAgICogU2VlIFtTZXQgUmVwZWF0IE1vZGUgT24gVXNlcuKAmXMgUGxheWJhY2tdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvc2V0LXJlcGVhdC1tb2RlLW9uLXVzZXJzLXBsYXliYWNrLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RhdGUgQSBzdHJpbmcgc2V0IHRvICd0cmFjaycsICdjb250ZXh0JyBvciAnb2ZmJy5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEpTT04gb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IGNhbiBiZSBwYXNzZWQuXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuc2V0UmVwZWF0ID0gZnVuY3Rpb24gKHN0YXRlLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICB2YXIgcGFyYW1zID0ge1xyXG4gICAgICBzdGF0ZTogc3RhdGVcclxuICAgIH07XHJcbiAgICBpZiAoJ2RldmljZV9pZCcgaW4gb3B0aW9ucykge1xyXG4gICAgICBwYXJhbXMuZGV2aWNlX2lkID0gb3B0aW9ucy5kZXZpY2VfaWQ7XHJcbiAgICB9XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHR5cGU6ICdQVVQnLFxyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9wbGF5ZXIvcmVwZWF0JyxcclxuICAgICAgcGFyYW1zOiBwYXJhbXNcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIHZvbHVtZSBmb3IgdGhlIHVzZXLigJlzIGN1cnJlbnQgcGxheWJhY2sgZGV2aWNlLlxyXG4gICAqIFNlZSBbU2V0IFZvbHVtZSBGb3IgVXNlcuKAmXMgUGxheWJhY2tdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvc2V0LXZvbHVtZS1mb3ItdXNlcnMtcGxheWJhY2svKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2b2x1bWVfcGVyY2VudCBUaGUgdm9sdW1lIHRvIHNldC4gTXVzdCBiZSBhIHZhbHVlIGZyb20gMCB0byAxMDAgaW5jbHVzaXZlLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZC5cclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5zZXRWb2x1bWUgPSBmdW5jdGlvbiAodm9sdW1lX3BlcmNlbnQsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHZhciBwYXJhbXMgPSB7XHJcbiAgICAgIHZvbHVtZV9wZXJjZW50OiB2b2x1bWVfcGVyY2VudFxyXG4gICAgfTtcclxuICAgIGlmICgnZGV2aWNlX2lkJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgIHBhcmFtcy5kZXZpY2VfaWQgPSBvcHRpb25zLmRldmljZV9pZDtcclxuICAgIH1cclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdHlwZTogJ1BVVCcsXHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3BsYXllci92b2x1bWUnLFxyXG4gICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSBzaHVmZmxlIG9uIG9yIG9mZiBmb3IgdXNlcuKAmXMgcGxheWJhY2suXHJcbiAgICogU2VlIFtUb2dnbGUgU2h1ZmZsZSBGb3IgVXNlcuKAmXMgUGxheWJhY2tdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL3dlYi1hcGkvdG9nZ2xlLXNodWZmbGUtZm9yLXVzZXJzLXBsYXliYWNrLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge2Jvb2x9IHN0YXRlIFdoZXRoZXIgb3Igbm90IHRvIHNodWZmbGUgdXNlcidzIHBsYXliYWNrLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZC5cclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpfSBjYWxsYmFjayBBbiBvcHRpb25hbCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIDIgcGFyYW1ldGVycy4gVGhlIGZpcnN0XHJcbiAgICogb25lIGlzIHRoZSBlcnJvciBvYmplY3QgKG51bGwgaWYgbm8gZXJyb3IpLCBhbmQgdGhlIHNlY29uZCBpcyB0aGUgdmFsdWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZGVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTnVsbCBpZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBhIGBQcm9taXNlYCBvYmplY3Qgb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5zZXRTaHVmZmxlID0gZnVuY3Rpb24gKHN0YXRlLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICB2YXIgcGFyYW1zID0ge1xyXG4gICAgICBzdGF0ZTogc3RhdGVcclxuICAgIH07XHJcbiAgICBpZiAoJ2RldmljZV9pZCcgaW4gb3B0aW9ucykge1xyXG4gICAgICBwYXJhbXMuZGV2aWNlX2lkID0gb3B0aW9ucy5kZXZpY2VfaWQ7XHJcbiAgICB9XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHR5cGU6ICdQVVQnLFxyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9wbGF5ZXIvc2h1ZmZsZScsXHJcbiAgICAgIHBhcmFtczogcGFyYW1zXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBhIHNob3cgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nLlxyXG4gICAqIFNlZSBbR2V0IGEgU2hvd10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vZG9jdW1lbnRhdGlvbi93ZWItYXBpL3JlZmVyZW5jZS9zaG93cy9nZXQtYS1zaG93Lykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2hvd0lkIFRoZSBpZCBvZiB0aGUgc2hvdy4gSWYgeW91IGtub3cgdGhlIFNwb3RpZnkgVVJJIGl0IGlzIGVhc3lcclxuICAgKiB0byBmaW5kIHRoZSBzaG93IGlkIChlLmcuIHNwb3RpZnk6c2hvdzo8aGVyZV9pc190aGVfc2hvd19pZD4pXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0U2hvdyA9IGZ1bmN0aW9uIChzaG93SWQsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7fTtcclxuICAgIHJlcXVlc3REYXRhLnVybCA9IF9iYXNlVXJpICsgJy9zaG93cy8nICsgc2hvd0lkO1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyBtdWx0aXBsZSBzaG93cyBmcm9tIHRoZSBTcG90aWZ5IGNhdGFsb2cuXHJcbiAgICogU2VlIFtHZXQgU2V2ZXJhbCBTaG93c10oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vZG9jdW1lbnRhdGlvbi93ZWItYXBpL3JlZmVyZW5jZS9zaG93cy9nZXQtc2V2ZXJhbC1zaG93cy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBzaG93SWRzIFRoZSBpZHMgb2YgdGhlIHNob3dzLiBJZiB5b3Uga25vdyB0aGVpciBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGVpciBzaG93IGlkIChlLmcuIHNwb3RpZnk6c2hvdzo8aGVyZV9pc190aGVfc2hvd19pZD4pXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBKU09OIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KX0gY2FsbGJhY2sgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyAyIHBhcmFtZXRlcnMuIFRoZSBmaXJzdFxyXG4gICAqIG9uZSBpcyB0aGUgZXJyb3Igb2JqZWN0IChudWxsIGlmIG5vIGVycm9yKSwgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIHZhbHVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE51bGwgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgYSBgUHJvbWlzZWAgb2JqZWN0IG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuZ2V0U2hvd3MgPSBmdW5jdGlvbiAoc2hvd0lkcywgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciByZXF1ZXN0RGF0YSA9IHtcclxuICAgICAgdXJsOiBfYmFzZVVyaSArICcvc2hvd3MvJyxcclxuICAgICAgcGFyYW1zOiB7IGlkczogc2hvd0lkcy5qb2luKCcsJykgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgY3VycmVudCB1c2VyJ3Mgc2F2ZWQgc2hvd3MuXHJcbiAgICogU2VlIFtHZXQgQ3VycmVudCBVc2VyJ3MgU2F2ZWQgU2hvd3NdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL2RvY3VtZW50YXRpb24vd2ViLWFwaS9yZWZlcmVuY2UvbGlicmFyeS9nZXQtdXNlcnMtc2F2ZWQtc2hvd3MvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldE15U2F2ZWRTaG93cyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9zaG93cydcclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGEgbGlzdCBvZiBzaG93cyB0byB0aGUgY3VycmVudCB1c2VyJ3Mgc2F2ZWQgc2hvd3MuXHJcbiAgICogU2VlIFtTYXZlIFNob3dzIGZvciBDdXJyZW50IFVzZXJdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL2RvY3VtZW50YXRpb24vd2ViLWFwaS9yZWZlcmVuY2UvbGlicmFyeS9zYXZlLXNob3dzLXVzZXIvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gc2hvd0lkcyBUaGUgaWRzIG9mIHRoZSBzaG93cy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlaXIgc2hvdyBpZCAoZS5nLiBzcG90aWZ5OnNob3c6PGhlcmVfaXNfdGhlX3Nob3dfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmFkZFRvTXlTYXZlZFNob3dzID0gZnVuY3Rpb24gKHNob3dJZHMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3Nob3dzJyxcclxuICAgICAgdHlwZTogJ1BVVCcsXHJcbiAgICAgIHBvc3REYXRhOiBzaG93SWRzXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGEgbGlzdCBvZiBzaG93cyBmcm9tIHRoZSBjdXJyZW50IHVzZXIncyBzYXZlZCBzaG93cy5cclxuICAgKiBTZWUgW1JlbW92ZSBTaG93cyBmb3IgQ3VycmVudCBVc2VyXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS9kb2N1bWVudGF0aW9uL3dlYi1hcGkvcmVmZXJlbmNlL2xpYnJhcnkvcmVtb3ZlLXNob3dzLXVzZXIvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gc2hvd0lkcyBUaGUgaWRzIG9mIHRoZSBzaG93cy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlaXIgc2hvdyBpZCAoZS5nLiBzcG90aWZ5OnNob3c6PGhlcmVfaXNfdGhlX3Nob3dfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnJlbW92ZUZyb21NeVNhdmVkU2hvd3MgPSBmdW5jdGlvbiAoXHJcbiAgICBzaG93SWRzLFxyXG4gICAgb3B0aW9ucyxcclxuICAgIGNhbGxiYWNrXHJcbiAgKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL21lL3Nob3dzJyxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIHBvc3REYXRhOiBzaG93SWRzXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9jaGVja1BhcmFtc0FuZFBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2tzIGlmIHRoZSBjdXJyZW50IHVzZXIncyBzYXZlZCBzaG93cyBjb250YWlucyBhIGNlcnRhaW4gbGlzdCBvZiBzaG93cy5cclxuICAgKiBTZWUgW0NoZWNrIEN1cnJlbnQgVXNlcidzIFNhdmVkIFNob3dzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS9kb2N1bWVudGF0aW9uL3dlYi1hcGkvcmVmZXJlbmNlL2xpYnJhcnkvY2hlY2stdXNlcnMtc2F2ZWQtc2hvd3MvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gc2hvd0lkcyBUaGUgaWRzIG9mIHRoZSBzaG93cy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlaXIgc2hvdyBpZCAoZS5nLiBzcG90aWZ5OnNob3c6PGhlcmVfaXNfdGhlX3Nob3dfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmNvbnRhaW5zTXlTYXZlZFNob3dzID0gZnVuY3Rpb24gKFxyXG4gICAgc2hvd0lkcyxcclxuICAgIG9wdGlvbnMsXHJcbiAgICBjYWxsYmFja1xyXG4gICkge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge1xyXG4gICAgICB1cmw6IF9iYXNlVXJpICsgJy9tZS9zaG93cy9jb250YWlucycsXHJcbiAgICAgIHBhcmFtczogeyBpZHM6IHNob3dJZHMuam9pbignLCcpIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIHRoZSBlcGlzb2RlcyBvZiBhIHNob3cgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nLlxyXG4gICAqIFNlZSBbR2V0IGEgU2hvdydzIEVwaXNvZGVzXShodHRwczovL2RldmVsb3Blci5zcG90aWZ5LmNvbS9kb2N1bWVudGF0aW9uL3dlYi1hcGkvcmVmZXJlbmNlL3Nob3dzL2dldC1zaG93cy1lcGlzb2Rlcy8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNob3dJZCBUaGUgaWQgb2YgdGhlIHNob3cuIElmIHlvdSBrbm93IHRoZSBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGUgc2hvdyBpZCAoZS5nLiBzcG90aWZ5OnNob3c6PGhlcmVfaXNfdGhlX3Nob3dfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldFNob3dFcGlzb2RlcyA9IGZ1bmN0aW9uIChzaG93SWQsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL3Nob3dzLycgKyBzaG93SWQgKyAnL2VwaXNvZGVzJ1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgYW4gZXBpc29kZSBmcm9tIHRoZSBTcG90aWZ5IGNhdGFsb2cuXHJcbiAgICogU2VlIFtHZXQgYW4gRXBpc29kZV0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vZG9jdW1lbnRhdGlvbi93ZWItYXBpL3JlZmVyZW5jZS9lcGlzb2Rlcy9nZXQtYW4tZXBpc29kZS8pIG9uXHJcbiAgICogdGhlIFNwb3RpZnkgRGV2ZWxvcGVyIHNpdGUgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVuZHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVwaXNvZGVJZCBUaGUgaWQgb2YgdGhlIGVwaXNvZGUuIElmIHlvdSBrbm93IHRoZSBTcG90aWZ5IFVSSSBpdCBpcyBlYXN5XHJcbiAgICogdG8gZmluZCB0aGUgZXBpc29kZSBpZCAoZS5nLiBzcG90aWZ5OmVwaXNvZGU6PGhlcmVfaXNfdGhlX2VwaXNvZGVfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEVwaXNvZGUgPSBmdW5jdGlvbiAoZXBpc29kZUlkLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJlcXVlc3REYXRhID0ge307XHJcbiAgICByZXF1ZXN0RGF0YS51cmwgPSBfYmFzZVVyaSArICcvZXBpc29kZXMvJyArIGVwaXNvZGVJZDtcclxuICAgIHJldHVybiBfY2hlY2tQYXJhbXNBbmRQZXJmb3JtUmVxdWVzdChyZXF1ZXN0RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgbXVsdGlwbGUgZXBpc29kZXMgZnJvbSB0aGUgU3BvdGlmeSBjYXRhbG9nLlxyXG4gICAqIFNlZSBbR2V0IFNldmVyYWwgRXBpc29kZXNdKGh0dHBzOi8vZGV2ZWxvcGVyLnNwb3RpZnkuY29tL2RvY3VtZW50YXRpb24vd2ViLWFwaS9yZWZlcmVuY2UvZXBpc29kZXMvZ2V0LXNldmVyYWwtZXBpc29kZXMvKSBvblxyXG4gICAqIHRoZSBTcG90aWZ5IERldmVsb3BlciBzaXRlIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZXBpc29kZUlkcyBUaGUgaWRzIG9mIHRoZSBlcGlzb2Rlcy4gSWYgeW91IGtub3cgdGhlaXIgU3BvdGlmeSBVUkkgaXQgaXMgZWFzeVxyXG4gICAqIHRvIGZpbmQgdGhlaXIgZXBpc29kZSBpZCAoZS5nLiBzcG90aWZ5OmVwaXNvZGU6PGhlcmVfaXNfdGhlX2VwaXNvZGVfaWQ+KVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgSlNPTiBvYmplY3Qgd2l0aCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCl9IGNhbGxiYWNrIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRoYXQgcmVjZWl2ZXMgMiBwYXJhbWV0ZXJzLiBUaGUgZmlyc3RcclxuICAgKiBvbmUgaXMgdGhlIGVycm9yIG9iamVjdCAobnVsbCBpZiBubyBlcnJvciksIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSB2YWx1ZSBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkZWQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOdWxsIGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGEgYFByb21pc2VgIG9iamVjdCBvdGhlcndpc2VcclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLmdldEVwaXNvZGVzID0gZnVuY3Rpb24gKGVwaXNvZGVJZHMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7XHJcbiAgICAgIHVybDogX2Jhc2VVcmkgKyAnL2VwaXNvZGVzLycsXHJcbiAgICAgIHBhcmFtczogeyBpZHM6IGVwaXNvZGVJZHMuam9pbignLCcpIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gX2NoZWNrUGFyYW1zQW5kUGVyZm9ybVJlcXVlc3QocmVxdWVzdERhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBhY2Nlc3MgdG9rZW4gaW4gdXNlLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7c3RyaW5nfSBhY2Nlc3NUb2tlbiBUaGUgYWNjZXNzIHRva2VuXHJcbiAgICovXHJcbiAgQ29uc3RyLnByb3RvdHlwZS5nZXRBY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBfYWNjZXNzVG9rZW47XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgYWNjZXNzIHRva2VuIHRvIGJlIHVzZWQuXHJcbiAgICogU2VlIFt0aGUgQXV0aG9yaXphdGlvbiBHdWlkZV0oaHR0cHM6Ly9kZXZlbG9wZXIuc3BvdGlmeS5jb20vd2ViLWFwaS9hdXRob3JpemF0aW9uLWd1aWRlLykgb25cclxuICAgKiB0aGUgU3BvdGlmeSBEZXZlbG9wZXIgc2l0ZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBvYnRhaW5pbmcgYW4gYWNjZXNzIHRva2VuLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjY2Vzc1Rva2VuIFRoZSBhY2Nlc3MgdG9rZW5cclxuICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAqL1xyXG4gIENvbnN0ci5wcm90b3R5cGUuc2V0QWNjZXNzVG9rZW4gPSBmdW5jdGlvbiAoYWNjZXNzVG9rZW4pIHtcclxuICAgIF9hY2Nlc3NUb2tlbiA9IGFjY2Vzc1Rva2VuO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgYW4gaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsgdG8gYmUgdXNlZC4gRS5nLiBRLCB3aGVuLlxyXG4gICAqIFNlZSBbQ29uZm9ybWFudCBJbXBsZW1lbnRhdGlvbnNdKGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjL2Jsb2IvbWFzdGVyL2ltcGxlbWVudGF0aW9ucy5tZClcclxuICAgKiBmb3IgYSBsaXN0IG9mIHNvbWUgYXZhaWxhYmxlIG9wdGlvbnNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBQcm9taXNlSW1wbGVtZW50YXRpb24gQSBQcm9taXNlcy9BKyB2YWxpZCBpbXBsZW1lbnRhdGlvblxyXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgaW1wbGVtZW50YXRpb24gYmVpbmcgc2V0IGRvZXNuJ3QgY29uZm9ybSB3aXRoIFByb21pc2VzL0ErXHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICBDb25zdHIucHJvdG90eXBlLnNldFByb21pc2VJbXBsZW1lbnRhdGlvbiA9IGZ1bmN0aW9uIChQcm9taXNlSW1wbGVtZW50YXRpb24pIHtcclxuICAgIHZhciB2YWxpZCA9IGZhbHNlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZUltcGxlbWVudGF0aW9uKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgaWYgKHR5cGVvZiBwLnRoZW4gPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHAuY2F0Y2ggPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB2YWxpZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgIH1cclxuICAgIGlmICh2YWxpZCkge1xyXG4gICAgICBfcHJvbWlzZUltcGxlbWVudGF0aW9uID0gUHJvbWlzZUltcGxlbWVudGF0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKycpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiBDb25zdHI7XHJcbn0pKCk7XHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gIG1vZHVsZS5leHBvcnRzID0gU3BvdGlmeVdlYkFwaTtcclxufVxyXG4iXX0=
