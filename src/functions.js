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