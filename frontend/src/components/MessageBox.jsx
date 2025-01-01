"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Send } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserList } from "./UserList";
import {
  initializeSocket,
  sendMessage,
  receiveMessage,
} from "../../config/socket";
import { UseUserContext } from "../../context/UserContext";
import { use } from "react";
export default function MessageBox(project) {
  const { user, getUserDetails } = UseUserContext();
  useEffect(() => {
    getUserDetails();
  }, []);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const scrollAreaRef = useRef(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling effect
      });
    }
  }, [messages]);

  useEffect(() => {
    if (project?.projects?._id) {
      const socket = initializeSocket(project.projects._id);

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      receiveMessage("project-message", (data) => {
        console.log("Message received:", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [project?.projects?._id]);
  useEffect(() => {
    console.log(messages);
  }, [messages]);
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage("project-message", {
        message: inputMessage,
        sender: user.email,
      });
      setInputMessage("");
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: inputMessage, sender: user.email },
      ]);
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

        <div className="flex-grow p-4 overflow-y-auto" ref={scrollAreaRef}>
          <ScrollArea>
            {messages.map((message, index) => {
              const isCurrentUser =
                message.sender === user.email ? "You" : null;
              const showSender =
                index === 0 || messages[index - 1].sender !== message.sender;
              const isConsecutive =
                index > 0 && messages[index - 1].sender === message.sender;

              return (
                <div
                  key={index}
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
                    {message.message}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>

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
