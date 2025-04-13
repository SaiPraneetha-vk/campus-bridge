
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, User, Users, Save, Share, Download, Upload, Activity, Code, Bot, Plus, Copy, Check, Trash, RefreshCw, History, Clock2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AIAssistant from './AIAssistant';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

const defaultCodeExamples = {
  javascript: `// Write your JavaScript code here
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  python: `# Write your Python code here
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
  java: `// Write your Java code here
public class Main {
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }

    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
  cpp: `// Write your C++ code here
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << fibonacci(10) << endl;
    return 0;
}`,
  ruby: `# Write your Ruby code here
def fibonacci(n)
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end

puts fibonacci(10)`,
  csharp: `// Write your C# code here
using System;

class Program {
    static void Main() {
        Console.WriteLine(Fibonacci(10));
    }

    static int Fibonacci(int n) {
        if (n <= 1) return n;
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }
}`,
  php: `<?php
// Write your PHP code here
function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n - 1) + fibonacci($n - 2);
}

echo fibonacci(10);
?>`,
  typescript: `// Write your TypeScript code here
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
};

const languageErrors = {
  javascript: "Uncaught SyntaxError: Unexpected token",
  python: "IndentationError: unexpected indent",
  java: "error: ';' expected",
  cpp: "error: expected ';' before '}' token",
  ruby: "syntax error, unexpected ')'",
  csharp: "CS1002: ; expected",
  php: "Parse error: syntax error, unexpected token",
  typescript: "Type error: Argument of type 'string' is not assignable to parameter of type 'number'",
};

const groupRooms = [
  {
    id: "room-1",
    name: "Algorithm Study Group",
    participants: 8,
    description: "Collaborative study of sorting and search algorithms",
    active: true,
    createdBy: "Sarah Johnson"
  },
  {
    id: "room-2",
    name: "Data Structures Group",
    participants: 6,
    description: "Deep dive into trees, graphs, and advanced data structures",
    active: true,
    createdBy: "Michael Chen"
  },
  {
    id: "room-3",
    name: "Web Development Projects",
    participants: 12,
    description: "Working on full stack development projects together",
    active: true,
    createdBy: "Aisha Patel"
  },
  {
    id: "room-4",
    name: "Database Systems",
    participants: 5,
    description: "SQL, NoSQL and database optimization techniques",
    active: false,
    createdBy: "Carlos Rodriguez"
  },
  {
    id: "room-5",
    name: "Machine Learning Lab",
    participants: 9,
    description: "Implementing ML algorithms and discussing use cases",
    active: true,
    createdBy: "Emma Wilson"
  }
];

const sampleParticipants = [
  { id: 1, name: "Sarah Johnson", avatar: "/placeholder.svg", status: "active" },
  { id: 2, name: "Michael Chen", avatar: "/placeholder.svg", status: "active" },
  { id: 3, name: "Aisha Patel", avatar: "/placeholder.svg", status: "idle" },
  { id: 4, name: "Carlos Rodriguez", avatar: "/placeholder.svg", status: "active" },
  { id: 5, name: "Emma Wilson", avatar: "/placeholder.svg", status: "offline" },
  { id: 6, name: "David Kim", avatar: "/placeholder.svg", status: "active" },
  { id: 7, name: "Olivia Brown", avatar: "/placeholder.svg", status: "idle" },
];

const CodeStudio = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCodeExamples.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [roomParticipants, setRoomParticipants] = useState<typeof sampleParticipants>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [codeHistory, setCodeHistory] = useState<{code: string, language: string}[]>([]);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [userEditedCode, setUserEditedCode] = useState(false);

  useEffect(() => {
    if (!userEditedCode) {
      setCode(defaultCodeExamples[language as keyof typeof defaultCodeExamples] || defaultCodeExamples.javascript);
    }
  }, [language, userEditedCode]);

  useEffect(() => {
    if (activeRoom) {
      setRoomParticipants(sampleParticipants.slice(0, Math.floor(Math.random() * 7) + 3));
    } else {
      setRoomParticipants([]);
    }
  }, [activeRoom]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setUserEditedCode(true);
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage !== language) {
      if (userEditedCode && code !== defaultCodeExamples[language as keyof typeof defaultCodeExamples]) {
        const confirmed = window.confirm(
          "Changing language will reset your current code. Do you want to continue?"
        );
        if (!confirmed) return;
        setUserEditedCode(false);
      }
      setLanguage(newLanguage);
    }
  };

  const detectSyntaxErrors = (code: string, language: string): string | null => {
    // Basic syntax error detection for JavaScript
    if (language === 'javascript' || language === 'typescript') {
      try {
        new Function(code);
        return null;
      } catch (err) {
        return err instanceof Error ? err.message : 'Syntax error';
      }
    }

    // Simple syntax error detection for other languages
    const basicChecks = {
      python: [
        { pattern: /^\s+[^\s#]/, error: "IndentationError: unexpected indent" },
        { pattern: /[^:]\s*\n\s+/, error: "IndentationError: expected an indented block" },
        { pattern: /for\s+\w+\s+in\s*:/, error: "SyntaxError: invalid syntax" },
        { pattern: /def\s+\w+\s*[^():]*:/, error: "SyntaxError: invalid syntax" },
      ],
      java: [
        { pattern: /[^;{]\s*\n\s*\w+/, error: "error: ';' expected" },
        { pattern: /\bclass\s+\w+\s*\{/, error: null },
        { pattern: /\bclass\s+\w+[^{]*$/, error: "error: '{' expected" },
      ],
      cpp: [
        { pattern: /[^;{]\s*\n\s*\w+/, error: "error: expected ';' before" },
        { pattern: /#include\s*[<"][\w.]+[>"]\s*;/, error: "error: extra ';'" },
      ],
      ruby: [
        { pattern: /end\s+\w+/, error: "syntax error, unexpected identifier" },
        { pattern: /def\s+\w+[^(\n]*\n/, error: "syntax error, unexpected end-of-input" },
      ],
      csharp: [
        { pattern: /[^;{]\s*\n\s*\w+/, error: "CS1002: ; expected" },
        { pattern: /\bclass\s+\w+\s*\{/, error: null },
        { pattern: /\bclass\s+\w+[^{]*$/, error: "error: '{' expected" },
      ],
      php: [
        { pattern: /[^;{]\s*\n\s*\w+/, error: "Parse error: syntax error, unexpected token" },
        { pattern: /\bfunction\s+\w+\s*\([^)]*\)\s*\{/, error: null },
        { pattern: /\bfunction\s+\w+\s*\([^)]*\)[^{]*$/, error: "Parse error: syntax error, unexpected end of file" },
      ],
    };

    if (language in basicChecks) {
      const checks = basicChecks[language as keyof typeof basicChecks];
      for (const check of checks) {
        if (check.pattern.test(code) && check.error) {
          return check.error;
        }
      }
    }

    // Common syntax errors across languages
    if (
      (code.split('{').length !== code.split('}').length) &&
      ['javascript', 'typescript', 'java', 'cpp', 'csharp', 'php'].includes(language)
    ) {
      return "Syntax error: Unbalanced braces {}";
    }

    if (
      (code.split('(').length !== code.split(')').length) &&
      ['javascript', 'typescript', 'python', 'java', 'cpp', 'ruby', 'csharp', 'php'].includes(language)
    ) {
      return "Syntax error: Unbalanced parentheses ()";
    }

    // Simple keyword checks
    const languageKeywords: Record<string, string[]> = {
      javascript: ['function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while'],
      typescript: ['function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'interface', 'type'],
      python: ['def', 'return', 'if', 'else', 'for', 'while', 'import', 'class', 'print'],
      java: ['public', 'private', 'class', 'void', 'return', 'if', 'else', 'for', 'while', 'System'],
      cpp: ['include', 'int', 'void', 'return', 'if', 'else', 'for', 'while', 'cout', 'cin'],
      ruby: ['def', 'end', 'if', 'else', 'puts', 'print', 'require', 'class'],
      csharp: ['using', 'public', 'private', 'class', 'void', 'return', 'if', 'else', 'for', 'while', 'Console'],
      php: ['function', 'return', 'if', 'else', 'for', 'while', 'echo', 'print', 'require'],
    };
    
    const keywords = languageKeywords[language] || [];
    if (keywords.length > 0) {
      const hasKeyword = keywords.some(keyword => code.includes(keyword));
      if (!hasKeyword && code.trim().length > 10) {
        return `Warning: No ${language} keywords found. Are you sure this is ${language} code?`;
      }
    }

    return null;
  };

  const convertCode = (targetLanguage: string) => {
    if (targetLanguage === language) {
      toast({
        title: "Same Language",
        description: "Your code is already in the selected language.",
        variant: "default"
      });
      return;
    }

    setIsRunning(true);
    setOutput('Converting your code to ' + targetLanguage + '...');

    setTimeout(() => {
      setCodeHistory(prev => [...prev, {code, language}]);
      
      setLanguage(targetLanguage);
      setUserEditedCode(false);
      
      setIsRunning(false);
      setOutput(`Code converted to ${targetLanguage}.\n\nNote: In a real application, this would use AI to properly convert your specific code while preserving functionality.`);
      
      toast({
        title: "Code Converted",
        description: `Your code has been converted to ${targetLanguage}.`,
      });
    }, 2000);
  };

  const simulateCodeExecution = (code: string, language: string): Promise<string> => {
    return new Promise((resolve) => {
      const timeout = Math.random() * 1500 + 500;
      
      setTimeout(() => {
        if (!code.trim()) {
          return resolve("Error: Empty code. Please write some code before running.");
        }
        
        // Check for intentional errors
        const hasSyntaxError = code.includes('syntax_error') || code.includes('error_demo');
        
        if (hasSyntaxError) {
          return resolve(`Error: ${languageErrors[language as keyof typeof languageErrors] || "Syntax error in your code"}`);
        }
        
        // Check for actual syntax errors
        const syntaxError = detectSyntaxErrors(code, language);
        if (syntaxError) {
          return resolve(`Error: ${syntaxError}`);
        }
        
        if (language === 'javascript' || language === 'typescript') {
          try {
            const logs: string[] = [];
            const originalConsoleLog = console.log;
            console.log = (...args) => {
              logs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '));
              originalConsoleLog(...args);
            };
            
            try {
              new Function(code)();
              return resolve(logs.join('\n') || 'Code executed successfully, but produced no output.');
            } catch (err) {
              if (err instanceof Error) {
                return resolve(`Error: ${err.message}`);
              } else {
                return resolve('An unknown error occurred');
              }
            } finally {
              console.log = originalConsoleLog;
            }
          } catch (err) {
            return resolve(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }
        
        const outputs: Record<string, string> = {
          python: '55\n\n[Python output simulation - in a real app, this would run on a backend service]',
          java: '55\n\n[Java output simulation - in a real app, this would run on a backend service]',
          cpp: '55\n\n[C++ output simulation - in a real app, this would run on a backend service]',
          ruby: '55\n\n[Ruby output simulation - in a real app, this would run on a backend service]',
          csharp: '55\n\n[C# output simulation - in a real app, this would run on a backend service]',
          php: '55\n\n[PHP output simulation - in a real app, this would run on a backend service]',
        };
        
        resolve(outputs[language] || `Output for ${language}:\n55\n\n[Simulated output - in a real app, this would run on a backend service]`);
      }, timeout);
    });
  };

  const handleRun = async () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please write some code before running.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    setOutput('');
    
    try {
      const result = await simulateCodeExecution(code, language);
      setOutput(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setOutput(`Error: ${errorMessage}`);
      toast({
        title: "Execution Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    setCodeHistory(prev => [...prev, {code, language}]);
    
    toast({
      title: "Code Saved",
      description: "Your code has been saved successfully."
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code Copied",
        description: "Your code has been copied to clipboard."
      });
    });
  };

  const handleJoinRoom = (roomId: string) => {
    setActiveRoom(roomId);
    setActiveTab('collaborative');
    
    toast({
      title: "Room Joined",
      description: `You have joined the room: ${groupRooms.find(r => r.id === roomId)?.name}`,
    });
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    toast({
      title: "Room Left",
      description: "You have left the collaborative room.",
    });
  };

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      toast({
        title: "Room Name Required",
        description: "Please provide a name for your room.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Room Created",
      description: `Your room "${newRoomName}" has been created.`,
    });
    
    setShowNewRoomForm(false);
    setNewRoomName('');
    setNewRoomDescription('');
  };

  const renderActiveRoom = () => {
    const room = groupRooms.find(r => r.id === activeRoom);
    
    if (!room) return null;
    
    return (
      <div className="h-full flex flex-col">
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <div>
            <h3 className="font-medium">{room.name}</h3>
            <p className="text-sm text-muted-foreground">{room.description}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLeaveRoom}>
            Leave Room
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row">
          <div className="flex-1 p-4 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Collaborative Editor</h3>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <ScrollArea className="flex-1 border rounded-md mb-4">
              <Textarea
                value={code}
                onChange={handleCodeChange}
                className="h-full w-full resize-none font-mono text-sm p-4 border-0"
                placeholder={`Write your ${language} code here...`}
                spellCheck={false}
              />
            </ScrollArea>
            
            <div className="flex justify-between gap-2">
              <Button variant="default" size="sm" onClick={handleRun} disabled={isRunning}>
                {isRunning ? 'Running...' : 'Run'}
                <Play className="ml-1 h-4 w-4" />
              </Button>
              
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l p-2 flex flex-col">
            <div className="mb-2 p-2">
              <h3 className="text-sm font-medium mb-1">Room Participants</h3>
              <p className="text-xs text-muted-foreground">{roomParticipants.length} active members</p>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="space-y-2 px-1">
                {roomParticipants.map(participant => (
                  <div key={participant.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
                        participant.status === 'active' ? 'bg-green-500' : 
                        participant.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-300'
                      } ring-1 ring-white`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{participant.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{participant.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t mt-2 pt-2 px-1">
              <h3 className="text-sm font-medium mb-2">Chat</h3>
              <div className="p-4 rounded-md bg-muted/50 text-center text-sm">
                <p>Chat functionality would be implemented here in a real application.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <TabsList>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="collaborative" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group Rooms
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="mr-1 h-4 w-4" />
              Save
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        <TabsContent value="editor" className="flex-1 p-0 flex flex-col md:flex-row">
          <div className="flex-1 p-2 relative">
            <ScrollArea className="h-full">
              <Textarea
                ref={editorRef}
                value={code}
                onChange={handleCodeChange}
                className="h-full w-full resize-none font-mono text-sm p-4"
                placeholder={`Write your ${language} code here...`}
                spellCheck={false}
              />
            </ScrollArea>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Convert <RefreshCw className="ml-1 h-3 w-3" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Convert Code</DrawerTitle>
                    <DrawerDescription>Choose a language to convert your code to</DrawerDescription>
                  </DrawerHeader>
                  <div className="grid grid-cols-2 gap-2 p-4">
                    {Object.keys(defaultCodeExamples).map((lang) => (
                      <Button 
                        key={lang}
                        variant={lang === language ? "secondary" : "outline"}
                        className="justify-start"
                        disabled={lang === language}
                        onClick={() => convertCode(lang)}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </Button>
                    ))}
                  </div>
                </DrawerContent>
              </Drawer>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? 'Running...' : 'Run'}
                <Play className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border-t md:border-t-0 md:border-l w-full md:w-1/2 p-2 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Output</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Activity className="h-4 w-4" />
                </Button>
                {codeHistory.length > 0 && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <History className="h-4 w-4" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Code History</DrawerTitle>
                        <DrawerDescription>View and restore previous versions</DrawerDescription>
                      </DrawerHeader>
                      <ScrollArea className="h-[50vh] px-4">
                        <div className="space-y-4 pb-4">
                          {codeHistory.map((entry, idx) => (
                            <div key={idx} className="border rounded-md p-2">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-sm font-medium">{entry.language}</div>
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => {
                                      setCode(entry.code);
                                      setLanguage(entry.language);
                                      setUserEditedCode(true);
                                      toast({
                                        title: "Code Restored",
                                        description: `Restored ${entry.language} code version`
                                      });
                                    }}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-xs bg-muted p-2 rounded-md font-mono whitespace-pre-wrap line-clamp-3">
                                {entry.code.slice(0, 150)}{entry.code.length > 150 ? '...' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
            </div>
            <ScrollArea className="flex-1 bg-black rounded-md p-4 text-white font-mono text-sm">
              {isRunning ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animation-delay-200"></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animation-delay-400"></div>
                  <span className="ml-2">Running code...</span>
                </div>
              ) : output ? (
                output.split('\n').map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {line || '\u00A0'}
                  </div>
                ))
              ) : (
                'Run your code to see output here'
              )}
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="ai-assistant" className="flex-1 p-0 mt-0">
          <div className="h-full overflow-hidden">
            <AIAssistant initialPrompt="I'm working on my coding project. Can you help me?" disableIntro={true} />
          </div>
        </TabsContent>
        
        <TabsContent value="collaborative" className="flex-1 px-0 py-0 flex flex-col">
          {activeRoom ? (
            renderActiveRoom()
          ) : (
            <div className="flex-1 p-6 overflow-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Live Group Code Rooms</h2>
                <p className="text-muted-foreground">
                  Collaborate in real-time with your classmates. Work together on coding 
                  problems, share solutions, and get instant feedback.
                </p>
              </div>
              
              {showNewRoomForm ? (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Create a New Room</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateRoom(); }}>
                      <div className="space-y-2">
                        <label htmlFor="room-name" className="text-sm font-medium">Room Name</label>
                        <Input 
                          id="room-name" 
                          placeholder="e.g., Algorithm Study Group" 
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="room-description" className="text-sm font-medium">Description</label>
                        <Textarea 
                          id="room-description" 
                          placeholder="What will your group work on?" 
                          value={newRoomDescription}
                          onChange={(e) => setNewRoomDescription(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="room-language" className="text-sm font-medium">Primary Language</label>
                        <Select defaultValue="javascript">
                          <SelectTrigger id="room-language">
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="cpp">C++</SelectItem>
                            <SelectItem value="ruby">Ruby</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button type="submit">Create Room</Button>
                        <Button type="button" variant="outline" onClick={() => setShowNewRoomForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Button 
                  className="mb-6"
                  onClick={() => setShowNewRoomForm(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Create a New Room
                </Button>
              )}
              
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="grid gap-4 md:grid-cols-2 pb-6">
                  {groupRooms.map((room) => (
                    <Card key={room.id} className={`${!room.active ? 'opacity-70' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          {room.active && (
                            <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                              Active
                            </div>
                          )}
                          {!room.active && (
                            <div className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                              Inactive
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{room.description}</div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 text-sm">
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>Participants: {room.participants}</span>
                            <span>Created by: {room.createdBy}</span>
                          </div>
                          <div className="flex -space-x-2">
                            {[...Array(Math.min(5, room.participants))].map((_, i) => (
                              <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {String.fromCharCode(65 + i)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {room.participants > 5 && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                +{room.participants - 5}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleJoinRoom(room.id)}
                          disabled={!room.active}
                        >
                          {room.active ? 'Join Room' : 'Room Closed'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeStudio;
