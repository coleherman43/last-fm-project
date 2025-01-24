const API_KEY = import.meta.env.VITE_API_KEY;
console.log('API Key:', API_KEY); // Debug to ensure it loads correctly
const usernameDiv = document.getElementById('username');
const scrobblesDiv = document.getElementById('scrobbles');
const artistsDiv = document.getElementById('artists');
const albumsDiv = document.getElementById('albums');
const tracksDiv = document.getElementById('tracks');
const NUM_RESULTS = 10;

class Search {
    constructor(user, apiKey) {
        this.user = user;
        this.apiKey = apiKey;
        this.baseUrl = 'http://ws.audioscrobbler.com/2.0/';
    }

    async fetchStats(method, additionalParams = {}) {
        const url = new URL(this.baseUrl);
        url.searchParams.append('method', method);
        url.searchParams.append('user', this.user);
        url.searchParams.append('api_key', this.apiKey);
        url.searchParams.append('format', 'json');

        for (const [key, value] of Object.entries(additionalParams)) {
            url.searchParams.append(key, value);
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    async getTopArtists() {
        return this.fetchStats('user.getTopArtists');
    }

    async getTopAlbums() {
        return this.fetchStats('user.getTopAlbums');
    }

    async getTopTracks() {
        return this.fetchStats('user.getTopTracks');
    }
}

function promptUsername() {
    const username = prompt("Please enter your Last.fm username:");
    if (username) {
        loadUserStats(username);
    } else {
        console.error("Username is required.");
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
        console.log('Top Artists Data:', data); // Log the data to inspect its structure
        const artists = data.topartists.artist.map(artist => artist.name);
        this.artistsDiv.innerHTML = `<h3>Top Artists</h3><ol>${artists.map(artist => `<li>${artist}</li>`).join('')}</ol>`;
    }

    displayTopAlbums(data) {
        console.log('Top Albums Data:', data); // Log the data to inspect its structure
        const albums = data.topalbums.album.map(album => album.name);
        this.albumsDiv.innerHTML = `<h3>Top Albums</h3><ol>${albums.map(album => `<li>${album}</li>`).join('')}</ol>`;
    }

    displayTopTracks(data) {
        console.log('Top Tracks Data:', data); // Log the data to inspect its structure
        const tracks = data.toptracks.track.map(track => track.name);
        this.tracksDiv.innerHTML = `<h3>Top Tracks</h3><ol>${tracks.map(track => `<li>${track}</li>`).join('')}</ol>`;
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

document.addEventListener('DOMContentLoaded', () => {
    promptUsername();
});