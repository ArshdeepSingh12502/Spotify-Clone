console.log('Waheguru');
let currentsong = new Audio();
let currFolder
let songs

async function getSong(folder) {
    currFolder = folder;
    let a = await fetch(`http://localhost:3000/html/sigma%20webd/Spotify%20clone/assets/${folder}/`, { mode: 'cors' })
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        if (as[index].href.endsWith(".mp3")) {
            songs.push(as[index].href.split(`/${folder}/`)[1]);
        }
    }

    //show all songs in playlist
    let t = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    t.innerHTML = ""
    for (const i of songs) {
        t.innerHTML = t.innerHTML + `
                <li>
                    <img src="assets/music.svg" alt="">
                    <div class="info">
                        <div>${i.replaceAll('%20', " ")}</div>
                        <div>arshdeep</div>
                    </div>
                    <div class="playnow">
                        <div>Play Now</div>
                        <img src="assets/play.svg" alt="">
                    </div>
                </li>`
    }

    // attach eventlistener to each song
    let arr = Array.from(document.querySelector(".songlist").getElementsByTagName('li'))
    arr.forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector('.info').firstElementChild.innerHTML)
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
        })
    })
}

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

const playMusic = (track, paused = false) => {
    currentsong.src = `/html/sigma%20webd/Spotify%20clone/assets/${currFolder}/` + track
    if (!paused) {
        currentsong.play()
        play.src = "assets/pause.svg"
    }
    //display name of the song when played
    document.querySelector(".songinfo").innerHTML = track;
}
async function displayAlbums(){
    let a = await fetch(`http://localhost:3000/html/sigma%20webd/Spotify%20clone/assets/songs/`, { mode: 'cors' })
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("assets/songs") && !e.href.includes(".htaccess")){
        //get the metadata of folder
        let folder = e.href.split("/").slice(-2)[0];
        let a = await fetch(`http://localhost:3000/html/sigma%20webd/Spotify%20clone/assets/songs/${folder}/info.json`, { mode: 'cors' })
        let response = await a.json();
        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card rounded">
            <div class="play">
                <img src="assets/play-green.svg" alt="">
            </div>
            <img src="assets/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.discription}</p>
        </div>`
        }
    }
    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset);
            songs = await getSong(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}

async function main() {

    //list of all songs
    await getSong("songs/new")
    console.log(songs);
    playMusic(decodeURI(songs[0]), true)

    displayAlbums()
    //attach eventlistener to play, pause and next
    play.addEventListener('click', () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = 'assets/pause.svg'
        }
        else {
            currentsong.pause()
            play.src = 'assets/play.svg'
        }
    })

    //display time of the song when played
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
        document.querySelector(".progress").style.width = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    //add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.currentTarget.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    //hamburger functionality
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + "%";
    })
    //close functionality
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + "%";
    })

    //previous and next buttons
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log('length niche likhi h');
        console.log(songs.length);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //volume button
    document.querySelector(".vol").getElementsByTagName("input")[0].value = 100;
    document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })
    //mute function
    document.querySelector(".volume").addEventListener("click", (e)=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg" , "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".vol").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg" , "volume.svg")
            currentsong.volume = 0.1;
            document.querySelector(".vol").getElementsByTagName("input")[0].value = 10;
        }
    })
}
main()