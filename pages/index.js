// yo code le React ko hooks import garcha
import { useRef, useState, useEffect } from "react";
// yo code le canvas lai image ma convert garna html2canvas import garcha
import html2canvas from "html2canvas";
// yo custom components import garcha buttons ko lagi
import ClearButton from "./ClearButton";
import DownloadButton from "./DownloadButton";
import UndoButton from "./UndoButton";

// yo main functional component ho jasko naam "Home" cha
export default function Home() {
  // canvas reference store garna useRef use garcha
  const canvasRef = useRef(null);
  // drawing state track garna state hook use garcha
  const [isDrawing, setIsDrawing] = useState(false);
  // canvas ko context rakhauna state use garcha
  const [context, setContext] = useState(null);
  // offset ko value save garna state use garcha
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // canvas history ko lagi array ko state maintain garcha
  const [history, setHistory] = useState([]);
  // device pixel ratio track garna state hook use garcha
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);

  // yo effect le canvas initialize garcha
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // canvas ko 2D context set garcha
      const ctx = canvas.getContext("2d");
      setContext(ctx);
      // device pixel ratio set garcha
      setDevicePixelRatio(window.devicePixelRatio || 1);
      // canvas ko size adjust garcha
      resizeCanvas(canvas, ctx);
      // resize event listener add garcha
      window.addEventListener("resize", () => resizeCanvas(canvas, ctx));
    }
    // clean-up function le event listener hataucha
    return () => {
      window.removeEventListener("resize", () => resizeCanvas(canvas, ctx));
    };
  }, [devicePixelRatio]);

  // yo function le canvas ko size resize garcha
  const resizeCanvas = (canvas, ctx) => {
    const rect = canvas.getBoundingClientRect();
    // canvas ko width ra height adjust garcha
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    // scaling adjust garcha
    ctx.scale(devicePixelRatio, devicePixelRatio);
  };

  // mouse/touch event le drawing start garcha
  const startDrawing = (e) => {
    const { clientX, clientY } = getCoordinates(e);
    // path suru garcha
    context.beginPath();
    // cursor ko position le move garcha
    context.moveTo(clientX - offset.x, clientY - offset.y);
    // drawing mode true garcha
    setIsDrawing(true);
  };

  // yo function le drawing ko process handle garcha
  const draw = (e) => {
    if (!isDrawing) return; // drawing mode false bhaye return garcha
    const { clientX, clientY } = getCoordinates(e);
    // cursor ko position ko path draw garcha
    context.lineTo(clientX - offset.x, clientY - offset.y);
    context.stroke(); // stroke render garcha
  };

  // drawing complete hune function
  const stopDrawing = () => {
    context.closePath(); // path close garcha
    setIsDrawing(false); // drawing mode off garcha
    saveCanvasState(); // current canvas state save garcha
  };

  // yo function le current canvas state history ma save garcha
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL();
    setHistory((prevHistory) => [...prevHistory, imgData]);
  };

  // undo action ko lagi history ma last state restore garcha
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

  // yo function le canvas state restore garcha
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

  // canvas clear garne function
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // canvas signature clear garcha
  const clearSignature = () => {
    clearCanvas();
    setHistory([]);
  };

  // signature download garna function
  const downloadSignature = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "signature.png";
      link.click();
    });
  };

  // mouse/touch ko coordinates return garcha
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

  // scroll event ko offset update garcha
  const handleScroll = () => {
    const rect = canvasRef.current.getBoundingClientRect();
    setOffset({ x: rect.left, y: rect.top });
  };

  // scroll event listener add/remove garcha
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // component layout render garcha
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
        style={{ touchAction: "none" }} // default touch actions prevent garcha
      />
      <div className="mt-4 space-x-4">
        <ClearButton onClick={clearSignature} />
        <DownloadButton onClick={downloadSignature} />
        <UndoButton onClick={undoLastAction} />
      </div>
    </div>
  );
}
