const API_KEY = 'c77958698a259fde566df32564b47b55';
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const searchUserInput = document.querySelector('#search-user-input');
const searchUserButton = document.querySelector('#search-user-button');
const outputElement = document.getElementById('output');
const userOutputElement = document.getElementById('user-output');
const scrobblesOutputElement = document.getElementById('scrobbles-output');
const topArtistOutputElement = document.getElementById('top-artist-output');
const topAlbumOutputElement = document.getElementById('top-album-output');
const topTrackOutputElement = document.getElementById('top-track-output');
const numResults = 50;

searchButton.addEventListener('click', () => {
    const artist = searchInput.value;
    searchArtist(artist);
});

searchUserButton.addEventListener('click', () => {
    const user = searchUserInput.value;
    searchUser(user);
})

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function search(url, callback){
    fetchJSON(url)
        .then(data => { 
            callback(data);
        })
        .catch(error => console.error(error.message));
}

function searchArtist(artist){
    let url = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artist}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    search(url, handleSearchArtist);
}

function searchUser(user){
    let url = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${user}&api_key=${API_KEY}&format=json`;
    searchUserTopAlbum(user);
    searchUserTopArtist(user);
    searchUserTopTrack(user);
    search(url, handleSearchUser)
}

function searchUserTopArtist(user){
    let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${user}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    search(url, handleSearchUserTopArtist);
}

function searchUserTopAlbum(user){
    let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    search(url, handleSearchUserTopAlbum);
}

function searchUserTopTrack(user){
    let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    search(url, handleSearchUserTopTrack);
}

function handleSearchArtist(data){
    let artists = [];
    data.results.artistmatches.artist.forEach((artist) => {
        artists.push(artist.name);
    })
    outputElement.innerHTML = `Artist Results: ${artists}`;
}

function handleSearchUser(userData){
    let userName = userData.user.name;
    let scrobbles = userData.user.playcount;
    userOutputElement.innerHTML = `User: ${userName}`;
    scrobblesOutputElement.innerHTML = `Scrobbles: ${scrobbles}`;
}

function handleSearchUserTopArtist(data){
    let topArtists = [];
    data.topartists.artist.forEach((artist) => {
        topArtists.push(artist.name)
    });
    topArtistOutputElement.innerHTML = `Top artist: ${topArtists}`;
}

function handleSearchUserTopAlbum(data){
    let topAlbums = [];
    data.topalbums.album.forEach((album) => {
        topAlbums.push(album.name)
    });
    topAlbumOutputElement.innerHTML = `Top album: ${topAlbums}`;
}

function handleSearchUserTopTrack(data){
    let topTracks = [];
    data.toptracks.track.forEach((track) => {
        topTracks.push(track.name)
    });
    topTrackOutputElement.innerHTML=`Top tracks: ${topTracks}`
}