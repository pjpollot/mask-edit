uploadElements.back.onchange = () => {
    const file = uploadElements.back.files[0];
    
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

        uploadElements.middle.disabled = false;

        console.log("Image loaded.");
    };

    image.src = URL.createObjectURL(file);
};


uploadElements.middle.onchange = () => {
    const file = uploadElements.middle.files[0];
    
    if (file.type.split("/")[0] !== "image")
        return;

    const mask = new Image();

    mask.onload = () => {
        if (mask.width !== width || mask.height !== height)
            console.warn("WARNING: the mask is resized to fit the picture.");

        contexts.middle.drawImage(mask, 0, 0, width, height);
        render();

        selectedTool = "brush";
        tools.brush.disabled = true;
        tools.eraser.disabled = false;
        tools.clear.disabled = false;

        console.log("Mask loaded.");
    };

    mask.src = URL.createObjectURL(file);
};


for (let key in downloadElements) {
    downloadElements[key].onclick = () => {
        if (width === null || height === null)
            return;
    
        downloadElements[key].href = canvases[key].toDataURL("type/png");
        downloadElements[key].click();
    };
}


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
            delta = -2;
            break;
        
        case "k":
            delta = 2;
            break;
        
        default:
            break;
    }

    radius = Math.min(Math.max(5, radius + delta), Math.min(width, height)); // radius in [5, min(width, height)]
    render();
};


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


canvases.front.onmousemove = (event) => {
    x = event.offsetX;
    y = event.offsetY;

    update();
    render();
};