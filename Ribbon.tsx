import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState } from "react";
import { Bold, Italic, Underline, Type, Shapes, Palette, Copy, Clipboard, Download, Upload, Table, FontSize, Font } from "lucide-react";

const colors = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F97316" },
  { name: "Purple", value: "#8B5CF6" },
];

const fonts = [
  "Arial",
  "Times New Roman", 
  "Helvetica",
  "Georgia",
  "Verdana",
  "Courier New",
  "Comic Sans MS",
  "Impact"
];

const fontSizes = [
  "8", "9", "10", "11", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "36", "40", "44", "48"
];

export default function Ribbon({ 
  onCommand, 
  selectedFont,
  selectedFontSize
}: { 
  onCommand: (cmd: string, value?: string) => void;
  selectedFont: string;
  selectedFontSize: string;
}) {
  const [colorOpen, setColorOpen] = useState(false);
  const [shapeOpen, setShapeOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);

  // Create table grid for selection
  const renderTableGrid = () => {
    const rows = [];
    for (let r = 1; r <= 8; r++) {
      const cols = [];
      for (let c = 1; c <= 10; c++) {
        cols.push(
          <div
            key={`${r}-${c}`}
            className="w-4 h-4 border border-gray-300 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              onCommand(`insertTable_${r}_${c}`);
              setTableOpen(false);
            }}
            title={`${r} x ${c} Table`}
          />
        );
      }
      rows.push(
        <div key={r} className="flex">
          {cols}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 shadow-lg overflow-x-auto">
      <div className="flex items-center gap-3 p-4 min-w-max">
        {/* Copy/Paste Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
          <span className="text-sm font-medium text-slate-600 mr-2">Clipboard</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCommand("copy")}
            className="hover:bg-slate-100 text-slate-700"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCommand("paste")}
            className="hover:bg-slate-100 text-slate-700"
          >
            <Clipboard className="w-4 h-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-300 flex-shrink-0" />

        {/* Export/Import Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
          <span className="text-sm font-medium text-slate-600 mr-2">File</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCommand("export")}
            className="hover:bg-slate-100 text-slate-700"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCommand("import")}
            className="hover:bg-slate-100 text-slate-700"
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-300 flex-shrink-0" />

        {/* Font Controls Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
          <span className="text-sm font-medium text-slate-600 mr-2">Font</span>
          
          {/* Font Family */}
          <Popover open={fontOpen} onOpenChange={setFontOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-slate-100 text-slate-700 min-w-[80px]"
              >
                <Font className="w-4 h-4 mr-1" />
                {selectedFont}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3 w-48 bg-white shadow-xl border border-slate-200 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Choose Font</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {fonts.map((font) => (
                  <button
                    key={font}
                    className={`w-full flex items-center px-3 py-2 text-left hover:bg-slate-50 rounded-md transition-colors ${selectedFont === font ? 'bg-blue-50 text-blue-700' : ''}`}
                    style={{ fontFamily: font }}
                    onClick={() => {
                      onCommand("fontFamily", font);
                      setFontOpen(false);
                    }}
                  >
                    <span className="text-sm">{font}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Font Size */}
          <Popover open={fontSizeOpen} onOpenChange={setFontSizeOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-slate-100 text-slate-700 min-w-[50px]"
              >
                <FontSize className="w-4 h-4 mr-1" />
                {selectedFontSize}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3 w-32 bg-white shadow-xl border border-slate-200 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Size</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    className={`w-full flex items-center px-3 py-2 text-left hover:bg-slate-50 rounded-md transition-colors ${selectedFontSize === size ? 'bg-blue-50 text-blue-700' : ''}`}
                    onClick={() => {
                      onCommand("fontSize", size);
                      setFontSizeOpen(false);
                    }}
                  >
                    <span className="text-sm">{size}px</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-300 flex-shrink-0" />

        {/* Text Formatting Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
          <span className="text-sm font-medium text-slate-600 mr-2">Format</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCommand("bold")}
            className="hover:bg-slate-100 text-slate-700"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCommand("italic")}
            className="hover:bg-slate-100 text-slate-700"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCommand("underline")}
            className="hover:bg-slate-100 text-slate-700"
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-300 flex-shrink-0" />

        {/* Insert Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
          <span className="text-sm font-medium text-slate-600 mr-2">Insert</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCommand("insertPlaceholder")}
            className="hover:bg-blue-50 hover:text-blue-700 text-slate-700"
          >
            <Type className="w-4 h-4 mr-1" />
            {"{{clientName}}"}
          </Button>
          
          {/* Table Insertion */}
          <Popover open={tableOpen} onOpenChange={setTableOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-slate-100 text-slate-700"
              >
                <Table className="w-4 h-4 mr-1" />
                Table
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3 w-auto bg-white shadow-xl border border-slate-200 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Insert Table</h4>
              <div className="space-y-1">
                {renderTableGrid()}
              </div>
              <p className="text-xs text-slate-500 mt-2">Click to select table size</p>
            </PopoverContent>
          </Popover>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-300 flex-shrink-0" />

        {/* Text Color Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
          <span className="text-sm font-medium text-slate-600 mr-2">Text Color</span>
          <Popover open={colorOpen} onOpenChange={setColorOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-slate-100 text-slate-700"
              >
                <Palette className="w-4 h-4 mr-1" />
                Text Color
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3 w-48 bg-white shadow-xl border border-slate-200 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Choose Color</h4>
              <div className="grid grid-cols-2 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      onCommand("textColor", color.value);
                      setColorOpen(false);
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                      style={{ backgroundColor: color.value }}
                      aria-label={`${color.name} color`}
                    />
                    <span className="text-sm text-slate-700">{color.name}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-300 flex-shrink-0" />

        {/* Shapes Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
          <span className="text-sm font-medium text-slate-600 mr-2">Shapes</span>
          <Popover open={shapeOpen} onOpenChange={setShapeOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-slate-100 text-slate-700"
              >
                <Shapes className="w-4 h-4 mr-1" />
                Insert Shape
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3 w-48 bg-white shadow-xl border border-slate-200 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Choose Shape</h4>
              <div className="space-y-1">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => {
                    onCommand("insertRectangle");
                    setShapeOpen(false);
                  }}
                >
                  <div className="w-4 h-3 bg-blue-500 rounded-sm"></div>
                  <span className="text-sm text-slate-700">Rectangle</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => {
                    onCommand("insertCircle");
                    setShapeOpen(false);
                  }}
                >
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Circle</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => {
                    onCommand("insertTriangle");
                    setShapeOpen(false);
                  }}
                >
                  <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-orange-500"></div>
                  <span className="text-sm text-slate-700">Triangle</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}