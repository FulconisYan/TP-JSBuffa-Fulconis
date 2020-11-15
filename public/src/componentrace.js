

export default class MyElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open"});
        this.connectedClallback()
    }


connectedClallback(){
    this.shadowRoot.innerHTML = `
    <style>
    #mainvid {
    width:990px;
    height:600px;
}
</style>
    <video id="mainvid" controls crossorigin="anonymous">
    <source src="video/race.mp4" type="video/mp4">
    <p>Votre navigateur ne supporte pas la vidéo HTML5 <a href="video/race.mp4">un lien vers la vidéo</a>.</p>
</video>
    <div>
        <button id="play">Play</button> <button id="pause">Pause</button> <button id="stop">Stop <button id="avant">+10</button></button> <button id="arriere">-10</button> <button id="loop">Loop</button> <button id="retourzero">Retour à zero</button>
    </div>
</div> `;
    }
}

customElements.define('my-player',MyElement)