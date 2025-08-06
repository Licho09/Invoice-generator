import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState } from "react";
import { Bold, Italic, Underline, Type, Shapes, Palette } from "lucide-react";

const colors = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F97316" },
  { name: "Purple", value: "#8B5CF6" },
];

export default function Ribbon({ onCommand }: { onCommand: (cmd: string, value?: string) => void }) {
  const [colorOpen, setColorOpen] = useState(false);
  const [shapeOpen, setShapeOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 shadow-lg">
      <div className="flex items-center gap-3 p-4">
        {/* Text Formatting Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
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
        <div className="h-8 w-px bg-slate-300" />

        {/* Insert Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
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
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-300" />

        {/* Text Color Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
          <span className="text-sm font-medium text-slate-600 mr-2">Color</span>
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
        <div className="h-8 w-px bg-slate-300" />

        {/* Shapes Section */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
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