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

//this function takes one url at a time. It won't work with multiple artists, so another function needs to be created
//or it needs to be modified to do that. But if it's used for multiple artists it'll be very slow since it fetches each time
async function search(url, callback){
    fetchJSON(url)
        .then(data => { 
            callback(data);
        })
        .catch(error => console.error(error.message));
}

function searchArtist(artist){
    let numResults = 1;
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
    let numResults = 1;
    let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${user}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    search(url, handleSearchUserTopArtist);
}

function searchUserTopAlbum(user){
    let numResults = 1;
    let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    search(url, handleSearchUserTopAlbum);
}

function searchUserTopTrack(user){
    let numResults = 1;
    let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    search(url, handleSearchUserTopTrack);
}

function handleSearchArtist(data){
    let artistName = data.results.artistmatches.artist[0].name;
    outputElement.innerHTML = `Artist Results: ${artistName}`;
}

function handleSearchUser(userData){
    let userName = userData.user.name;
    let scrobbles = userData.user.playcount;
    userOutputElement.innerHTML = `User: ${userName}`;
    scrobblesOutputElement.innerHTML = `Scrobbles: ${scrobbles}`;
}

function handleSearchUserTopArtist(data){
    let topArtist = data.topartists.artist[0].name;
    console.log(`Top artist: ${topArtist}`);
    topArtistOutputElement.innerHTML = `Top artist: ${topArtist}`;
}

function handleSearchUserTopAlbum(data){
    let topAlbum = data.topalbums.album[0].name;
    topAlbumOutputElement.innerHTML = `Top album: ${topAlbum}`;
}

function handleSearchUserTopTrack(data){
    console.log(data);
    let topTrack = data.toptracks.track[0].name;
    topTrackOutputElement.innerHTML = `Top track: ${topTrack}`;
}