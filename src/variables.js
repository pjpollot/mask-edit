const canvases = {
    front: document.getElementById("canvas"),
    middle: document.createElement("canvas"),
    back: document.createElement("canvas"),  
};

let contexts = {};
for (let key in canvases)
    contexts[key] = canvases[key].getContext("2d");

const uploadElements = {
    middle: document.getElementById("upload-mask"),
    back: document.getElementById("upload-image"),
};

const downloadElements = {
    front: document.getElementById("download-image"),
    middle: document.getElementById("download-mask"),
    back: document.getElementById("download-back"),
};

const tools = {
    brush: document.getElementById("brush"),
    eraser: document.getElementById("eraser"),
    clear: document.getElementById("clear"), 
}

let width = null, height = null;
let x = null, y = null;
let radius = 20;

let selectedTool = null;

let mousePressed = false;