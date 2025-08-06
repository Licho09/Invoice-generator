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
  color?: string;
};

// Define table type
type Table = {
  id: number;
  x: number;
  y: number;
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  cells: string[][];
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
  tables: Table[];
  textContent: string;
  timestamp: number;
};

export default function CustomDesigner() {
  const [command, setCommand] = useState("");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedShapeColor, setSelectedShapeColor] = useState("#3B82F6");
  const [placingShape, setPlacingShape] = useState<PlacingShape | null>(null);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);
  const [copiedData, setCopiedData] = useState<DesignData | null>(null);
  const [textCursor, setTextCursor] = useState<{x: number, y: number, visible: boolean}>({x: 0, y: 0, visible: false});
  const [currentTextElement, setCurrentTextElement] = useState<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Start placing mode when shape button clicked
  const startPlacing = (type: "rectangle" | "circle" | "triangle") => {
    setPlacingShape(null);
    setPreviewShape(null);
    setPlacingShape({ type, startX: 0, startY: 0 });
  };

  // Copy all content (shapes + tables + text)
  const copyEverything = async () => {
    try {
      const textContent = editorRef.current?.innerHTML || "";
      const designData: DesignData = {
        shapes: shapes,
        tables: tables,
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

  // Paste all content (shapes + tables + text)
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
        
        // Restore tables if they exist
        if (dataToRestore.tables) {
          const newTables = dataToRestore.tables.map(table => ({
            ...table,
            id: Date.now() + Math.random()
          }));
          setTables(newTables);
        }
        
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
        tables: tables,
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
            
            // Import tables if they exist
            if (designData.tables) {
              const newTables = designData.tables.map(table => ({
                ...table,
                id: Date.now() + Math.random()
              }));
              setTables(newTables);
            }
            
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
      setTables([]);
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setTextCursor({x: 0, y: 0, visible: false});
      setCurrentTextElement(null);
      alert("Everything cleared!");
    }
  };

  // Handle mouse down on canvas to start placing shape or start text editing
  const onCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (placingShape) {
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
        color: selectedShapeColor,
      });
    } else {
      // Start text editing at click position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setTextCursor({x, y, visible: true});
      
      // Create or focus text element
      if (editorRef.current) {
        const textElement = document.createElement('div');
        textElement.contentEditable = 'true';
        textElement.style.position = 'absolute';
        textElement.style.left = `${x}px`;
        textElement.style.top = `${y}px`;
        textElement.style.minWidth = '200px';
        textElement.style.minHeight = '20px';
        textElement.style.outline = 'none';
        textElement.style.fontSize = '14px';
        textElement.style.fontFamily = 'system-ui, sans-serif';
        textElement.style.lineHeight = '1.5';
        textElement.style.padding = '4px';
        textElement.style.border = '1px solid #cbd5e1';
        textElement.style.borderRadius = '4px';
        textElement.style.backgroundColor = 'white';
        textElement.style.zIndex = '10';
        
        editorRef.current.appendChild(textElement);
        textElement.focus();
        setCurrentTextElement(textElement);
        
        // Handle when user clicks away from text element
        textElement.addEventListener('blur', () => {
          if (textElement.textContent?.trim() === '') {
            textElement.remove();
          } else {
            textElement.style.border = 'none';
            textElement.style.backgroundColor = 'transparent';
          }
          setTextCursor({x: 0, y: 0, visible: false});
          setCurrentTextElement(null);
        });
      }
    }
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
      color: selectedShapeColor,
    });
  };

  // Handle mouse up to finalize shape
  const onCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewShape || !placingShape) return;
    if (previewShape.width > 10 && previewShape.height > 10) {
      setShapes((prev) => [...prev, { ...previewShape, id: Date.now(), color: selectedShapeColor }]);
    }
    setPreviewShape(null);
    setPlacingShape(null);
  };

  // Insert table at center of canvas
  const insertTable = (rows: number, cols: number) => {
    const newTable: Table = {
      id: Date.now(),
      x: 300, // Center-ish position
      y: 200,
      rows,
      cols,
      cellWidth: 100,
      cellHeight: 30,
      cells: Array(rows).fill(null).map(() => Array(cols).fill(''))
    };
    
    setTables(prev => [...prev, newTable]);
  };

  const handleCommand = (cmd: string, value?: string) => {
    setCommand(cmd);
    
    // Handle shape color selection
    if (cmd === "shapeColor" && value) {
      setSelectedShapeColor(value);
      return;
    }
    
    // Handle table insertion
    if (cmd.startsWith("insertTable_")) {
      const [rows, cols] = cmd.replace("insertTable_", "").split("_").map(Number);
      insertTable(rows, cols);
      return;
    }
    
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

    // Text commands (these would work if there was a text editor)
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
                  {textCursor.visible && (
                    <span className="ml-2 text-green-600 font-medium">
                      Text mode: Type to add text
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Ribbon onCommand={handleCommand} selectedShapeColor={selectedShapeColor} />

      <EditorCanvas
        shapes={shapes}
        setShapes={setShapes}
        tables={tables}
        setTables={setTables}
        previewShape={previewShape}
        editorRef={editorRef}
        textCursor={textCursor}
        onCanvasMouseDown={onCanvasMouseDown}
        onCanvasMouseMove={onCanvasMouseMove}
        onCanvasMouseUp={onCanvasMouseUp}
        selectedShapeColor={selectedShapeColor}
      />
    </div>
  );
}