export const combineDrawing = (canvasRef) => {
    const width = canvasRef.current.props.canvasWidth;
    const height = canvasRef.current.props.canvasHeight;
    const backgroundColor = canvasRef.current.props.backgroundColor;
    const background = canvasRef.current.canvasContainer.children[0];
    const drawing = canvasRef.current.canvasContainer.children[1];
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // composite now
    canvas.getContext('2d').fillStyle = backgroundColor;
    canvas.getContext('2d').fillRect(0, 0, width, height);
    canvas.getContext('2d').drawImage(background, 0, 0);
    canvas.getContext('2d').globalAlpha = 1.0;
    canvas.getContext('2d').drawImage(drawing, 0, 0);

    const dataUri = canvas.toDataURL('image/png', 1.0);
    const data = dataUri.split(',')[1];
    const mimeType = dataUri.split(';')[0].slice(5);

    const bytes = window.atob(data);
    const buf = new ArrayBuffer(bytes.length);
    const arr = new Uint8Array(buf);

    for (let i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([arr], { type: mimeType });
    return { blob: blob, dataUri: dataUri };
}
export const saveImage = (blob, filename) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';

    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

const shortenAddress = (address, chars = 4) => {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}
export default shortenAddress