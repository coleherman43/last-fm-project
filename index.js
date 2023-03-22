const API_KEY = 'c77958698a259fde566df32564b47b55'
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const searchUserInput = document.querySelector('#search-user-input');
const searchUserButton = document.querySelector('#search-user-button');

searchButton.addEventListener('click', () => {
    const artist = searchInput.value;
    searchArtist(artist);
});

searchUserButton.addEventListener('click', () => {
    const user = searchUserInput.value;
    searchUser(user);
})

function searchArtist(artist){
    let numResults = 1;
    let url = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artist}&api_key=${API_KEY}&limit=${numResults}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const results = data.results.artistmatches.artist;
            console.log(`Search results for ${artist}:`);
            results.forEach(result => handleSearchArtist(result));
        })
        .catch(error => console.error(error.message))
}

function searchUser(user){
    let url = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${user}&api_key=${API_KEY}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(`Search resuts for ${user}: `);
            console.log(data);
            handleSearchUser(data);
        })
        .catch(error => console.error(error.message))
}

function handleSearchArtist(artistData){
    console.log(artistData);
    let artistName = artistData.name;
    document.getElementById('output').innerHTML="Artist Results: " + artistName;

}

function handleSearchUser(userData){
    console.log(userData);
    let userName = userData.user.name;
    let scrobbles = userData.user.playcount;
    document.getElementById('user-output').innerHTML="User: " + userName;
    document.getElementById('scrobbles-output').innerHTML="Scrobbles: " + scrobbles;
}
