let model;
let webcam;
let maxPredictions;

const MODEL_PATH = "./my_model/";

let lastPredictionTime = 0;

let predictionBuffer = [];
const bufferSize = 5;

let currentWord = "";
let words = [];

let history = [];

let lastGestureTime = Date.now();
const wordTimeout = 3000;

const confidenceThreshold = 0.75;
const cooldown = 1200;

let loopRunning = false;

const labelContainer = document.getElementById("label-container");
const sentenceContainer = document.getElementById("sentence");
const historyContainer = document.getElementById("history");

let currentMode = "webcam";

function setMode(mode) {

currentMode = mode;

document.getElementById("webcamSection").style.display =
mode === "webcam" ? "block" : "none";

document.getElementById("imageSection").style.display =
mode === "images" ? "block" : "none";

}

async function loadModel() {

try {

const modelURL = MODEL_PATH + "model.json";
const metadataURL = MODEL_PATH + "metadata.json";

model = await tmImage.load(modelURL, metadataURL);
maxPredictions = model.getTotalClasses();

console.log("Modelo carregado com sucesso");

} catch (error) {

console.error("Erro ao carregar modelo:", error);

}

}

async function init() {

try {

if (!model) await loadModel();

if (webcam) {
await webcam.stop();
}

webcam = new tmImage.Webcam(320, 320, true);

await webcam.setup();
await webcam.play();

document.getElementById("webcam-container").innerHTML = "";
document.getElementById("webcam-container").appendChild(webcam.canvas);

if (!loopRunning) {
loopRunning = true;
window.requestAnimationFrame(loop);
}

} catch (error) {

console.error("Erro ao iniciar webcam:", error);

}

}

async function loop() {

if (!webcam) return;

webcam.update();

await predict(webcam.canvas);

checkWordTimeout();

window.requestAnimationFrame(loop);

}

async function predict(source) {

if (!model) return;

const now = Date.now();

if (now - lastPredictionTime < cooldown) return;

const prediction = await model.predict(source);

let bestClass = "";
let bestProb = 0;

prediction.forEach(p => {

if (p.probability > bestProb) {

bestProb = p.probability;
bestClass = p.className;

}

});

if (bestProb > confidenceThreshold) {

predictionBuffer.push(bestClass);

if (predictionBuffer.length > bufferSize)
predictionBuffer.shift();

const allEqual = predictionBuffer.every(l => l === bestClass);

if (allEqual) {

showResult(bestClass, bestProb);

addToSentence(bestClass);

speak(bestClass);

predictionBuffer = [];

lastPredictionTime = now;

lastGestureTime = Date.now();

}

}

}

function showResult(letter, prob) {

labelContainer.innerHTML = `

<div style="font-size:40px">${letter}</div>

<div style="width:200px;height:8px;background:#1e293b;border-radius:5px;margin:10px auto">

<div style="
width:${prob * 100}%;
height:100%;
background:#38bdf8;
border-radius:5px;
"></div>

</div>

<div style="font-size:14px">
Confiança ${(prob * 100).toFixed(1)}%
</div>

`;

}

function addToSentence(letter) {

if (letter === "space") {

words.push(currentWord);
currentWord = "";

} else {

currentWord += letter;

}

sentenceContainer.innerText = words.join(" ") + " " + currentWord;

history.push(letter);

updateHistory();

}

function updateHistory() {

historyContainer.innerHTML = "";

history.slice(-15).forEach(l => {

const el = document.createElement("span");

el.innerText = l;

historyContainer.appendChild(el);

});

}

function clearSentence() {

words = [];
currentWord = "";

sentenceContainer.innerText = "";

}

function clearHistory() {

history = [];
historyContainer.innerHTML = "";

}

function clearImages() {

const input = document.getElementById("file-input");
const preview = document.getElementById("file-preview-container");

if (input) input.value = "";
if (preview) preview.innerHTML = "";

}

function speak(letter) {

try {

const speech = new SpeechSynthesisUtterance(letter);

speech.lang = "pt-BR";

speechSynthesis.speak(speech);

} catch (error) {

console.warn("Erro na fala:", error);

}

}

function checkWordTimeout() {

if (Date.now() - lastGestureTime > wordTimeout && currentWord !== "") {

words.push(currentWord);
currentWord = "";
sentenceContainer.innerText = words.join(" ");

}

}

async function validateImages() {

try {

if (!model) await loadModel();

const input = document.getElementById("file-input");
const preview = document.getElementById("file-preview-container");

if (!input.files.length) {

alert("Selecione imagens primeiro.");
return;

}

preview.innerHTML = "";

const files = [...input.files];

for (const file of files) {

const img = document.createElement("img");

img.src = URL.createObjectURL(file);

img.style.maxWidth = "120px";
img.style.margin = "5px";

preview.appendChild(img);

await new Promise(resolve => img.onload = resolve);

await predict(img);

}

} catch (error) {

console.error("Erro ao validar imagens:", error);

}

}

async function switchCamera() {

try {

if (!webcam) return;

await webcam.stop();

webcam = new tmImage.Webcam(320, 320, false);

await webcam.setup();
await webcam.play();

document.getElementById("webcam-container").innerHTML = "";
document.getElementById("webcam-container").appendChild(webcam.canvas);

} catch (error) {

console.error("Erro ao trocar câmera:", error);

}

}