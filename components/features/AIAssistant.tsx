
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  SendHorizontal, 
  Zap, 
  Loader2, 
  ChevronRight, 
  Code, 
  Bot, 
  BookOpen,
  BookX,
  Calculator,
  Calendar,
  FileQuestion,
  GraduationCap,
  LayoutList, 
  Pencil,
  Search,
  Sparkles,
  UserRound,
  Building,
  School,
  Bus,
  PenSquare,
  Clock,
  LibraryBig,
  Wallet,
  BadgeHelp,
  Award,
  Coins,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AIAssistantProps {
  initialPrompt?: string;
  disableIntro?: boolean;
}

// Definition of predefined questions by category
const predefinedQuestions = {
  academic: [
    "Can you explain the difference between macroeconomics and microeconomics?",
    "How do I prepare for my final exams effectively?",
    "What are some good resources for learning about quantum physics?",
    "Can you help me understand the concept of object-oriented programming?",
    "How do I cite sources in APA format?"
  ],
  campus: [
    "How do I check my current attendance percentage?",
    "When is the next semester registration deadline?",
    "How can I apply for a scholarship at the university?",
    "What are the library hours during exam week?",
    "How do I reserve a study room on campus?"
  ],
  coding: [
    "How do I debug this JavaScript code?",
    "Can you explain how to implement a binary search tree?",
    "What's the difference between merge sort and quick sort?",
    "How do I optimize this SQL query?",
    "Can you help me understand time complexity analysis?"
  ],
  transport: [
    "What are the bus timings from campus to downtown?",
    "How do I view the bus routes available to me?",
    "Can I book transportation in advance?",
    "Where can I find the driver contact information?",
    "How do I register for the campus shuttle service?"
  ],
  results: [
    "When will the final exam results be declared?",
    "How do I calculate my CGPA from the grade sheet?",
    "What's the procedure for applying for revaluation?",
    "Can you explain the grading system at our university?",
    "How do I check if I qualify for honors degree?"
  ],
  personal: [
    "How can I update my personal information in the student portal?",
    "What documents do I need for identity verification?",
    "How do I change my login password?",
    "Who should I contact if I have issues with my student ID?",
    "How can I link my parents' contact information to my profile?"
  ]
};

// Create more realistic AI responses based on question type
const generateResponse = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  // Academic responses
  if (lowerQuestion.includes('macroeconomics') || lowerQuestion.includes('microeconomics')) {
    return "Macroeconomics studies the behavior of the economy as a whole, focusing on indicators like GDP, unemployment rates, and inflation. Microeconomics focuses on individual markets, analyzing how firms and households make decisions and allocate resources. While macroeconomics looks at the forest, microeconomics examines the trees.";
  }
  
  if (lowerQuestion.includes('exam') && lowerQuestion.includes('prepare')) {
    return "To prepare effectively for final exams:\n\n1. Create a study schedule that allocates time for each subject\n2. Review your notes and highlight key concepts\n3. Practice with past exam questions\n4. Form study groups for collaborative learning\n5. Ensure you're getting enough sleep and proper nutrition\n6. Use active recall techniques rather than passive reading\n7. Take regular breaks using the Pomodoro technique (25 minutes study, 5 minutes break)";
  }
  
  // Coding responses
  if (lowerQuestion.includes('debug') && lowerQuestion.includes('javascript')) {
    return "To debug JavaScript code effectively:\n\n1. Use `console.log()` statements to trace variable values\n2. Leverage browser developer tools (F12) to set breakpoints\n3. Check for syntax errors and missing semicolons\n4. Verify that variables are properly scoped\n5. Use try/catch blocks to handle exceptions\n6. Check for asynchronous code issues with Promises or async/await\n7. Tools like ESLint can help catch common errors before runtime";
  }
  
  if (lowerQuestion.includes('binary search tree')) {
    return "A Binary Search Tree (BST) is a data structure where each node has at most two children (left and right). For each node, all elements in the left subtree are less than the node, and all elements in the right subtree are greater.\n\nHere's a basic implementation in JavaScript:\n\n```javascript\nclass Node {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nclass BinarySearchTree {\n  constructor() {\n    this.root = null;\n  }\n  \n  insert(value) {\n    const newNode = new Node(value);\n    if (!this.root) {\n      this.root = newNode;\n      return this;\n    }\n    \n    let current = this.root;\n    while (true) {\n      if (value === current.value) return undefined;\n      if (value < current.value) {\n        if (!current.left) {\n          current.left = newNode;\n          return this;\n        }\n        current = current.left;\n      } else {\n        if (!current.right) {\n          current.right = newNode;\n          return this;\n        }\n        current = current.right;\n      }\n    }\n  }\n}\n```";
  }
  
  // Campus-related responses
  if (lowerQuestion.includes('attendance')) {
    return "You can check your current attendance percentage by logging into the student portal and navigating to the 'Attendance' section. There you'll find a detailed breakdown of your attendance by course. Remember that maintaining at least 75% attendance is mandatory for all courses. If your attendance is falling below this threshold, you'll receive automatic alerts both on the dashboard and via email.";
  }
  
  if (lowerQuestion.includes('scholarship')) {
    return "To apply for a scholarship at the university:\n\n1. Log in to your student portal\n2. Navigate to 'Financial Aid & Scholarships' section\n3. Complete the scholarship eligibility questionnaire\n4. Upload required documents (academic transcripts, income certificates, etc.)\n5. Submit your application before the deadline (typically April 15 for fall semester)\n\nFor merit-based scholarships, a minimum CGPA of 3.5 is usually required. Need-based scholarships have different criteria based on family income and other factors.";
  }
  
  // Transportation responses
  if ((lowerQuestion.includes('bus') || lowerQuestion.includes('transport')) && 
      (lowerQuestion.includes('time') || lowerQuestion.includes('schedule'))) {
    return "The campus buses run on the following schedule:\n\n- **Weekdays (Monday-Friday)**:\n  - First bus: 6:30 AM from Main Campus\n  - Last bus: 10:30 PM from Downtown\n  - Frequency: Every 30 minutes during peak hours (7-10 AM, 4-7 PM), hourly during off-peak\n\n- **Weekends (Saturday-Sunday)**:\n  - First bus: 8:00 AM from Main Campus\n  - Last bus: 8:30 PM from Downtown\n  - Frequency: Every 60 minutes all day\n\nYou can view the complete schedule and track buses in real-time in the 'Transport' section of your student portal.";
  }
  
  // Results and academics responses
  if (lowerQuestion.includes('result') && lowerQuestion.includes('declar')) {
    return "Final exam results for the current semester will be declared on June 15th, 2025. Results will be published in the 'Results' section of your student portal. You'll also receive an email notification once grades are posted. If you have applied for revaluation for any subject, those updated results will typically be available 2-3 weeks after the initial result declaration.";
  }
  
  if (lowerQuestion.includes('revaluation')) {
    return "The procedure for applying for revaluation:\n\n1. Log in to your student portal and navigate to the 'Results' section\n2. Select the semester and course for which you want revaluation\n3. Click on the 'Apply for Revaluation' button\n4. Pay the revaluation fee (₹500 per subject)\n5. Submit your application\n\nImportant deadlines:\n- Applications must be submitted within 10 days of result declaration\n- Results of revaluation typically take 2-3 weeks\n- You can track the status of your application in the 'Revaluation' section";
  }
  
  // Default responses for generic questions
  if (lowerQuestion.includes('help')) {
    return "I'd be happy to help! Could you provide more specific details about what you need assistance with? I can help with academic questions, coding problems, campus information, or general advice for students.";
  }
  
  // Personal information responses
  if (lowerQuestion.includes('password') && lowerQuestion.includes('change')) {
    return "To change your login password:\n\n1. Go to the 'Settings' section in your student portal\n2. Select 'Security Settings'\n3. Click on 'Change Password'\n4. Enter your current password\n5. Enter and confirm your new password (must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters)\n6. Click 'Save Changes'\n\nFor security reasons, you'll be logged out and need to log in again with your new password. If you've forgotten your current password, use the 'Forgot Password' option on the login page.";
  }
  
  // Default response if no pattern is matched
  return "That's an interesting question. While I'm designed to assist with academic and campus-related queries, I'm continuously learning. Could you provide more context or rephrase your question? I'm here to help you the best I can.";
};

const AIAssistant = ({ initialPrompt, disableIntro = false }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'academic' | 'campus' | 'coding' | 'transport' | 'results' | 'personal'>('academic');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate AI response
  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response with a delay
    setTimeout(() => {
      const aiResponse = generateResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Set predefined question
  const handlePredefinedQuestion = (question: string) => {
    setInput(question);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'academic':
        return <BookOpen className="mr-2 h-4 w-4" />;
      case 'campus':
        return <Building className="mr-2 h-4 w-4" />;
      case 'coding':
        return <Code className="mr-2 h-4 w-4" />;
      case 'transport':
        return <Bus className="mr-2 h-4 w-4" />;
      case 'results':
        return <Award className="mr-2 h-4 w-4" />;
      case 'personal':
        return <UserRound className="mr-2 h-4 w-4" />;
      default:
        return <BookOpen className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        {!disableIntro && messages.length === 0 && (
          <div className="mb-8 flex flex-col items-center gap-3 pt-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Campus Bridge AI Assistant</h3>
            <p className="max-w-md text-muted-foreground">
              I can help you with coding problems, academics, campus information, 
              and answer any questions about your courses or student life.
            </p>
            
            <div className="mt-6 w-full max-w-xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <Button 
                  variant={activeCategory === 'academic' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveCategory('academic')}
                  className="flex-1"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Academic
                </Button>
                <Button 
                  variant={activeCategory === 'campus' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveCategory('campus')}
                  className="flex-1"
                >
                  <Building className="mr-2 h-4 w-4" />
                  Campus
                </Button>
                <Button 
                  variant={activeCategory === 'coding' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveCategory('coding')}
                  className="flex-1"
                >
                  <Code className="mr-2 h-4 w-4" />
                  Coding
                </Button>
                <Button 
                  variant={activeCategory === 'transport' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveCategory('transport')}
                  className="flex-1"
                >
                  <Bus className="mr-2 h-4 w-4" />
                  Transport
                </Button>
                <Button 
                  variant={activeCategory === 'results' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveCategory('results')}
                  className="flex-1"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Results
                </Button>
                <Button 
                  variant={activeCategory === 'personal' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveCategory('personal')}
                  className="flex-1"
                >
                  <UserRound className="mr-2 h-4 w-4" />
                  Personal
                </Button>
              </div>
              
              <div className="grid gap-2 md:grid-cols-2">
                {predefinedQuestions[activeCategory].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex items-center justify-start gap-2 text-left h-auto py-2"
                    onClick={() => handlePredefinedQuestion(question)}
                  >
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "mb-4 flex",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "flex max-w-[80%] flex-col gap-2 rounded-lg p-4",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    <AvatarImage src="/ai-avatar.png" />
                  </Avatar>
                )}
                <div className="flex-1">
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < message.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="flex max-w-[80%] items-center gap-2 rounded-lg bg-muted p-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="border-t bg-background p-4">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Ask anything about academics, campus, coding, or your courses..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] flex-1 resize-none"
          />
          <Button
            className="h-10 w-10 rounded-full p-0"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            <SendHorizontal className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>AI-powered assistance</span>
          </div>
          <div className="flex items-center gap-1">
            <Code className="h-3 w-3" />
            <span>Supports code snippets</span>
          </div>
          <div className="flex items-center gap-1">
            <Calculator className="h-3 w-3" />
            <span>Academic help</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Campus information</span>
          </div>
          <div className="flex items-center gap-1">
            <School className="h-3 w-3" />
            <span>Course guidance</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
