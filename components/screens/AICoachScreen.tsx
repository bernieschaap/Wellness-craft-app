import React, { useState, useRef, useEffect } from 'react';
import type { Profile, ChatHistoryContent } from '../../types';
import { sendMessageStream } from '../../services/geminiService';
import PaperAirplaneIcon from '../icons/PaperAirplaneIcon';

const AICoachScreen = ({ profile, onSaveChatHistory }: { profile: Profile; onSaveChatHistory: (userMessage: string, modelResponse: string) => void; }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingResponse, setStreamingResponse] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [currentChat, setCurrentChat] = useState<ChatHistoryContent[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const draftKey = `wellnessCraft-chatDraft-${profile.id}`;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    // Load draft from local storage on component mount or profile change
    useEffect(() => {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
            setInput(savedDraft);
        } else {
            setInput(''); // Clear input when profile changes and no draft exists
        }
        // Also reset chat when profile changes
        setCurrentChat([]);
    }, [profile.id, draftKey]);


    useEffect(() => {
        scrollToBottom();
    }, [profile.chatHistory, currentChat, streamingResponse]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);
        if (value) {
            localStorage.setItem(draftKey, value);
        } else {
            localStorage.removeItem(draftKey);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        const newUserMessageContent: ChatHistoryContent = { role: 'user', parts: [{ text: userMessage }] };

        // History for the API call should be everything *before* the new message
        const historyForApi = [...profile.chatHistory, ...currentChat];
        
        setIsLoading(true);
        setError(null);
        setStreamingResponse('');
        // Optimistically update UI with the new message
        setCurrentChat(prev => [...prev, newUserMessageContent]);

        try {
            const stream = await sendMessageStream(profile.userDetails, historyForApi, userMessage);
            let fullResponse = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                fullResponse += chunkText;
                setStreamingResponse(prev => prev + chunkText);
            }
            onSaveChatHistory(userMessage, fullResponse);

            // On success, clear the input, remove the draft from storage, and clear the temporary chat
            setInput('');
            localStorage.removeItem(draftKey);
            setCurrentChat([]); // Clear temporary chat once saved
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);
            console.error(err);
             // On error, remove the optimistic user message from the display so they can try again
            setCurrentChat(prev => prev.filter(msg => msg !== newUserMessageContent));
        } finally {
            setIsLoading(false);
            setStreamingResponse('');
        }
    };
    
    const displayHistory = [...profile.chatHistory, ...currentChat];

    return (
        <div className="flex flex-col h-[75vh] max-w-4xl mx-auto bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
            <header className="p-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-500 text-center">AI Wellness Coach</h3>
            </header>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {displayHistory.length === 0 && !isLoading && (
                     <div className="text-center text-gray-400 p-8">
                        <p>Ask me anything about your plan, nutrition, or exercises!</p>
                        <p className="text-sm mt-2">For example: "Can you suggest a substitute for salmon?"</p>
                    </div>
                )}

                {displayHistory.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <img src={profile.avatar} alt="AI" className="w-8 h-8 rounded-full bg-gray-700 self-start" />}
                        <div className={`max-w-md lg:max-w-lg p-3 rounded-xl ${msg.role === 'user' ? 'bg-fuchsia-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                            {msg.parts.map((part, i) => <p key={i} className="whitespace-pre-wrap">{part.text}</p>)}
                        </div>
                    </div>
                ))}

                {streamingResponse && (
                     <div className="flex items-end gap-2 justify-start">
                        <img src={profile.avatar} alt="AI" className="w-8 h-8 rounded-full bg-gray-700 self-start" />
                        <div className="max-w-md lg:max-w-lg p-3 rounded-xl bg-gray-700 text-gray-200 rounded-bl-none">
                            <p className="whitespace-pre-wrap">{streamingResponse}<span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span></p>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>

             {error && <p className="text-red-400 text-sm text-center px-4 pb-2">{`Error: ${error}`}</p>}

            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Ask your coach anything..."
                        disabled={isLoading}
                        className="flex-1 bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition resize-none"
                        rows={1}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="p-3 rounded-full bg-fuchsia-600 text-white hover:bg-fuchsia-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        ) : (
                             <PaperAirplaneIcon className="w-6 h-6" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AICoachScreen;