import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.scale(2, 2); // Scaling for high DPI displays (optional)
      setContext(ctx);
    }
  }, []);

  const startDrawing = (e) => {
    const { clientX, clientY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(clientX, clientY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { clientX, clientY } = getCoordinates(e);
    context.lineTo(clientX, clientY);
    context.stroke();
  };

  const stopDrawing = () => {
    context.closePath();
    setIsDrawing(false);
  };

  const downloadSignature = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "signature.png";
      link.click();
    });
  };

  const getCoordinates = (e) => {
    let clientX, clientY;
    if (e.type === "mousedown" || e.type === "mousemove" || e.type === "mouseup" || e.type === "mouseleave") {
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    } else if (e.type === "touchstart" || e.type === "touchmove" || e.type === "touchend") {
      clientX = e.touches[0].clientX - canvasRef.current.offsetLeft;
      clientY = e.touches[0].clientY - canvasRef.current.offsetTop;
    }
    return { clientX, clientY };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-300"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button
        onClick={downloadSignature}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Download
      </button>
    </div>
  );
}
