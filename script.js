let model;
let webcam;
let maxPredictions;

let currentFacingMode = "user";
let lastUpdateTime = 0;

let labelContainer = document.getElementById("label-container");

const URL = "./my_model/";



async function loadModel() {

const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

model = await tmImage.load(modelURL, metadataURL);
maxPredictions = model.getTotalClasses();

}



window.init = async function () {

try {

await loadModel();

const flip = true;

webcam = new tmImage.Webcam(300, 300, flip);

await webcam.setup();
await webcam.play();

document.getElementById("webcam-container").innerHTML = "";
document.getElementById("webcam-container").appendChild(webcam.canvas);

window.requestAnimationFrame(loop);

console.log("Modelo carregado");

} catch (error) {

labelContainer.innerHTML = "Erro ao carregar modelo: " + error.message;

}

};



async function switchCamera() {

if (!webcam) return;

currentFacingMode = currentFacingMode === "user" ? "environment" : "user";

await webcam.stop();

const flip = currentFacingMode === "user";

webcam = new tmImage.Webcam(300, 300, flip);

await webcam.setup({ facingMode: currentFacingMode });

await webcam.play();

const container = document.getElementById("webcam-container");

container.innerHTML = "";

container.appendChild(webcam.canvas);

}



async function loop() {

if (webcam) {

webcam.update();

await predict();

}

window.requestAnimationFrame(loop);

}



async function predict() {

if (!model || !webcam) return;

const now = Date.now();

const prediction = await model.predict(webcam.canvas);

if (now - lastUpdateTime > 1000) {

predictClass(prediction);

lastUpdateTime = now;

}

}



function predictClass(prediction) {

let highestProb = 0;

let bestClass = "";

for (let i = 0; i < prediction.length; i++) {

if (prediction[i].probability > highestProb) {

highestProb = prediction[i].probability;

bestClass = prediction[i].className;

}

}

let statusColor = "#2ecc71";

if (
bestClass.toLowerCase().includes("no") ||
bestClass.toLowerCase().includes("sem")
) {

statusColor = "#e74c3c";

}

labelContainer.innerHTML = `
<div style="
background:#f0f0f0;
padding:15px;
border-radius:10px;
border-left:6px solid ${statusColor};
box-shadow:0 5px 15px rgba(0,0,0,0.1);
">

<strong>🔍 RESULTADO:</strong>

<h2 style="color:${statusColor};margin:10px 0;font-size:2em">
${bestClass.toUpperCase()}
</h2>

<small>Confiança: ${(highestProb * 100).toFixed(2)}%</small>

</div>
`;

}



const fileInput = document.getElementById("file-input");

fileInput.addEventListener("change", predictFromFile);



async function predictFromFile() {

const previewContainer = document.getElementById("file-preview-container");

if (!fileInput.files[0]) return;

if (!model) await loadModel();

const reader = new FileReader();

reader.onload = function (e) {

previewContainer.innerHTML = `
<img id="target-image"
src="${e.target.result}"
width="200"
height="200"
style="border-radius:8px;box-shadow:0 5px 15px rgba(0,0,0,0.2)">
`;

const img = document.getElementById("target-image");

img.onload = async () => {

const prediction = await model.predict(img);

predictClass(prediction);

};

};

reader.readAsDataURL(fileInput.files[0]);

}



window.addEventListener("beforeunload", () => {

if (webcam && webcam.stream) {

webcam.stream.getTracks().forEach(track => track.stop());

}

});