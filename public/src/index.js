import './componentrace.js'

const isLoaded = () => console.log({ isLoaded: true })

isLoaded()

const playButton = document.querySelector('#play')
const pauseButton = document.querySelector('#pause')
const stopButton = document.querySelector('#stop')
const avantButton = document.querySelector('#avant')
const arriereButton = document.querySelector('#arriere')
const loopButton = document.querySelector('#loop')
const retourzeroButton = document.querySelector('#retourzero')

const videoLector = document.querySelector('#mainvid')

console.log(playButton)
playButton.addEventListener('click', (e) => {
    console.log(e)
    videoLector.play()
})
pauseButton.addEventListener('click', (e) => {
    console.log(e)
    videoLector.pause()
})

stopButton.addEventListener('click',(e) => {
    videoLector.currentTime = 0
    videoLector.pause()
})


loopButton.addEventListener('click', (e) => {
    videoLector.loop = !videoLector.loop
    if (videoLector.loop == true) {
        loopButton.style.backgroundColor = '#32CD32'
    }
    else {
        loopButton.style.backgroundColor = '#B22222'
    }
})

avantButton.addEventListener('click', (e) => {
    videoLector.currentTime += 10
})

arriereButton.addEventListener('click', (e) => {
    videoLector.currentTime -= 10
})

retourzeroButton.addEventListener('click', (e) => {
    videoLector.currentTime = 0;
})








