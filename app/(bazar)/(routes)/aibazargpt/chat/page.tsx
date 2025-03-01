"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/spinner"
import { AlertCircle } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{role: string, content: string, isError?: boolean}>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    
    try {
      setIsLoading(true)
      setMessages(prev => [...prev, { role: "user", content: input }])
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error('Ошибка при отправке сообщения');

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content }])
      setInput("")
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.",
        isError: true 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="space-y-4 mb-4 h-[600px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`p-4 rounded-lg ${
            msg.role === "user" 
              ? "bg-primary/10 ml-auto" 
              : msg.isError 
                ? "bg-red-100 dark:bg-red-900/10" 
                : "bg-muted"
          } max-w-[80%] flex items-start gap-2`}>
            {msg.isError && <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-1" />}
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? <Spinner size="sm" /> : "Отправить"}
        </Button>
      </div>
    </div>
  )
} 