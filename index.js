const API_KEY = 'c77958698a259fde566df32564b47b55';
const usernameDiv = document.getElementById('username');
const scrobblesDiv = document.getElementById('scrobbles');
const artistsDiv = document.getElementById('artists');
const albumsDiv = document.getElementById('albums');
const tracksDiv = document.getElementById('tracks');
const numResults = 10;

class Search {
    constructor(user) {
        this.user = user;
        this.baseUrl = 'http://ws.audioscrobbler.com/2.0/';
    }

    async fetchStats(method, additionalParams = {}) {
        const url = new URL(this.baseUrl);
        url.searchParams.append('method', method);
        url.searchParams.append('user', this.user);
        url.searchParams.append('api_key', API_KEY);
        url.searchParams.append('format', 'json');

        for (const [key, value] of Object.entries(additionalParams)) {
            url.searchParams.append(key, value);
        }

        console.debug('url:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    async getTopArtists() {
        return this.fetchStats('user.gettopartists');
    }

    async getTopAlbums() {
        return this.fetchStats('user.gettopalbums');
    }

    async getTopTracks() {
        return this.fetchStats('user.gettoptracks');
    }

    // Add more methods as needed
}

function promptUsername() {
    const username = prompt("Please enter your Last.fm username:");
    if (username) {
        loadUserStats(username);
    } else {
        console.error("Username is required.");
    }
}

async function loadUserStats(username) {
    const search = new Search(username, API_KEY);
    const displayData = new DisplayData(usernameDiv, scrobblesDiv, artistsDiv, albumsDiv, tracksDiv);

    try {
        const topArtists = await search.getTopArtists();
        displayData.displayTopArtists(topArtists);

        const topAlbums = await search.getTopAlbums();
        displayData.displayTopAlbums(topAlbums);

        const topTracks = await search.getTopTracks();
        displayData.displayTopTracks(topTracks);

        // Add more stats as needed
    } catch (error) {
        console.error('Error fetching user stats:', error);
    }
}

class DisplayData {
    constructor(usernameDiv, scrobblesDiv, artistsDiv, albumsDiv, tracksDiv) {
        this.usernameDiv = usernameDiv;
        this.scrobblesDiv = scrobblesDiv;
        this.artistsDiv = artistsDiv;
        this.albumsDiv = albumsDiv;
        this.tracksDiv = tracksDiv;
    }

    displayTopArtists(data) {
        const artists = data.topartists.artist.map(artist => ({
            name: artist.name,
            playcount: artist.playcount
        }));
        this.artistsDiv.innerHTML = `<h3 class="title">Top Artists</h3><ol class="list">${artists.map(artist => `<li class="list-item">${artist.name} (${artist.playcount} plays)</li>`).join('')}</ol>`;
    }

    displayTopAlbums(data) {
        const albums = data.topalbums.album.map(album => ({
            name: album.name,
            playcount: album.playcount
        }));
        this.albumsDiv.innerHTML = `<h3 class="title">Top Albums</h3><ol class="list">${albums.map(album => `<li class="list-item">${album.name} (${album.playcount} plays)</li>`).join('')}</ol>`;
    }

    displayTopTracks(data) {
        const tracks = data.toptracks.track.map(track => ({
            name: track.name,
            playcount: track.playcount
        }));
        this.tracksDiv.innerHTML = `<h3 class="title">Top Tracks</h3><ol class="list">${tracks.map(track => `<li class="list-item">${track.name} (${track.playcount} plays)</li>`).join('')}</ol>`;
    }

    // Add more methods as needed
}

function displayTopArtists(data) {
    const artists = data.topartists.artist.map(artist => artist.name);
    console.log('Top Artists:', artists);
    // Update the DOM or display the data as needed
}

function displayTopAlbums(data) {
    const albums = data.topalbums.album.map(album => album.name);
    console.log('Top Albums:', albums);
    // Update the DOM or display the data as needed
}

function displayTopTracks(data) {
    const tracks = data.toptracks.track.map(track => track.name);
    console.log('Top Tracks:', tracks);
    // Update the DOM or display the data as needed
}

document.addEventListener('DOMContentLoaded', () => {
    promptUsername();
});
