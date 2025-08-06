import React, { useRef, useEffect, useState } from "react";

type Shape = {
  id: number;
  type: "rectangle" | "circle" | "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
};

type ContextMenu = {
  visible: boolean;
  x: number;
  y: number;
  shapeId: number | null;
};

const colors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Red", value: "#EF4444" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F97316" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Gray", value: "#6B7280" },
];

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
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ visible: false, x: 0, y: 0, shapeId: null });
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startSize = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Start dragging a shape
  const onShapeMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  // Handle right-click context menu
  const onShapeRightClick = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      shapeId: id
    });
  };

  // Change shape color
  const changeShapeColor = (shapeId: number, color: string) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId ? { ...shape, color } : shape
      )
    );
    setContextMenu({ visible: false, x: 0, y: 0, shapeId: null });
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

  // Close context menu when clicking elsewhere
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (contextMenu.visible) {
      setContextMenu({ visible: false, x: 0, y: 0, shapeId: null });
    }
    setSelectedId(null);
    onCanvasMouseDown(e);
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

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, shapeId: null });
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu.visible]);

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

  // Get shape color (with fallback to default colors)
  const getShapeColor = (shape: Shape, isPreview = false) => {
    const customColor = shape.color;
    
    switch (shape.type) {
      case "rectangle":
        return customColor || (isPreview ? "#60A5FA" : "#3B82F6");
      case "circle":
        return customColor || (isPreview ? "#34D399" : "#10B981");
      case "triangle":
        return customColor || (isPreview ? "#F97316" : "#EA580C");
      default:
        return "#3B82F6";
    }
  };

  // Render individual shape or preview shape (if isPreview=true disables interaction)
  const renderShape = (
    shape: Shape,
    isPreview = false
  ) => {
    const isSelected = selectedId === shape.id && !isPreview;
    const shapeColor = getShapeColor(shape, isPreview);
    
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
              background: `linear-gradient(135deg, ${shapeColor} 0%, ${shapeColor}dd 100%)`,
              borderRadius: "8px",
              border: isSelected ? "1px solid #60A5FA" : "1px solid rgba(255, 255, 255, 0.2)",
            }}
            onMouseDown={isPreview ? undefined : (e) => onShapeMouseDown(shape.id, e)}
            onContextMenu={isPreview ? undefined : (e) => onShapeRightClick(shape.id, e)}
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
              background: `linear-gradient(135deg, ${shapeColor} 0%, ${shapeColor}dd 100%)`,
              border: isSelected ? "1px solid #34D399" : "1px solid rgba(255, 255, 255, 0.2)",
            }}
            onMouseDown={isPreview ? undefined : (e) => onShapeMouseDown(shape.id, e)}
            onContextMenu={isPreview ? undefined : (e) => onShapeRightClick(shape.id, e)}
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
              borderBottom: `${shape.height}px solid ${shapeColor}`,
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
            onContextMenu={isPreview ? undefined : (e) => onShapeRightClick(shape.id, e)}
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
          onMouseDown={handleCanvasClick}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
          style={{ 
            backgroundImage: `
              radial-gradient(circle at 20px 20px, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            cursor: selectedId !== null ? "crosshair" : "default"
          }}
        >
          {/* Canvas Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 rounded-t-xl">
            <h3 className="text-lg font-semibold">Design Canvas</h3>
            <p className="text-slate-300 text-sm">Click and drag to create shapes, then drag to move or resize</p>
          </div>

          {/* Canvas Content - Now completely blank */}
          <div className="pt-20">
            {/* Render all shapes */}
            {shapes.map((shape) => renderShape(shape))}
            {/* Render preview shape if any */}
            {previewShape && renderShape(previewShape, true)}
          </div>

          {/* Shape count indicator */}
          {shapes.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
              <span className="text-sm text-slate-600">
                {shapes.length} shape{shapes.length !== 1 ? 's' : ''} on canvas
              </span>
            </div>
          )}

          {/* Context Menu for Shape Color Change */}
          {contextMenu.visible && (
            <div
              className="fixed bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50"
              style={{
                top: contextMenu.y,
                left: contextMenu.x,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1 text-xs font-semibold text-slate-600 border-b border-slate-100 mb-1">
                Change Color
              </div>
              <div className="grid grid-cols-4 gap-1 p-2 max-w-[200px]">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    className="w-8 h-8 rounded border border-slate-300 shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    onClick={() => contextMenu.shapeId && changeShapeColor(contextMenu.shapeId, color.value)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}