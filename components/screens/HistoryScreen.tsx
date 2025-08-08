
import React, { useState, useRef, useEffect } from 'react';
import type { Profile } from '../../types.ts';
import TrashCanIcon from '../icons/TrashCanIcon.tsx';

interface HistoryScreenProps {
    profile: Profile;
    onClearChatHistory: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ profile, onClearChatHistory }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleClearConfirm = () => {
        onClearChatHistory();
        setShowConfirm(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (profile.chatHistory.length > 0) {
            scrollToBottom();
        }
    }, [profile.chatHistory]);

    return (
        <div className="flex flex-col h-[75vh] max-w-4xl mx-auto bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
            <header className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-gray-200">Chat History</h3>
                {profile.chatHistory.length > 0 && (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-red-900/70 hover:bg-red-900 text-red-300 transition-colors"
                        title="Clear Chat History"
                        aria-label="Clear Chat History"
                    >
                        <TrashCanIcon className="w-4 h-4" />
                        Clear History
                    </button>
                )}
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {profile.chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
                         <img src={profile.avatar} alt="AI" className="w-24 h-24 rounded-full bg-gray-700 mb-4 opacity-50" />
                        <h4 className="text-xl font-semibold text-gray-300">No History Yet</h4>
                        <p>Your conversation with the AI Wellness Coach will appear here.</p>
                        <p className="text-sm mt-2">Go to the 'AI Coach' tab to start chatting.</p>
                    </div>
                ) : (
                    profile.chatHistory.map((msg, index) => {
                        const isLastExchange = index >= profile.chatHistory.length - 2;
                        return (
                            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <img src={profile.avatar} alt="AI" className="w-8 h-8 rounded-full bg-gray-700 self-start" />}
                                <div className={`max-w-md lg:max-w-lg p-3 rounded-xl transition-all ${
                                    msg.role === 'user'
                                        ? 'bg-fuchsia-600 text-white rounded-br-none'
                                        : 'bg-gray-700 text-gray-200 rounded-bl-none'
                                } ${isLastExchange ? 'ring-2 ring-fuchsia-500 ring-offset-2 ring-offset-gray-800' : ''}`}>
                                    {msg.parts.map((part, i) => <p key={i} className="whitespace-pre-wrap">{part.text}</p>)}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-700 p-8 text-center">
                        <h3 className="text-2xl font-bold text-gray-100 mb-2">Confirm Clear History</h3>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete your entire chat history? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowConfirm(false)} className="w-full text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors bg-gray-600 hover:bg-gray-500">
                                Cancel
                            </button>
                            <button onClick={handleClearConfirm} className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all bg-red-600 hover:bg-red-700">
                                Yes, Clear History
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryScreen;