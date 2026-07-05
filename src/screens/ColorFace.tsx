import { useRef, useState } from "react";

const COLORS = ["#e63946", "#f4a261", "#e9c46a", "#2a9d8f", "#264653", "#8338ec", "#ff70a6", "#ffffff", "#000000"];

export default function ColorFace() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxW = 380;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      imageRef.current = img;
      setHasPhoto(true);
    };
    img.src = url;
  }

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    lastPoint.current = getPos(e);
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e);
    const last = lastPoint.current ?? pos;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPoint.current = pos;
  }

  function endDraw() {
    drawing.current = false;
    lastPoint.current = null;
  }

  function clearDrawing() {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  function save() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "mit-eventyr-ansigt.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function retake() {
    setHasPhoto(false);
    imageRef.current = null;
  }

  return (
    <div className="screen colorface-screen">
      <h2>🎨 Farvelæg dig selv</h2>
      <p className="instructions">Tag en selfie og gør dig helt vild med farver!</p>

      {!hasPhoto && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFile}
            style={{ display: "none" }}
          />
          <button className="big-button primary" onClick={() => fileInputRef.current?.click()}>
            🤳 Tag selfie
          </button>
        </>
      )}

      <canvas
        ref={canvasRef}
        className="color-canvas"
        style={{ display: hasPhoto ? "block" : "none" }}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
      />

      {hasPhoto && (
        <>
          <div className="color-palette">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`color-swatch ${color === c ? "selected" : ""}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className="brush-size-row">
            <label>Pensel: </label>
            <input
              type="range"
              min={2}
              max={30}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
          </div>
          <div className="button-row">
            <button className="big-button secondary" onClick={clearDrawing}>
              🧽 Ryd farver
            </button>
            <button className="big-button secondary" onClick={save}>
              💾 Gem billede
            </button>
            <button className="big-button secondary" onClick={retake}>
              🔄 Nyt foto
            </button>
          </div>
        </>
      )}
    </div>
  );
}
