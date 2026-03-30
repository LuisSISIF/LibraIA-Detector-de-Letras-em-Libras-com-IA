let model;
let webcam;
let maxPredictions;

const URL="./my_model/";

let lastPredictionTime=0;

let sentence=[];
let history=[];

let currentMode="webcam";

const confidenceThreshold=0.75;

const cooldown=1200;

const labelContainer=document.getElementById("label-container");

const sentenceContainer=document.getElementById("sentence");

const historyContainer=document.getElementById("history");



async function loadModel(){

const modelURL=URL+"model.json";
const metadataURL=URL+"metadata.json";

model=await tmImage.load(modelURL,metadataURL);
maxPredictions=model.getTotalClasses();

}



function setMode(mode){

currentMode=mode;

document.getElementById("webcamSection").style.display=
mode==="webcam"?"block":"none";

document.getElementById("imageSection").style.display=
mode==="images"?"block":"none";

}



async function init(){

if(!model) await loadModel();

const flip=true;

webcam=new tmImage.Webcam(320,320,flip);

await webcam.setup();

await webcam.play();

document.getElementById("webcam-container").innerHTML="";

document.getElementById("webcam-container").appendChild(webcam.canvas);

window.requestAnimationFrame(loop);

}



async function loop(){

webcam.update();

await predict(webcam.canvas);

window.requestAnimationFrame(loop);

}



async function predict(source){

if(!model) return;

const now=Date.now();

if(now-lastPredictionTime<cooldown) return;

const prediction=await model.predict(source);

let bestClass="";
let bestProb=0;

prediction.forEach(p=>{

if(p.probability>bestProb){

bestProb=p.probability;
bestClass=p.className;

}

});

if(bestProb>confidenceThreshold){

showResult(bestClass,bestProb);

addToSentence(bestClass);

speak(bestClass);

lastPredictionTime=now;

}

}



function showResult(letter,prob){

labelContainer.innerHTML=`

<div>

${letter}

<div style="font-size:14px;opacity:0.7">

Confiança ${(prob*100).toFixed(1)}%

</div>

</div>

`;

}



function addToSentence(letter){

sentence.push(letter);

sentenceContainer.innerText=sentence.join(" ");

history.push(letter);

updateHistory();

}



function updateHistory(){

historyContainer.innerHTML="";

history.slice(-15).forEach(l=>{

const el=document.createElement("span");

el.innerText=l;

historyContainer.appendChild(el);

});

}



function clearSentence(){

sentence=[];

sentenceContainer.innerText="";

}



function speak(letter){

const speech=new SpeechSynthesisUtterance(letter);

speech.lang="pt-BR";

speechSynthesis.speak(speech);

}



async function validateImages(){

if(!model) await loadModel();

const input=document.getElementById("file-input");

const preview=document.getElementById("file-preview-container");

preview.innerHTML="";

const files=[...input.files];

for(const file of files){

const img=document.createElement("img");

img.src=URL.createObjectURL(file);

preview.appendChild(img);

await new Promise(r=>img.onload=r);

await predict(img);

}

}



async function switchCamera(){

if(!webcam) return;

await webcam.stop();

webcam=new tmImage.Webcam(320,320,false);

await webcam.setup();

await webcam.play();

document.getElementById("webcam-container").innerHTML="";

document.getElementById("webcam-container").appendChild(webcam.canvas);

}