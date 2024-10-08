const canvases = {
    front: document.getElementById("canvas"),
    middle: document.createElement("canvas"),
    back: document.createElement("canvas"),  
};

let contexts = {};
for (let key in canvases)
    contexts[key] = canvases[key].getContext("2d");


const uploadElement = document.getElementById("upload");

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


function render() {
    contexts.front.clearRect(0, 0, width, height);

    contexts.front.drawImage(canvases.back, 0, 0);
    contexts.front.drawImage(canvases.middle, 0, 0);

    if (x !== null && y !== null) {
        contexts.front.fillStyle = "rgba(255,255,255,0.5)";

        contexts.front.beginPath();
        contexts.front.arc(x, y, radius, 0, 2 * Math.PI);
        contexts.front.fill();
        contexts.front.closePath();
    }
}


uploadElement.onchange = () => {
    const file = uploadElement.files[0];
    
    if (file.type.split("/")[0] !== "image")
        return;

    const image = new Image();

    image.onload = () => {
        width = image.width;
        height = image.height;

        if (Math.max(width, height) > 1024) {
            let ratio = 1024. / Math.max(width, height);
            width *= ratio;
            height *= ratio;
            console.log(`Image resized by ${ratio}`);
        }

        for (let key in canvases) {
            canvases[key].width = width;
            canvases[key].height = height;        
        }

        contexts.back.drawImage(image, 0, 0, width, height);
        render();


        tools.brush.disabled = false;
        tools.eraser.disabled = false;

        console.log("Image loaded.");
    };

    image.src = URL.createObjectURL(file);
};

for (let key in downloadElements) {
    downloadElements[key].onclick = () => {
        if (width === null || height === null)
            return;
    
        downloadElements[key].href = canvases[key].toDataURL("type/png");
        downloadElements[key].click();
    };
}


let selectedTool = null;


tools.brush.onclick = () => {
    selectedTool = "brush";
    tools.brush.disabled = true;
    tools.eraser.disabled = false;
};


tools.eraser.onclick = () => {
    selectedTool = "eraser";
    tools.brush.disabled = false;
    tools.eraser.disabled = true;
};


tools.clear.onclick = () => {
    selectedTool = null;
    tools.brush.disabled = false;
    tools.eraser.disabled = false;
    tools.clear.disabled = true;

    contexts.middle.clearRect(0, 0, width, height);
    render();
};


onkeydown = (event) => {
    let delta = 0;

    switch (event.key.toLocaleLowerCase()) {
        case "j":
            delta = -1;
            break;
        
        case "k":
            delta = 1;
            break;
        
        default:
            break;
    }

    radius = Math.min(Math.max(5, radius + delta), Math.min(width, height)); // radius in [5, min(width, height)]
    render();
};


let mousePressed = false;


canvases.front.onmousedown = () => {
    mousePressed = true;
};


canvases.front.onmouseup = () => {
    mousePressed = false;
};


canvases.front.onmouseout = () => {
    x = null;
    y = null;
    render();
}


function update() {
    if (mousePressed && selectedTool !== null) {
        contexts.middle.beginPath();
        contexts.middle.arc(x, y, radius, 0, 2 * Math.PI);

        if (selectedTool == "brush") {
            contexts.middle.fillStyle = "rgba(255,255,255,1)";
            contexts.middle.fill();
        } else if (selectedTool == "eraser") {
            contexts.middle.save();
            contexts.middle.clip();
            contexts.middle.clearRect(0, 0, width, height);
            contexts.middle.restore();
        } else
            console.warn(`ERROR: tool '${selectedTool}' is not implemented`);

        contexts.middle.closePath();

        tools.clear.disabled = false;
    }

    contexts.front.drawImage(canvases.middle, 0, 0);
}


canvases.front.onmousemove = (event) => {
    x = event.offsetX;
    y = event.offsetY;

    update();
    render();
};