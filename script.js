let model;
let webcam;
let maxPredictions;

const MODEL_PATH="./my_model/";

let lastPredictionTime=0;

let predictionBuffer=[];
const bufferSize=5;

let currentWord="";
let words=[];

let history=[];

let lastGestureTime=Date.now();
const wordTimeout=3000;

const confidenceThreshold=0.75;
const cooldown=1200;

const labelContainer=document.getElementById("label-container");
const sentenceContainer=document.getElementById("sentence");
const historyContainer=document.getElementById("history");

async function loadModel(){

const modelURL=MODEL_PATH+"model.json";
const metadataURL=MODEL_PATH+"metadata.json";

model=await tmImage.load(modelURL,metadataURL);
maxPredictions=model.getTotalClasses();

}

async function init(){

if(!model) await loadModel();

webcam=new tmImage.Webcam(320,320,true);

await webcam.setup();
await webcam.play();

document.getElementById("webcam-container").innerHTML="";
document.getElementById("webcam-container").appendChild(webcam.canvas);

window.requestAnimationFrame(loop);

}

async function loop(){

webcam.update();

await predict(webcam.canvas);

checkWordTimeout();

window.requestAnimationFrame(loop);

}

async function predict(source){

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

predictionBuffer.push(bestClass);

if(predictionBuffer.length>bufferSize)
predictionBuffer.shift();

const allEqual=predictionBuffer.every(l=>l===bestClass);

if(allEqual){

showResult(bestClass,bestProb);

addToSentence(bestClass);

speak(bestClass);

predictionBuffer=[];

lastPredictionTime=now;

lastGestureTime=Date.now();

}

}

}

function showResult(letter,prob){

labelContainer.innerHTML=`

<div style="font-size:40px">${letter}</div>

<div style="width:200px;height:8px;background:#1e293b;border-radius:5px;margin:10px auto">

<div style="
width:${prob*100}%;
height:100%;
background:#38bdf8;
border-radius:5px;
"></div>

</div>

<div style="font-size:14px">
Confiança ${(prob*100).toFixed(1)}%
</div>

`;

}

function addToSentence(letter){

if(letter==="space"){

words.push(currentWord);
currentWord="";

}else{

currentWord+=letter;

}

sentenceContainer.innerText=words.join(" ")+" "+currentWord;

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

words=[];
currentWord="";

sentenceContainer.innerText="";

}

function clearHistory(){

history=[];
historyContainer.innerHTML="";

}

function clearImages(){

document.getElementById("file-input").value="";
document.getElementById("file-preview-container").innerHTML="";

}

function speak(letter){

const speech=new SpeechSynthesisUtterance(letter);

speech.lang="pt-BR";

speechSynthesis.speak(speech);

}

function checkWordTimeout(){

if(Date.now()-lastGestureTime>wordTimeout && currentWord!==""){

words.push(currentWord);
currentWord="";
sentenceContainer.innerText=words.join(" ");

}

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

await new Promise(resolve=>img.onload=resolve);

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