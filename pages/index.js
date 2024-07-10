import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setContext(canvas.getContext("2d"));
    }
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
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
