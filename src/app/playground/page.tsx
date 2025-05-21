"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { PlayIcon, RefreshCwIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { motion } from "framer-motion";

// Default code template
const DEFAULT_CODE = `function solution(input) {
  // Your code here
  return input;
}

// Example usage
console.log(solution("test"));
`;

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");

  const runCode = () => {
    try {
      // In a real implementation, you'd want to use a more secure way to evaluate code
      // This is a simple example for demonstration purposes only
      const result = eval(`(function() {
        const originalConsoleLog = console.log;
        let output = [];
        
        console.log = function(...args) {
          output.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
          originalConsoleLog.apply(console, args);
        };
        
        try {
          ${code}
        } catch (error) {
          output.push("Error: " + error.message);
        }
        
        console.log = originalConsoleLog;
        return output.join("\\n");
      })()`);
      
      setOutput(result);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-[calc(100vh-120px)] flex flex-col min-h-0"
    >
      <ResizablePanelGroup 
        direction="vertical"
        className="flex-1 h-full border rounded-md overflow-hidden"
      >
        {/* Code Editor Panel */}
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-2 bg-muted/40">
              <h2 className="font-medium">Coding Playground</h2>
              
              {/* Language Selector and Action Buttons */}
              <div className="flex gap-2">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-2 py-1 bg-background border rounded-md text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                </select>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCode(DEFAULT_CODE)}
                >
                  <RefreshCwIcon className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button 
                  size="sm" 
                  onClick={runCode}
                >
                  <PlayIcon className="h-4 w-4 mr-1" />
                  Run
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex-grow relative">
              <Editor
                height="100%"
                defaultLanguage="javascript" 
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        {/* Console Output Panel */}
        <ResizablePanel defaultSize={30} minSize={15}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-2 bg-muted/40">
              <h2 className="font-medium">Console Output</h2>
            </div>
            <Separator />
            <div className="flex-grow overflow-auto p-3">
              <pre className="whitespace-pre-wrap h-full font-mono text-sm">
                {output || "Run your code to see output here"}
              </pre>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
}