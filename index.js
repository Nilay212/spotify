console.log("lets write some javascript");

let currentSong = new Audio();
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1].replaceAll("%20", " "));
        }
    }
    return songs;
}

//PlayMusic function

const playMusic = (track , pause = false ) => {
    currentSong.src = "/songs/" + track;
    if(!pause) {
        currentSong.play();
        play.src = "img/pause.svg"
    }
    document.querySelector(".song-info").innerHTML = decodeURI(track);
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00"
};

async function main() {
    //Get the list of all songs
    let songs = await getSongs();
    playMusic(songs[0],true)

    let songUL = document
        .querySelector(".song-list")
        .getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUL.innerHTML =
            songUL.innerHTML +
            `<li><img  class="invert" src="img/music.svg"  alt="music logo">
        <div class="info">
            <div>${song}</div>
            <div>Nilay</div>
        </div>
        <div class="play-now">
            <span>Play now</span>
            <img class = "invert" src="img/play.svg" alt="">
        </div></li>`;
    }
    //Attach a event listener to all songs
    Array.from(
        document.querySelector(".song-list").getElementsByTagName("li")
    ).forEach((e) => {
        e.addEventListener("click", () => {
            let track = e
                .querySelector(".info")
                .firstElementChild.innerHTML.trim();
            playMusic(track);
        });
    });

    // Attach an event listener to play previous and next song
    play.addEventListener("click",()=> {
        if(currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg"
        } else {
            currentSong.pause();
            play.src = "/img/play.svg"
        }
    })

    //Timeupdate event listener in the playbar
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
    })

    // Add a event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=> {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent)/100;
    })
}

main();
