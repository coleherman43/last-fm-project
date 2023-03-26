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

function searchArtist(artist){
    const numResults = 1;
    const url = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artist}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    fetchJSON(url)
        .then(data => {
            const results = data.results.artistmatches.artist;
            console.log(`Search results for ${artist}:`);
            results.forEach(result => handleSearchArtist(result));
        })
        .catch(error => console.error(error.message))
}

function searchUser(user){
    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${user}&api_key=${API_KEY}&format=json`;
    fetchJSON(url)
        .then(data => {
            console.log(`Search results for ${user}: `);
            console.log(data);
            handleSearchUser(data);
            searchUserTopArtist(user);
            searchUserTopAlbum(user);
        })
        .catch(error => console.error(error.message))   
}

function searchUserTopArtist(user){
    const numResults = 1;
    const url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${user}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    fetchJSON(url)
        .then(data => {
            console.log(`Search results for ${user}: `);
            console.log(data);
            let results = data.topartists.artist;
            results.forEach(result => handleSearchUserTopArtist(result));
        })
        .catch(error => console.error(error.message))
}

function searchUserTopAlbum(user){
    const numResults = 1;
    const url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&api_key=${API_KEY}&limit=${numResults}&format=json`;
    fetchJSON(url)
        .then(data => {
            console.log(`Search results for album from ${user}`);
            console.log(data);
            let results = data.topalbums.album;
            results.forEach(result => handleSearchUserTopAlbum(result));
        })
        .catch(error => console.error(error.message));
}

function handleSearchArtist(artistData){
    console.log(artistData);
    const artistName = artistData.name;
    outputElement.innerHTML = `Artist Results: ${artistName}`;
}

function handleSearchUser(userData){
    console.log(userData);
    const userName = userData.user.name;
    const scrobbles = userData.user.playcount;
    userOutputElement.innerHTML = `User: ${userName}`;
    scrobblesOutputElement.innerHTML = `Scrobbles: ${scrobbles}`;
}

function handleSearchUserTopArtist(artist){
    console.log(`Top artist data: ${artist}`);
    const topArtist = artist.name;
    console.log(`Top artist: ${topArtist}`);
    topArtistOutputElement.innerHTML = `Top artist: ${topArtist}`;
}

function handleSearchUserTopAlbum(album){
    console.log(`Top album data: ${album}`);
    const topAlbum = album.name;
    console.log(`Top album: ${topAlbum}`);
    topAlbumOutputElement.innerHTML = `Top album: ${topAlbum}`;
}