import React, { useRef, useEffect, useState } from "react";

type Shape = {
  id: number;
  type: "rectangle" | "circle" | "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function EditorCanvas({
  shapes,
  setShapes,
  previewShape,
  editorRef,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
}: {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  previewShape: Shape | null;
  editorRef: React.RefObject<HTMLDivElement>;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onCanvasMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<"right" | "bottom" | null>(null);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startSize = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Start dragging a shape
  const onShapeMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  // Start resizing a shape
  const onResizeMouseDown = (dir: "right" | "bottom", e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    setResizeDir(dir);
    startPos.current = { x: e.clientX, y: e.clientY };
    if (selectedId !== null) {
      const shape = shapes.find((s) => s.id === selectedId);
      if (shape) {
        startSize.current = { width: shape.width, height: shape.height };
      }
    }
  };

  // Handle mouse movement for drag/resize
  const onMouseMove = (e: MouseEvent) => {
    if (dragging && selectedId !== null) {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === selectedId
            ? { ...shape, x: shape.x + dx, y: shape.y + dy }
            : shape
        )
      );
      startPos.current = { x: e.clientX, y: e.clientY };
    } else if (resizing && selectedId !== null && resizeDir) {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      setShapes((prev) =>
        prev.map((shape) => {
          if (shape.id === selectedId) {
            if (resizeDir === "right") {
              return {
                ...shape,
                width: Math.max(20, startSize.current.width + dx),
              };
            } else if (resizeDir === "bottom") {
              return {
                ...shape,
                height: Math.max(20, startSize.current.height + dy),
              };
            }
          }
          return shape;
        })
      );
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setResizeDir(null);
  };

  useEffect(() => {
    if (dragging || resizing) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [dragging, resizing]);

  // Render resize handles (right and bottom)
  const renderResizeHandles = (id: number, isTriangle = false) => (
    <>
      <div
        onMouseDown={(e) => onResizeMouseDown("right", e)}
        className="absolute top-0 right-0 w-3 h-full cursor-ew-resize bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-colors"
        style={isTriangle ? { top: "0", right: "-10px", height: "25px", borderRadius: "0 4px 4px 0" } : { borderRadius: "0 4px 4px 0" }}
      />
      <div
        onMouseDown={(e) => onResizeMouseDown("bottom", e)}
        className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-colors"
        style={isTriangle ? { bottom: "-10px", left: "-12px", width: "35px", borderRadius: "0 0 4px 4px" } : { borderRadius: "0 0 4px 4px" }}
      />
    </>
  );

  // Render individual shape or preview shape (if isPreview=true disables interaction)
  const renderShape = (
    shape: Shape,
    isPreview = false
  ) => {
    const isSelected = selectedId === shape.id && !isPreview;
    
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      top: shape.y,
      left: shape.x,
      width: shape.width,
      height: shape.height,
      cursor: isPreview ? "default" : "move",
      outline: isSelected ? "2px solid #3B82F6" : "none",
      outlineOffset: "2px",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: isPreview ? 0.6 : 1,
      pointerEvents: isPreview ? "none" : "auto",
      boxShadow: isSelected ? "0 8px 25px rgba(59, 130, 246, 0.3)" : isPreview ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s ease",
    };

    switch (shape.type) {
      case "rectangle":
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              background: isPreview 
                ? "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)" 
                : "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
              borderRadius: "8px",
              border: isSelected ? "1px solid #60A5FA" : "1px solid rgba(255, 255, 255, 0.2)",
            }}
            onMouseDown={isPreview ? undefined : (e) => onShapeMouseDown(shape.id, e)}
          >
            {!isPreview && isSelected && renderResizeHandles(shape.id)}
          </div>
        );

      case "circle":
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              borderRadius: "50%",
              background: isPreview 
                ? "linear-gradient(135deg, #34D399 0%, #10B981 100%)" 
                : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              border: isSelected ? "1px solid #34D399" : "1px solid rgba(255, 255, 255, 0.2)",
            }}
            onMouseDown={isPreview ? undefined : (e) => onShapeMouseDown(shape.id, e)}
          >
            {!isPreview && isSelected && renderResizeHandles(shape.id)}
          </div>
        );

      case "triangle":
        return (
          <div
            key={shape.id}
            style={{
              position: "absolute",
              top: shape.y,
              left: shape.x,
              width: 0,
              height: 0,
              borderLeft: `${shape.width / 2}px solid transparent`,
              borderRight: `${shape.width / 2}px solid transparent`,
              borderBottom: `${shape.height}px solid ${isPreview ? "#F97316" : "#EA580C"}`,
              cursor: isPreview ? "default" : "move",
              outline: isSelected ? "2px solid #FB923C" : "none",
              outlineOffset: "4px",
              userSelect: "none",
              opacity: isPreview ? 0.6 : 1,
              pointerEvents: isPreview ? "none" : "auto",
              filter: isSelected 
                ? "drop-shadow(0 8px 25px rgba(251, 146, 60, 0.3))" 
                : isPreview 
                  ? "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))" 
                  : "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))",
              transition: "all 0.2s ease",
            }}
            onMouseDown={isPreview ? undefined : (e) => onShapeMouseDown(shape.id, e)}
          >
            {!isPreview && isSelected && renderResizeHandles(shape.id, true)}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-y-auto overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative bg-white rounded-xl shadow-xl border border-slate-200 p-8 min-h-[700px] overflow-hidden"
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
        >
          {/* Canvas Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 rounded-t-xl">
            <h3 className="text-lg font-semibold">Design Canvas</h3>
            <p className="text-slate-300 text-sm">Click and drag to create shapes, then drag to move or resize</p>
          </div>

          {/* Canvas Content */}
          <div className="pt-20">
            {/* Render all shapes */}
            {shapes.map((shape) => renderShape(shape))}

            {/* Render preview shape if any */}
            {previewShape && renderShape(previewShape, true)}

            {/* Text editor area */}
            <div className="mt-12">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-1 mb-4">
                <h4 className="text-center text-blue-700 font-semibold text-sm">Editable Text Area</h4>
              </div>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="relative z-10 p-6 bg-white border-2 border-dashed border-slate-300 rounded-lg min-h-[200px] focus:outline-none focus:border-blue-400 focus:bg-blue-50/50 transition-all duration-200"
                style={{ 
                  color: "black",
                  lineHeight: "1.6"
                }}
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Document Template</h2>
                <p className="text-slate-600 mb-4">
                  Edit this content freely. You can format text and insert dynamic fields like <span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800 font-mono">{"{{clientName}}"}</span>
                </p>
                <p className="text-slate-500 text-sm">
                  This area supports rich text formatting and integrates with the shapes above for complete design flexibility.
                </p>
              </div>
            </div>
          </div>

          {/* Shape count indicator */}
          {shapes.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
              <span className="text-sm text-slate-600">
                {shapes.length} shape{shapes.length !== 1 ? 's' : ''} on canvas
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}