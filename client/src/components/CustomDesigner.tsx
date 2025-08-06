import { useRef, useState } from "react";
import Ribbon from "./Ribbon";
import EditorCanvas from "./EditorCanvas";

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

// Define the complete design data structure for copy/paste
type DesignData = {
  shapes: Shape[];
  textContent: string;
  timestamp: number;
};

export default function CustomDesigner() {
  const [command, setCommand] = useState("");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [placingShape, setPlacingShape] = useState<PlacingShape | null>(null);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);
  const [copiedData, setCopiedData] = useState<DesignData | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Start placing mode when shape button clicked
  const startPlacing = (type: "rectangle" | "circle" | "triangle") => {
    setPlacingShape(null);
    setPreviewShape(null);
    setPlacingShape({ type, startX: 0, startY: 0 });
  };

  // Copy all content (shapes + text)
  const copyEverything = async () => {
    try {
      const textContent = editorRef.current?.innerHTML || "";
      const designData: DesignData = {
        shapes: shapes,
        textContent: textContent,
        timestamp: Date.now()
      };
      
      // Save to component state
      setCopiedData(designData);
      
      // Also try to save to clipboard as JSON (for external sharing)
      await navigator.clipboard.writeText(JSON.stringify(designData, null, 2));
      
      // Show success feedback
      alert("Everything copied! You can now paste it back or share the JSON data.");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Copy failed. Please try again.");
    }
  };

  // Paste all content (shapes + text)
  const pasteEverything = async () => {
    try {
      let dataToRestore: DesignData | null = null;
      
      // First try to get from clipboard
      try {
        const clipboardText = await navigator.clipboard.readText();
        const parsedData = JSON.parse(clipboardText);
        if (parsedData.shapes && parsedData.textContent !== undefined) {
          dataToRestore = parsedData;
        }
      } catch (clipboardError) {
        console.log("No valid data in clipboard, using internal copy");
      }
      
      // Fallback to internal copied data
      if (!dataToRestore && copiedData) {
        dataToRestore = copiedData;
      }
      
      if (dataToRestore) {
        // Restore shapes (with new IDs to avoid conflicts)
        const newShapes = dataToRestore.shapes.map(shape => ({
          ...shape,
          id: Date.now() + Math.random() // Generate new unique IDs
        }));
        
        setShapes(newShapes);
        
        // Restore text content
        if (editorRef.current) {
          editorRef.current.innerHTML = dataToRestore.textContent;
        }
        
        alert("Everything pasted successfully!");
      } else {
        alert("Nothing to paste. Please copy something first.");
      }
    } catch (error) {
      console.error("Paste failed:", error);
      alert("Paste failed. Please make sure you have valid data copied.");
    }
  };

  // Export design as downloadable JSON file
  const exportDesign = () => {
    try {
      const textContent = editorRef.current?.innerHTML || "";
      const designData: DesignData = {
        shapes: shapes,
        textContent: textContent,
        timestamp: Date.now()
      };
      
      const dataStr = JSON.stringify(designData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `custom-design-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert("Design exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  // Import design from JSON file
  const importDesign = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const designData: DesignData = JSON.parse(e.target?.result as string);
          
          if (designData.shapes && designData.textContent !== undefined) {
            // Import shapes
            const newShapes = designData.shapes.map(shape => ({
              ...shape,
              id: Date.now() + Math.random() // Generate new unique IDs
            }));
            
            setShapes(newShapes);
            
            // Import text content
            if (editorRef.current) {
              editorRef.current.innerHTML = designData.textContent;
            }
            
            alert("Design imported successfully!");
          } else {
            alert("Invalid file format. Please select a valid design file.");
          }
        } catch (error) {
          console.error("Import failed:", error);
          alert("Import failed. Please make sure the file is a valid design file.");
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  // Clear everything
  const clearAll = () => {
    if (confirm("Are you sure you want to clear everything? This action cannot be undone.")) {
      setShapes([]);
      if (editorRef.current) {
        editorRef.current.innerHTML = `
          <h2 class="text-2xl font-bold text-slate-800 mb-4">Document Template</h2>
          <p class="text-slate-600 mb-4">
            Edit this content freely. You can format text and insert dynamic fields like <span class="bg-yellow-100 px-2 py-1 rounded text-yellow-800 font-mono">{{clientName}}</span>
          </p>
          <p class="text-slate-500 text-sm">
            This area supports rich text formatting and integrates with the shapes above for complete design flexibility.
          </p>
        `;
      }
      alert("Everything cleared!");
    }
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
    if (!previewShape || !placingShape) return;

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

    // Handle copy/paste and file operations
    if (cmd === "copy") {
      copyEverything();
      return;
    }
    
    if (cmd === "paste") {
      pasteEverything();
      return;
    }
    
    if (cmd === "export") {
      exportDesign();
      return;
    }
    
    if (cmd === "import") {
      importDesign();
      return;
    }
    
    if (cmd === "clear") {
      clearAll();
      return;
    }

    if (cmd === "insertRectangle" || cmd === "insertCircle" || cmd === "insertTriangle") {
      const shapeType = cmd.replace("insert", "").toLowerCase() as "rectangle" | "circle" | "triangle";
      startPlacing(shapeType);
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 overflow-x-hidden">
      {/* Header with title */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Custom Designer</h1>
              <p className="text-slate-600 text-sm">Create professional documents with shapes and rich text</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCommand("clear")}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Ready to design</span>
                  {placingShape && (
                    <span className="ml-2 text-blue-600 font-medium">
                      Click and drag to create {placingShape.type}
                    </span>
                  )}
                </div>
              </div>
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