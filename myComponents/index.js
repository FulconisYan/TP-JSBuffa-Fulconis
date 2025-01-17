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
        border:solid;
        display: inline-block;
        padding-right: 20px;
    }
    #soundEffect {
        border:solid;
        display: inline-block;
        padding-right: 200px;
    }
    #equalizer {
        margin-top: 20px;
        padding-right: 20px;
        padding-left: 20px;
    }
    #waveform{
        padding-left: 180px;
        padding-bottom: 10px;
        padding-top: 20px;
    }
    #myCanvas {
        border:1px solid;
        margin = 10px;
    }
    #balanceGaucheDroite {
        display: flex;
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
    #saxophoneImg{
        padding-top: 20px;
        margin-left: 40px;
        display: inline-block;
        position: relative;
    }
    #flexBox{
        display:flex;
    }
    #structureCSS{
        display:flex;
    }
    #knob-volume{
        padding-bottom: 30px;
        padding-left: 20px;
    }
    #turnButton{
        margin-bottom: 40px;
        padding-left:25px; 
    }
    #qualibreBouton{
        padding-left: 2px;
        padding-top: 150px;
    }
  </style>
  
<div id="structureCSS">
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
    <div id="flexBox">
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
    <div id="saxophoneImg">
        <img width="100" src="../assets/img/saxophone.png"/>
    </div>
    </div>
    <br/>
    <div id="waveform">
        <canvas id="MyCanvas" width="300" height="100"></canvas>
    </div> 
</div>
</div>
<div id ="balanceGaucheDroite">
    <div id="turnButton">
    <h2> Balance Gauche Droite </h2>
    <p> Qualibre la balance !</p>
    <webaudio-knob id="knob2" tooltip="Balance:%s" src="./assets/knobs/LittlePhatty.png" sprites="100" value=1 min="0" max="1" step=0.01>
        Balance</webaudio-knob>
    </div>
    <div id="qualibreBouton">
    <input type="button" id="qualibreBalance" value="Reinitialiser la balance"/>    
     </div>
</div>
</div>`;


let filters;

let bufferLength;

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
        this.audioContext = new AudioContext();

        this.mediaElement = this.shadowRoot.getElementById('myPlayer');


        this.mediaElement.addEventListener('play',() => this.audioContext.resume());

        this.loopButtonAudio = this.shadowRoot.querySelector("#loopButtonAudio")
        this.declareListeners();

        this.canvas = this.shadowRoot.querySelector("#myCanvas");
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.canvasContext = this.canvas.getContext("2d");

        this.gradient = this.canvasContext.createLinearGradient(0,0,0, this.height);
        this.gradient.addColorStop(1,'#000000');
        this.gradient.addColorStop(0.75,'#ff0000');
        this.gradient.addColorStop(0.25,'#ffff00');
        this.gradient.addColorStop(0,'#ffffff');

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 32;
        this.sourceNode = this.audioContext.createMediaElementSource(this.mediaElement);
        this.sourceNode.connect(this.analyser);
        //this connects our music back to the default output, such as your //speakers
        this.sourceNode.connect(this.audioContext.destination);
        this.donneesTableau = new Uint8Array(this.analyser.frequencyBinCount);

        this.stereoNode = new StereoPannerNode(this.audioContext, { pan: 0 });

        filters = this.setEqualizerContent(this.audioContext,this.sourceNode,this.mediaElement);
        console.log(filters);

        this.visualize();
    }

    drawWaveForm(dataArray) {
        this.canvasContext.save();
        // Get the analyser data

        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = 'lightBlue';

        // all the waveform is in one single path, first let's
        // clear any previous path that could be in the buffer
        this.canvasContext.beginPath();

        let sliceWidth = this.width / bufferLength;
        let x=0;

        // values go from 0 to 256 and the canvas heigt is 100. Let's rescale
        // before drawing. This is the scale factor

        for(let i = 0; i < bufferLength; i++) {
            // dataArray[i] between 0 and 255
            let v = dataArray[i] / 255;
            let y = v * height;

            if(i === 0) {
                this.canvasContext.moveTo(x, y);
            } else {
                this.canvasContext.lineTo(x, y);
            }

            x += sliceWidth;
        }
    }

    drawVolumeMeter(dataArray){
        this.canvasContext.save();

        let average = this.getAverageVolume(dataArray);

        // set the fill style to a nice gradient
        this.canvasContext.fillStyle= this.gradient;

        // draw the vertical meter
        this.canvasContext.fillRect(0,this.height-average,25,this.height);

        this.canvasContext.restore();
    }


    visualize() {

        this.analyser.getByteFrequencyData(this.donneesTableau);
        this.drawVolumeMeter(this.donneesTableau);
        this.drawWaveForm(this.donneesTableau);

        requestAnimationFrame(() => {
            this.visualize();
        })
    }

    getAverageVolume(array) {
        let values = 0;
        let average;

        let length = array.length;

        // get all the frequency amplitudes
        for (let i = 0; i < length; i++) {
            values += array[i];
        }

        average = values / length;
        return average;
    }


    setEqualizerContent(){
        let filters = [];
        // Set filters
        [60, 170, 350, 1000, 35000, 10000].forEach((freq,i) => {
            let eq = this.audioContext.createBiquadFilter();
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
        filters[filters.length - 1].connect(this.audioContext.destination);

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

        this.shadowRoot.querySelector("#qualibreBalance").addEventListener("click",(event) => {
           this.balancedBalance();
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

        this.shadowRoot.querySelector('#volume-slider').oninput = (e) => {
            this.playerAudio.volume = e.target.value;
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

    balancedBalance(){
        console.log(this.stereoNode);
        this.stereoNode.pan.value = 0;
        this.shadowRoot.querySelector("#knob2").value = 0.5;
    }
    leftRight(value){


        // change the value of the balance by updating the pan value
        this.stereoNode.pan.value = value < 0.3 ? -1 : value > 0.7 ? 1 : 0;
        this.source.connect(this.stereoNode).connect(this.audioContext.destination);
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
