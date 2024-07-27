import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import ClearButton from "./ClearButton";
import DownloadButton from "./DownloadButton";
import UndoButton from "./UndoButton";

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      setContext(ctx);
      setDevicePixelRatio(window.devicePixelRatio || 1);
      resizeCanvas(canvas, ctx);
      window.addEventListener("resize", () => resizeCanvas(canvas, ctx));
    }
    return () => {
      window.removeEventListener("resize", () => resizeCanvas(canvas, ctx));
    };
  }, [devicePixelRatio]);

  const resizeCanvas = (canvas, ctx) => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  };

  const startDrawing = (e) => {
    const { clientX, clientY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(clientX - offset.x, clientY - offset.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { clientX, clientY } = getCoordinates(e);
    context.lineTo(clientX - offset.x, clientY - offset.y);
    context.stroke();
  };

  const stopDrawing = () => {
    context.closePath();
    setIsDrawing(false);
    saveCanvasState();
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL();
    setHistory((prevHistory) => [...prevHistory, imgData]);
  };

  const undoLastAction = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length <= 1) {
        clearCanvas();
        return [];
      } else {
        const newHistory = prevHistory.slice(0, -1);
        restoreCanvasState(newHistory[newHistory.length - 1]);
        return newHistory;
      }
    });
  };

  const restoreCanvasState = (imgData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imgData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        canvas.width / devicePixelRatio,
        canvas.height / devicePixelRatio
      );
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const clearSignature = () => {
    clearCanvas();
    setHistory([]);
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
    if (e.type.startsWith("mouse")) {
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    } else if (e.type.startsWith("touch")) {
      clientX =
        e.touches[0].clientX - canvasRef.current.getBoundingClientRect().left;
      clientY =
        e.touches[0].clientY - canvasRef.current.getBoundingClientRect().top;
    }
    return { clientX, clientY };
  };

  const handleScroll = () => {
    const rect = canvasRef.current.getBoundingClientRect();
    setOffset({ x: rect.left, y: rect.top });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <canvas
        ref={canvasRef}
        className="border border-gray-300"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ touchAction: "none" }} // Prevent default touch actions
      />
      <div className="mt-4 space-x-4">
        <ClearButton onClick={clearSignature} />
        <DownloadButton onClick={downloadSignature} />
        <UndoButton onClick={undoLastAction} />
      </div>
    </div>
  );
}
