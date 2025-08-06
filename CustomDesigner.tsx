import { useRef, useState } from "react";
import Ribbon from "@/components/Ribbon";
import EditorCanvas from "@/components/EditorCanvas";

// Define shape type for TypeScript
type Shape = {
  id: number;
  type: "rectangle" | "circle" | "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
};

// Track info when placing a shape
type PlacingShape = {
  type: "rectangle" | "circle" | "triangle";
  startX: number;
  startY: number;
};

export default function CustomDesigner() {
  const [command, setCommand] = useState("");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [placingShape, setPlacingShape] = useState<PlacingShape | null>(null);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Start placing mode when shape button clicked
  const startPlacing = (type: "rectangle" | "circle" | "triangle") => {
    setPlacingShape(null);
    setPreviewShape(null);
    setPlacingShape({ type, startX: 0, startY: 0 });
  };

  // Handle mouse down on canvas to start placing shape
  const onCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placingShape) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setPlacingShape({ ...placingShape, startX, startY });

    setPreviewShape({
      id: -1,
      type: placingShape.type,
      x: startX,
      y: startY,
      width: 0,
      height: 0,
    });
  };

  // Handle mouse move to update preview shape size
  const onCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placingShape || !previewShape) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const newWidth = Math.abs(currentX - placingShape.startX);
    const newHeight = Math.abs(currentY - placingShape.startY);
    const newX = Math.min(currentX, placingShape.startX);
    const newY = Math.min(currentY, placingShape.startY);

    setPreviewShape({
      ...previewShape,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });
  };

  // Handle mouse up to finalize shape
  const onCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewShape) return;

    if (previewShape.width > 10 && previewShape.height > 10) {
      setShapes((prev) => [...prev, { ...previewShape, id: Date.now() }]);
    }
    setPreviewShape(null);
    setPlacingShape(null);
  };

  const handleCommand = (cmd: string, value?: string) => {
    setCommand(cmd);

    // Focus editor
    if (editorRef.current) {
      editorRef.current.focus();
    }

    if (cmd === "insertRectangle" || cmd === "insertCircle" || cmd === "insertTriangle") {
      startPlacing(cmd.replace("insert", "").toLowerCase() as "rectangle" | "circle" | "triangle");
      return;
    }

    // Text commands
    if (cmd === "bold") document.execCommand("bold");
    if (cmd === "italic") document.execCommand("italic");
    if (cmd === "underline") document.execCommand("underline");
    if (cmd === "insertPlaceholder") document.execCommand("insertText", false, "{{clientName}}");
    if (cmd === "textColor" && value) document.execCommand("foreColor", false, value);

    setTimeout(() => setCommand(""), 50);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      {/* Header with title */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Custom Designer</h1>
              <p className="text-slate-600 text-sm">Create professional documents with shapes and rich text</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ready to design</span>
            </div>
          </div>
        </div>
      </div>

      <Ribbon onCommand={handleCommand} />
      <EditorCanvas
        shapes={shapes}
        setShapes={setShapes}
        previewShape={previewShape}
        editorRef={editorRef}
        onCanvasMouseDown={onCanvasMouseDown}
        onCanvasMouseMove={onCanvasMouseMove}
        onCanvasMouseUp={onCanvasMouseUp}
      />
    </div>
  );
}