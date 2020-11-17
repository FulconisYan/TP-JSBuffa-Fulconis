import './lib/webaudio-controls.js';

const getBaseURL = () => {
  const base = new URL('.', import.meta.url);
  console.log("Base = " + base);
	return `${base}`;
};

/********************************************* Partie Audio ***************************************************/

const templateAudio = document.createElement("template");
templateAudio.innerHTML = `
  <style>
    H1 {
          color:red;
    }
    #audioTitle {
        color:black;
        padding-left: 20px;
    }
    #audioPart {
        margin-bottom: 20px;
        border:solid;
        display: inline-block;
        padding-right: 20px;
    }
    #soundEffect {
        border:solid;
        display: inline-block;
    }
    #equalizer {
        padding-right: 20px;
        
    }
    #waveform{
    
    }
    #myCanvas {
        border:1px solid;
        margin = 10px;
    }
    #balanceGaucheDroite {
        margin-bottom: 40px;
        padding-left:25px;

    }
    #CanvasFrequences {
        border:1px solid;
    }
    #knob-volume {
        margin-right: 20px;
    }
    #volume-slider2 {
        margin-right: 20px;
    }
  </style>
<div id="audioPart">
<h1 id="audioTitle"> Partie Audio </h1>
  <audio id="myPlayer" controls crossorigin="anonymous">
        <source src="./myComponents/assets/audio/jailhouse_rock.mp3" type="audio/mp3" />
    </audio>
    <br/> <br/>
    
    <button id="playButtonAudio">Play</button> 
    <button id="pauseButtonAudio">Pause</button> 
    <button id="stopButtonAudio">Stop </button>
    <button id="avantButtonAudio">+10</button>  
    <button id="arriereButtonAudio">-10</button> 
    <button id="loopButtonAudio">Loop</button> 
    <button id="retourzeroButtonAudio">Retour à zero</button>
    <br/> <br/>
    
    Volume : 0 <webaudio-slider id="volume-slider" height="20" width="100" src="../assets/knobs/hsliderbody.png" knobsrc="./myComponents/assets/knobs/hsliderknob.png" type="range" min=0 max=1 step=0.1 ></webaudio-slider>1
<br/> <br/>
    
    <webaudio-knob id="knob-volume" tooltip="Volume:%s" src="./assets/knobs/LittlePhatty.png" sprites="100" value=1 min="0" max="1" step=0.01>
        Volume</webaudio-knob>
      
</div> 
<div id="soundEffect">
    <div id="equalizer"> 
        <div class="controls">
            <label>60Hz</label>
            <webaudio-slider id="range1" height="20" width="100" src="../assets/knobs/hsliderbody.png" knobsrc="./myComponents/assets/knobs/hsliderknob.png" type="range" value="0" step="1" min="-30" max="30"></webaudio-slider>
            <output id="gain0">0 dB</output>
      </div>
      <div class="controls">
      </div>
      <div class="controls">
            <label>170Hz</label>
            <webaudio-slider id="range2" height="20" width="100" src="../assets/knobs/hsliderbody.png" knobsrc="./myComponents/assets/knobs/hsliderknob.png" type="range" value="0" step="1" min="-30" max="30"></webaudio-slider>
            <output id="gain1">0 dB</output>
      </div>
      <div class="controls">
            <label>350Hz</label>
            <webaudio-slider id="range3" height="20" width="100" src="../assets/knobs/hsliderbody.png" knobsrc="./myComponents/assets/knobs/hsliderknob.png" type="range" value="0" step="1" min="-30" max="30"></webaudio-slider>
            <output id="gain2">0 dB</output>
      </div>
      <div class="controls">
        <label>1000Hz</label>
        <webaudio-slider id="range4" height="20" width="100" src="../assets/knobs/hsliderbody.png" knobsrc="./myComponents/assets/knobs/hsliderknob.png" type="range" value="0" step="1" min="-30" max="30"></webaudio-slider>
        <output id="gain3">0 dB</output>
      </div>
      <div class="controls">
        <label>3500Hz</label>
        <webaudio-slider id="range5" height="20" width="100" src="../assets/knobs/hsliderbody.png" knobsrc="./myComponents/assets/knobs/hsliderknob.png" type="range" value="0" step="1" min="-30" max="30"></webaudio-slider>
        <output id="gain4">0 dB</output>
      </div>
      <div class="controls">
        <label>10000Hz</label>
        <webaudio-slider id="range6" height="20" width="100" src="../assets/knobs/hsliderbody.png" knobsrc="./myComponents/assets/knobs/hsliderknob.png" type="range" value="0" step="1" min="-30" max="30"></webaudio-slider>
        <output id="gain5">0 dB</output>
      </div>
    </div> 
    <br/>
    <div id="waveform">
        <canvas id="MyCanvas" width="300" height="100"></canvas>
    </div>
</div>
<div id ="balanceGaucheDroite">
    <h2> Visualizer de fréquences </h2>
    <p>Wow, la classe !</p>
    <canvas id="CanvasFrequences" width="300" height="100"></canvas>
</div>`;


let ctx = window.AudioContext;
let equalize;
let filters;


let canvas, canvasContext;
let gradient;
let analyser;
let width, height;

let dataArray, bufferLength;


let canvasFrequences, canvasFrequencesContext;
let gradientFrequences;
let analyserFrequences;
let widthFrequences, heightFrequences;

let dataArrayFrequences, bufferLengthFrequences;

class MyAudioPlayer extends HTMLElement {
    constructor() {
        super();

        this.volume = 1;

        this.attachShadow({ mode: "open" });
        //this.shadowRoot.innerHTML = template;
        this.shadowRoot.appendChild(templateAudio.content.cloneNode(true));
        this.basePath = getBaseURL(); // url absolu du composant
        // Fix relative path in WebAudio Controls elements
        this.fixRelativeImagePaths();
    }

    connectedCallback() {

        this.playerAudio = this.shadowRoot.querySelector('#myPlayer')
        this.context = new ctx();

        this.mediaElement = this.shadowRoot.getElementById('myPlayer');
        this.sourceNode = this.context.createMediaElementSource(this.mediaElement);

        this.mediaElement.addEventListener('play',() => this.context.resume());

        this.volumeBar = this.shadowRoot.querySelector('#volume-slider');
        this.volumeBar.oninput = (e) => {
            this.playerAudio.volume = e.target.value;
        }

        canvas = this.shadowRoot.querySelector("#myCanvas");
        width = canvas.width;
        height = canvas.height;
        canvasContext = canvas.getContext('2d');

        canvasFrequences = this.shadowRoot.querySelector("#CanvasFrequences");
        widthFrequences = canvasFrequences.width;
        heightFrequences = canvasFrequences.height;
        canvasFrequencesContext = canvasFrequences.getContext('2d');

        this.buildAudioGraph();



        // create a vertical gradient of the height of the canvas
        gradient = canvasContext.createLinearGradient(0,0,0, height);
        gradient.addColorStop(1,'#000000');
        gradient.addColorStop(0.75,'#ff0000');
        gradient.addColorStop(0.25,'#ffff00');
        gradient.addColorStop(0,'#ffffff');

        this.loopButtonAudio = this.shadowRoot.querySelector("#loopButtonAudio")

        filters = this.setEqualizerContent(this.context,this.sourceNode,this.mediaElement);
        console.log(filters);
        this.declareListeners();

        requestAnimationFrame(() =>{
            this.visualize();
        });

    }


    setEqualizerContent(){
        let filters = [];
        // Set filters
        [60, 170, 350, 1000, 35000, 10000].forEach((freq,i) => {
            let eq = this.context.createBiquadFilter();
            eq.frequency.value = freq;
            eq.type = "peaking";
            eq.gain.value = 0;
            filters.push(eq);
        });

        // Connect filters in serie
        this.sourceNode.connect(filters[0]);
        for (let i = 0; i < filters.length - 1; i++) {
            filters[i].connect(filters[i+1]);
        }

        // connect the last filter to the speakers
        filters[filters.length - 1].connect(this.context.destination);

        return filters;
    }

    fixRelativeImagePaths() {
        // change webaudiocontrols relative paths for spritesheets to absolute
        let webaudioControls = this.shadowRoot.querySelectorAll(
            'webaudio-knob, webaudio-slider, webaudio-switch, img'
        );
        webaudioControls.forEach((e) => {
            let currentImagePath = e.getAttribute('src');
            if (currentImagePath !== undefined) {
                //console.log("Got wc src as " + e.getAttribute("src"));
                let imagePath = e.getAttribute('src');
                //e.setAttribute('src', this.basePath  + "/" + imagePath);
                e.src = this.basePath  + "/" + imagePath;
                //console.log("After fix : wc src as " + e.getAttribute("src"));
            }
        });
    }

    buildAudioGraph() {

        this.mediaElement.onplay = (e) => {this.context.resume();}

        // Create an analyser node
        analyserFrequences = this.context.createAnalyser();

        // Try changing for lower values: 512, 256, 128, 64...
        analyserFrequences.fftSize = 32;
        bufferLength = analyserFrequences.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        this.sourceNode.connect(analyserFrequences);
        analyserFrequences.connect(this.context.destination);
    }



    declareListeners() {
        this.shadowRoot.querySelector("#playButtonAudio").addEventListener("click", (event) => {
            this.play();
        });

        this.shadowRoot.querySelector("#pauseButtonAudio").addEventListener("click", (event) => {
            this.pause();
        });

        this.shadowRoot.querySelector("#stopButtonAudio").addEventListener("click", (event) => {
            this.playerAudio.currentTime = 0;
            this.pause();
        });

        this.shadowRoot.querySelector("#avantButtonAudio").addEventListener("click", (event) => {
            this.currentTimeForward();
        });

        this.shadowRoot.querySelector("#arriereButtonAudio").addEventListener("click", (event) => {
            this.currentTimeBack();
        });

        this.loopButtonAudio.addEventListener("click", (event) => {
            this.loop = !this.loop
            if (this.loop == true) {
               this.loopButtonAudio.style.backgroundColor = '#32CD32'
            }
            else {
                this.loopButtonAudio.style.backgroundColor = '#B22222'
            }
        });

        this.shadowRoot.querySelector("#retourzeroButtonAudio").addEventListener("click", (event) => {
            this.playerAudio.currentTime = 0;
            this.play();
        });


        this.shadowRoot
            .querySelector("#knob-volume")
            .addEventListener("input", (event) => {
                this.setVolume(event.target.value);
            });

        this.slideBarUn = this.shadowRoot.querySelector("#range1")


        this.slideBarUn.oninput = (e) => {
            this.changeGain(e.target.value,0);
        }

        this.slideBarDeux = this.shadowRoot.querySelector("#range2")


        this.slideBarDeux.oninput = (e) => {
            this.changeGain(e.target.value,1);
        }

        this.slideBarTrois = this.shadowRoot.querySelector("#range3")


        this.slideBarTrois.oninput = (e) => {
            this.changeGain(e.target.value,2);
        }

        this.slideBarQuatre = this.shadowRoot.querySelector("#range4")


        this.slideBarQuatre.oninput = (e) => {
            this.changeGain(e.target.value,3);
        }


        this.slideBarCinq = this.shadowRoot.querySelector("#range5")


        this.slideBarCinq.oninput = (e) => {
            this.changeGain(e.target.value,4);
        }

        this.slideBarSix = this.shadowRoot.querySelector("#range6")


        this.slideBarSix.oninput = (e) => {
            this.changeGain(e.target.value,5);
        }

    }


    // API
    setVolume(val) {
        this.playerAudio.volume = val;
    }

    play() {
        this.playerAudio.play();
    }

    pause() {
        this.playerAudio.pause();
    }

    currentTimeForward()
    {
        this.playerAudio.currentTime += 10;
    }

    currentTimeBack()
    {
        this.playerAudio.currentTime -= 10;
    }

    changeGain(sliderVal,nbFilter) {
        let value = parseFloat(sliderVal);
        filters[nbFilter].gain.value = value;

        // update output labels
        let output = this.shadowRoot.querySelector("#gain" + nbFilter);
        output.value = value + " dB";
    }

    visualize() {
        // clear the canvas
        canvasContext.clearRect(0, 0, widthFrequences, heightFrequences);

        // Or use rgba fill to give a slight blur effect
        //canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
        //canvasContext.fillRect(0, 0, width, height);

        // Get the analyser data
        analyser.getByteFrequencyData(dataArrayFrequences);

        let barWidth = width / bufferLength;
        let barHeight;
        let x = 0;

        // values go from 0 to 256 and the canvas heigt is 100. Let's rescale
        // before drawing. This is the scale factor
        //heightScale = height/128;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArrayFrequences[i];
        }

        requestAnimationFrame(this.visualize);
    }
}

customElements.define("my-audioplayer", MyAudioPlayer);


const templateVideo = document.createElement("template");
templateVideo.innerHTML = `
<style>
    H1 {
          color:red;
    }
    #videoTitle{
        color:black;
        padding-left: 20px;
    }
    #videoPart{
        border:solid;
        display: inline-block;
        padding-right: 20px;
        margin-bottom: 20px;
    }
    #mainvid {
    width:990px;
    height:600px;
    }
  </style>
<div id="videoPart">
  <h1 id="videoTitle"> Partie Video </h1>
  <div>
<button id="playButtonVideo">Play</button> 
<button id="pauseButtonVideo">Pause</button> 
<button id="stopButtonVideo">Stop </button>
<button id="avantButtonVideo"> +10</button> 
<button id="arriereButtonVideo">-10</button> 
<button id="loopButtonVideo">Loop</button> 
<button id="retourzeroButtonVideo">Retour à zero</button>
</div>
<br/>
  <video id="mainvid" controls crossorigin="anonymous">
    <source src="./myComponents/assets/video/lifedemo.mp4" type="video/mp4">
    <p>Votre navigateur ne supporte pas la vidéo HTML5 <a href="./myComponents/assets/video/lifedemo.mp4">un lien vers la vidéo</a>.</p>
</video>
</div>
<br/>`;


/********************************************* Partie Video ***************************************************/
class MyVideoPlayer extends HTMLElement{
    constructor() {
        super();
        this.volume = 1;
        this.attachShadow({ mode: "open" });
        //this.shadowRoot.innerHTML = template;
        this.shadowRoot.appendChild(templateVideo.content.cloneNode(true));
        this.basePath = getBaseURL(); // url absolu du composant
        // Fix relative path in WebAudio Controls elements
        this.playerVideo = this.shadowRoot.querySelector("#mainvid");

    }

    connectedCallback() {

        this.videoListeners();
    }


    videoListeners(){
        this.shadowRoot.querySelector("#playButtonVideo").addEventListener("click", (event) => {
            this.play();
        });

        this.shadowRoot.querySelector("#pauseButtonVideo").addEventListener("click", (event) => {
            this.pause();
        });

        this.shadowRoot.querySelector("#stopButtonVideo").addEventListener("click", (event) => {
            this.playerVideo.currentTime = 0;
            this.pause();
        });

        this.shadowRoot.querySelector("#avantButtonVideo").addEventListener("click", (event) => {
            this.currentTimeForward();
        });

        this.shadowRoot.querySelector("#arriereButtonVideo").addEventListener("click", (event) => {
            this.currentTimeBack();
        });

        this.shadowRoot.querySelector("#loopButtonVideo").addEventListener("click", (event) => {
            this.loop = !this.loop
            if (this.loop === true) {
                this.style.backgroundColor = '#32CD32'
            }
            else {
                this.style.backgroundColor = '#B22222'
            }
        });

        this.shadowRoot.querySelector("#retourzeroButtonVideo").addEventListener("click", (event) => {
            this.playerVideo.currentTime = 0;
        });

    }


    play() {
        this.playerVideo.play();
    }

    pause() {
        this.playerVideo.pause();
    }

    currentTimeForward()
    {
        console.log(this.playerVideo.currentTime)
        this.playerVideo.currentTime += 10;
        console.log(this.playerVideo.currentTime)
    }

    currentTimeBack()
    {
        this.playerVideo.currentTime -= 10;
    }
}

customElements.define("my-videoplayer",MyVideoPlayer);
