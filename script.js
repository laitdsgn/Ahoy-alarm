const time = document.getElementById("time");
const setTime = document.getElementById("setTime");
const addAlarm = document.getElementById("add-alarm");
const selectSound = document.querySelectorAll("input[name='sound']");
const alarmsDisplay = document.getElementById("alarmsDisplay");
const errorText = document.getElementById("errors");
const alarm = document.getElementById("alarm");
const stopAlarm = document.getElementById("stop-alarm")

// shanties
let bitwa = new Audio("shanties/Bitwa.mp3");
let sztorm = new Audio("shanties/Cholerny Sztorm.mp3");
let sailor = new Audio("shanties/Drunken Sailer.mp3");
let ladies = new Audio("shanties/spanish ladies.mp3");
let wellerman = new Audio("shanties/Wellerman.mp3")


let alarms = [];

timer();
const timerInt = setInterval(timer, 1000);


function timer() {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    minutes = addZeros(minutes);
    seconds = addZeros(seconds);

    const currentTime = `${hours}:${minutes}:${seconds}`;
    time.innerText = currentTime;

    searchForAlarms(currentTime);
    updateNextAlarm(currentTime);
}


// adds zeros when minutes or seconds are < 10
function addZeros(x) {
    if (x < 10) {
        x = "0" + x;
    }
    return x;
}


addAlarm.addEventListener("click", function () {
    if (setTime.value == "") {
        errorText.innerText = "Set the Time!";
    } else {
        const date = new Date();
        const [currentHours, currentMinutes] = [date.getHours(), date.getMinutes()];

        const [alarmHours, alarmMinutes] = setTime.value.split(":").map(Number);

        if (alarmHours < currentHours || alarmMinutes < currentMinutes) {
            errorText.innerText = "You cannot set an alarm for an earlier time!";
        } else {


            selectSound.forEach(sound => {
                if (sound.checked) {
                    selectedSound = sound.value;
                }
            });

            alarms.push([setTime.value, selectedSound]);
            updateNextAlarm();
            errorText.innerText = ""; 
            alarm.style.display = "none"
            alarmsDisplay.style.display = "inline";
        }
    }
});

// stop alarm button 
stopAlarm.addEventListener("click", function () {
    if (currentlyPlaying) {
        stopSound(currentlyPlaying.sound); 
        stopAlarm.style.display = "none"; 
        alarm.style.display = "block"

    }
});

// makes the alarm ring
function searchForAlarms(currentTime) {
    alarms.forEach(([TimeAlarm, sound], index) => {
        if (currentTime === TimeAlarm) {
            toggleSound(sound); 
            stopAlarm.style.display = "flex"; 

        }
    });
}


function updateNextAlarm(currentTime = null) {
    if (alarms.length === 0) {
        alarmsDisplay.innerText = "No alarms set";
        return;
    }

    const date = new Date();
    const [currentHours, currentMinutes, currentSeconds] = currentTime
        ? currentTime.split(":").map(Number)
        : [date.getHours(), date.getMinutes(), date.getSeconds()];

    const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

    let closestAlarm = alarms.reduce((nearest, [alarmTime, sound]) => {
        const [alarmHours, alarmMinutes] = alarmTime.split(":").map(Number);
        const alarmTotalSeconds = alarmHours * 3600 + alarmMinutes * 60;

        const diff = alarmTotalSeconds - currentTotalSeconds;
        if (diff >= 0 && (nearest === null || diff < nearest.diff)) {
            return { time: alarmTime, sound: sound, diff: diff };
        }
        return nearest;
    }, null);

    if (closestAlarm) {

        alarmsDisplay.innerText = `Next alarm: ${closestAlarm.time} (${closestAlarm.sound})`;
    }
}


let currentlyPlaying = null;

document.querySelectorAll(".play-sound").forEach(button => {
    button.addEventListener("click", () => {
        const soundName = button.getAttribute("data-sound");
        toggleSound(soundName); 
    });
});

document.querySelectorAll(".stop-sound").forEach(button => {
    button.addEventListener("click", () => {
        const soundName = button.getAttribute("data-sound");
        stopSound(soundName); 
    });
});


function toggleSound(sound) {

    if (currentlyPlaying && currentlyPlaying.sound !== sound) {
        stopSound(currentlyPlaying.sound);
    }

    const audio = getAudio(sound);

    audio.play();
    currentlyPlaying = { sound, audio };
    
}

function stopSound(sound) {
    const audio = getAudio(sound);
    audio.pause();
    audio.currentTime = 0; 
    if (currentlyPlaying && currentlyPlaying.sound === sound) {
        currentlyPlaying = null;

    }
}


// sounds switch
function getAudio(sound) {
    switch (sound) {
        case "Cholerny Sztorm":
            return sztorm;
        case "Bitwa":
            return bitwa;
        case "Wellerman":
            return wellerman;
        case "Drunken Sailer":
            return sailor;
        case "spanish ladies":
            return ladies;
        default:
            console.error("Invalid sound!");
            return null;
    }
}


d