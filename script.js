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
const wordTimeout=2000;

const confidenceThreshold=0.75;
const cooldown=1200;

const labelContainer=document.getElementById("label-container");
const sentenceContainer=document.getElementById("sentence");
const historyContainer=document.getElementById("history");

let currentMode="webcam";

let isRunning=false;
let animationId=null;



/* =========================
   CORREÇÃO AUTOMÁTICA
========================= */

const autoCorrect={

helo:"hello",
vc:"você",
tb:"também",
obg:"obrigado",
oii:"oi"

};



function correctWord(word){

if(autoCorrect[word.toLowerCase()])
return autoCorrect[word.toLowerCase()];

return word;

}



/* =========================
   MODOS
========================= */

function setMode(mode){

currentMode=mode;

document.getElementById("webcamSection").style.display=
mode==="webcam"?"block":"none";

document.getElementById("imageSection").style.display=
mode==="images"?"block":"none";

stopDetection();

if(mode==="webcam"){
init();
}

}



/* =========================
   MODEL
========================= */

async function loadModel(){

const modelURL=MODEL_PATH+"model.json";
const metadataURL=MODEL_PATH+"metadata.json";

model=await tmImage.load(modelURL,metadataURL);
maxPredictions=model.getTotalClasses();

}



/* =========================
   WEBCAM
========================= */

async function init(){

if(!model) await loadModel();

webcam=new tmImage.Webcam(320,320,true);

await webcam.setup();
await webcam.play();

document.getElementById("webcam-container").innerHTML="";
document.getElementById("webcam-container").appendChild(webcam.canvas);

isRunning=true;

loop();

}



function stopDetection(){

isRunning=false;

if(animationId){
cancelAnimationFrame(animationId);
animationId=null;
}

if(webcam){
webcam.stop();
webcam=null;
}

}



/* =========================
   LOOP
========================= */

async function loop(){

if(!isRunning) return;

webcam.update();

await predict(webcam.canvas);

checkWordTimeout();

animationId=requestAnimationFrame(loop);

}



/* =========================
   IA PREDICTION
========================= */

async function predict(source){

const now=Date.now();

if(now-lastPredictionTime<cooldown) return;

const prediction=await model.predict(source);

/* ordenar probabilidades */

prediction.sort((a,b)=>b.probability-a.probability);

const best=prediction[0];

if(best.probability>confidenceThreshold){

predictionBuffer.push(best.className);

if(predictionBuffer.length>bufferSize)
predictionBuffer.shift();

const stable=predictionBuffer.every(l=>l===best.className);

if(stable){

showResult(prediction);

addToSentence(best.className);

predictionBuffer=[];

lastPredictionTime=now;

lastGestureTime=Date.now();

}

}

}



/* =========================
   MOSTRAR RESULTADO
========================= */

function showResult(prediction){

const top3=prediction.slice(0,3);

labelContainer.innerHTML="";

top3.forEach(p=>{

const bar=document.createElement("div");

bar.innerHTML=`

<div style="font-size:18px">${p.className}</div>

<div style="width:220px;height:8px;background:#1e293b;border-radius:5px;margin:5px auto">

<div style="
width:${p.probability*100}%;
height:100%;
background:#38bdf8;
border-radius:5px;
"></div>

</div>

<div style="font-size:12px">
${(p.probability*100).toFixed(1)}%
</div>

`;

labelContainer.appendChild(bar);

});

}



/* =========================
   FRASE
========================= */

function addToSentence(letter){

if(letter==="space"){

if(currentWord!==""){

const corrected=correctWord(currentWord);

words.push(corrected);

currentWord="";

}

}else{

currentWord+=letter;

}

sentenceContainer.innerText=words.join(" ")+" "+currentWord;

history.push(letter);

updateHistory();

}



/* =========================
   HISTÓRICO
========================= */

function updateHistory(){

historyContainer.innerHTML="";

history.slice(-15).forEach(l=>{

const el=document.createElement("span");

el.innerText=l;

historyContainer.appendChild(el);

});

}



/* =========================
   LIMPAR
========================= */

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



/* =========================
   CONFIRMAÇÃO AUTOMÁTICA
========================= */

function checkWordTimeout(){

if(Date.now()-lastGestureTime>wordTimeout && currentWord!==""){

const corrected=correctWord(currentWord);

words.push(corrected);

currentWord="";

sentenceContainer.innerText=words.join(" ");

speakSentence();

}

}



/* =========================
   VOZ
========================= */

function speakSentence(){

if(words.length===0) return;

const phrase=words.join(" ");

const speech=new SpeechSynthesisUtterance(phrase);

speech.lang="pt-BR";

speechSynthesis.speak(speech);

}



/* =========================
   IMAGENS
========================= */

async function validateImages(){

stopDetection();

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



/* =========================
   TROCAR CAMERA
========================= */

async function switchCamera(){

if(!webcam) return;

await webcam.stop();

webcam=new tmImage.Webcam(320,320,false);

await webcam.setup();
await webcam.play();

document.getElementById("webcam-container").innerHTML="";
document.getElementById("webcam-container").appendChild(webcam.canvas);

}