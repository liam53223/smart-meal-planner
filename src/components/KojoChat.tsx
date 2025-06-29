'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Kojo } from '@/lib/ai/kojo';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'kojo';
  mood?: 'zen' | 'encouraging' | 'playful' | 'focused' | 'wise';
  timestamp: Date;
}

interface KojoChatProps {
  userProfile: any;
  onRecipeSelect?: (recipe: any) => void;
  onMealPlanGenerated?: (plan: any) => void;
}

export function KojoChat({ userProfile, onRecipeSelect, onMealPlanGenerated }: KojoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [kojoMood, setKojoMood] = useState<'zen' | 'encouraging' | 'playful' | 'focused' | 'wise'>('zen');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const kojoRef = useRef<Kojo | null>(null);

  useEffect(() => {
    // Initialize Kojo
    if (!kojoRef.current) {
      kojoRef.current = new Kojo();
      // Send initial greeting
      sendGreeting();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendGreeting = async () => {
    if (!kojoRef.current) return;
    
    setIsTyping(true);
    const greeting = await kojoRef.current.greet(userProfile);
    
    setMessages([{
      id: Date.now().toString(),
      text: greeting,
      sender: 'kojo',
      mood: 'zen',
      timestamp: new Date()
    }]);
    
    setIsTyping(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !kojoRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await kojoRef.current.chat(input, userProfile);
      
      const kojoMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'kojo',
        mood: response.mood,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, kojoMessage]);
      setKojoMood(response.mood);
      setSuggestions(response.suggestions || []);

      // Check for special actions
      if (input.toLowerCase().includes('recipe')) {
        handleRecipeRequest();
      } else if (input.toLowerCase().includes('meal plan')) {
        handleMealPlanRequest();
      }
    } catch (error) {
      console.error('Error chatting with Kojo:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '🧘 Ah, my apologies friend. I seem to be having a moment of digital meditation. Could you try asking again?',
        sender: 'kojo',
        mood: 'zen',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRecipeRequest = async () => {
    if (!kojoRef.current) return;
    
    setIsTyping(true);
    const recommendation = await kojoRef.current.recommendRecipe(userProfile);
    
    // Create a special recipe message
    const recipeMessage: Message = {
      id: Date.now().toString(),
      text: `🍳 I've found the perfect recipe for you!\n\n**${recommendation.recipe.name}**\n${recommendation.recipe.description}\n\n${recommendation.kojoNote}`,
      sender: 'kojo',
      mood: 'playful',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, recipeMessage]);
    
    if (onRecipeSelect) {
      onRecipeSelect(recommendation.recipe);
    }
    
    setIsTyping(false);
  };

  const handleMealPlanRequest = async () => {
    if (!kojoRef.current) return;
    
    setIsTyping(true);
    const planData = await kojoRef.current.generateMealPlan(userProfile);
    
    const planMessage: Message = {
      id: Date.now().toString(),
      text: `📅 Your personalized meal plan is ready!\n\n${planData.kojoTips.join('\n')}\n\nI've organized everything to fit your schedule and preferences.`,
      sender: 'kojo',
      mood: 'focused',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, planMessage]);
    
    if (onMealPlanGenerated) {
      onMealPlanGenerated(planData.plan);
    }
    
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const getMoodAnimation = () => {
    const animations = {
      zen: 'animate-pulse',
      encouraging: 'animate-bounce',
      playful: 'animate-spin',
      focused: 'animate-ping',
      wise: 'animate-pulse'
    };
    
    return animations[kojoMood] || 'animate-pulse';
  };

  const getMoodColor = () => {
    const colors = {
      zen: 'bg-green-500',
      encouraging: 'bg-blue-500',
      playful: 'bg-purple-500',
      focused: 'bg-yellow-500',
      wise: 'bg-indigo-500'
    };
    
    return colors[kojoMood] || 'bg-green-500';
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-xl">
      {/* Kojo Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full ${getMoodColor()} flex items-center justify-center text-white text-2xl`}>
              🧘
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getMoodColor()} ${getMoodAnimation()}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Kojo</h3>
            <p className="text-xs text-gray-500">Your Flavor Monk • {kojoMood} mode</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Kojo anything about nutrition, recipes, or cooking..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 