"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Send } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserList } from "./UserList";
export default function MessageBox(project) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "other" },
    { id: 2, text: "Hello everyone!", sender: "Alice" },
    { id: 3, text: "Welcome to the group chat!", sender: "Alice" },
    { id: 4, text: "Hi Alice! How are you?", sender: "Bob" },
    { id: 6, text: "Hey folks, what's up?", sender: "Charlie" },
    { id: 5, text: "I'm doing great, thanks for asking!", sender: "Alice" },
    {
      id: 7,
      text: "Hello! how are you doin today? iam testing teh length of the message ",
      sender: "other",
    },
    { id: 9, text: "Hi there!", sender: "You" },
    {
      id: 8,
      text: "Hello! how are you doin today? iam testing teh length of the message there!",
      sender: "You",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const scrollAreaRef = useRef(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: inputMessage, sender: "You" },
      ]);
      setInputMessage("");
    }
  };

  return (
    project.projects.name && (
      <div className="fixed left-0 top-0 bottom-0 w-1/5 flex flex-col bg-[#1e2e4b] text-slate-300 border-r">
        {/* Header */}
        <div className="p-3 bg-[#090f18] border-b flex justify-between items-center">
          <span className="font-semibold text-slate-100">
            {project.projects?.name.toUpperCase()}
          </span>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="cursor-pointer h-9 w-9 flex items-center justify-center bg-slate-200 text-slate-800 rounded-full p-2 "
                variant="ghost"
                size="icon"
              >
                <Users className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[250px] sm:w-[300px] bg-[#25354d]  text-slate-200"
            >
              <UserList project={project.projects} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Message List */}
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {messages.map((message, index) => {
            const isCurrentUser = message.sender === "You"; // Updated to check for "user"
            const showSender =
              index === 0 || messages[index - 1].sender !== message.sender;
            const isConsecutive =
              index > 0 && messages[index - 1].sender === message.sender;

            return (
              <div
                key={message.id}
                className={`mb-${isConsecutive ? "1" : "4"} ${
                  isCurrentUser ? "ml-auto text-right" : "text-left"
                }`}
              >
                {showSender && (
                  <div className="text-sm text-slate-400 mb-1">
                    {message.sender}
                  </div>
                )}
                <div
                  className={`p-2 rounded-lg inline-block max-w-[80%] ${
                    isCurrentUser
                      ? "bg-slate-900 text-primary-foreground "
                      : "bg-secondary text-slate-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="text-slate-800"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  );
}
