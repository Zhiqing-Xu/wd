const musicContainer = document.querySelector(".music-container");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const audio = document.querySelector("#audio");
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const title = document.querySelector("#title");
const cover = document.querySelector("#cover");
const playlistContainer = document.querySelector(".playlist-container");
const playlist = document.querySelector(".playlist");
const volumeSlider = document.querySelector("#volume");
const loopBtn = document.querySelector("#loop");

const currentTimeEl = document.querySelector("#current-time");
const totalDurationEl = document.querySelector("#total-duration");



// song titles
let songs = [];

fetch('./audio_list.txt')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return new Response(response.body, { headers: { 'Content-Type': 'text/plain;charset=UTF-8' } }).text();
    })
    .then(data => {
        console.log('Fetched data:', data); // Add this line to print out the data

        // Assume data is a string in the format ['song1', 'song2', 'song3', ...]
        songs = JSON.parse(data.replace(/'/g, '"')); // Replace single quotes with double quotes for JSON parsing

        // keep track of songs
        let songIndex = 0;

        // initially load song info DOM
        loadSong(songs[songIndex]);
        createPlaylistItems();
    })
    .catch(error => console.error('Error:', error));


// keep track of songs
let songIndex = 0;


// initially load song info DOM
loadSong(songs[songIndex]);
createPlaylistItems();


function loadSong(song) {
    title.innerText = song;
    cover.src = "assets_music/thumbnail/general.png";
    audio.src = `assets_music/music/${song}.mp3`;
    currentTimeEl.textContent = '0:00';
    totalDurationEl.textContent = '0:00';
}



function tryPlaySong() {
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Playback started successfully
                musicContainer.classList.add("play");
                playBtn.querySelector("i.fas").classList.remove("fa-play");
                playBtn.querySelector("i.fas").classList.add("fa-pause");
            })
            .catch((error) => {
                // Auto-play was prevented, show the play button
                musicContainer.classList.remove("play");
                playBtn.querySelector("i.fas").classList.add("fa-play");
                playBtn.querySelector("i.fas").classList.remove("fa-pause");
            });
    }
}



function playSong() {
    musicContainer.classList.add("play");
    playBtn.querySelector("i.fas").classList.remove("fa-play");
    playBtn.querySelector("i.fas").classList.add("fa-pause");

    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Playback started successfully
            })
            .catch((error) => {
                // Auto-play was prevented, handle it here
                audio.play();
            });
    }

    // Add this line to show the playlist when the play button is clicked
    playlistContainer.style.display = "block";
}

function pauseSong() {
    musicContainer.classList.remove("play");
    playBtn.querySelector("i.fas").classList.add("fa-play");
    playBtn.querySelector("i.fas").classList.remove("fa-pause");

    audio.pause();

    // Add this line to hide the playlist when the pause button is clicked
    // playlistContainer.style.display = "none";
}


// Add this function to create the playlist items
function createPlaylistItems() {
    songs.forEach((song, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("song-item"); // Add this class

        // Create a div for the song title
        const songTitle = document.createElement("span");
        songTitle.textContent = song;

        // Create the download link
        const downloadLink    = document.createElement("a");
        downloadLink.href     = `assets_music/music/${song}.mp3`;
        downloadLink.download = `${song}.mp3`;
        downloadLink.title    = "Download " + song;
 
        // Stop the click event from propagating to the li element
        downloadLink.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        
        // Create the download icon and add it to the download link
        const downloadIcon = document.createElement("i");
        downloadIcon.className = "fas fa-download";
        downloadLink.appendChild(downloadIcon);

        listItem.dataset.index = index;
        if (index === songIndex) {
            listItem.classList.add("active");
        }

        // Append the song title and the download link to the list item
        listItem.appendChild(songTitle);
        listItem.appendChild(downloadLink);
        
        listItem.addEventListener("click", selectSongFromPlaylist);
        playlist.appendChild(listItem);
    });
}

// Add this function to handle song selection from the playlist
function selectSongFromPlaylist(e) {
    const selectedSong = e.target.closest("li");
    songIndex = parseInt(selectedSong.getAttribute("data-index"));

    loadSong(songs[songIndex]);

    if (musicContainer.classList.contains("play")) {
        audio.pause();
        playSong();
    } else {
        musicContainer.classList.add("play");
        playSong();
    }

    updatePlaylist();
}



// Add this function to update the active song in the playlist
function updatePlaylist() {
    Array.from(playlist.children).forEach((listItem, index) => { // Use playlist.children instead of playlist.childNodes
        listItem.classList.remove("active");
        if (index === songIndex) {
            listItem.classList.add("active");
        }
    });
}



// song prev / next play function
function prevSong() {
    songIndex--;

    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }

    loadSong(songs[songIndex]);

    if (musicContainer.classList.contains("play")) {
        playSong();
    } else {
        musicContainer.classList.add("play");
        playSong();
    }
    updatePlaylist();
}



function nextSong() {
    songIndex++;

    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }

    loadSong(songs[songIndex]);

    if (musicContainer.classList.contains("play")) {
        playSong();
    } else {
        musicContainer.classList.add("play");
        playSong();
    }
    updatePlaylist();
}

function initializePlayer() {
    // Mute the audio initially
    audio.muted = false;

    // Try to play the song
    tryPlaySong();
}

// update audio time progress
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Update current time text
    currentTimeEl.textContent = formatTime(currentTime);

    // Update total duration text only once
    if (totalDurationEl.textContent === '0:00' && duration) {
        totalDurationEl.textContent = formatTime(duration);
    }
}


function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}



// set audio time progress
function setProgress(e) {
    const width = this.clientWidth;
    // console.log(width);

    const clickX = e.offsetX;
    // console.log(clickX);

    duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

// event listeners
playBtn.addEventListener("click", () => {
    const isPlaying = musicContainer.classList.contains("play");

    // Unmute the audio when the play button is clicked
    audio.muted = false;

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});


volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
});

loopBtn.addEventListener("click", () => {
    audio.loop = !audio.loop;
    loopBtn.classList.toggle("active", audio.loop);
    loopBtn.style.color = audio.loop ? "pink" : "black"; // Add this line
});

loopBtn.classList.toggle("active", audio.loop);


// change song events
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

audio.addEventListener("timeupdate", updateProgress);

progressContainer.addEventListener("click", setProgress);

// when song end auto play next song
audio.addEventListener("ended", nextSong);

// Add this event listener to play the song when the page loads
initializePlayer();


