import { useState, useEffect } from 'react';
import { llm } from '@chat-app/llm';
import {
    HumanMessage,
    AIMessage,
    SystemMessage
} from '@langchain/core/messages';
import { invokeAssistant } from '@chat-app/assistant';

export const useChat = () => {
    // messages innehåller det vi hämtar från localStorage
    const [messages, setMessages] = useState(() => {
        const chatHistory =
            JSON.parse(localStorage.getItem('messages')) || [
                {
                    role: 'assistant',
                    content: 'Hejsan! Jag är din hjälpsamma AI-assistent! Vad kan jag hjälpa dig med?'
                }
            ];
        
        return chatHistory.map((message) => {
            if (message.role === 'user') {
                return new HumanMessage(message.content);
            }
            
            return new AIMessage(message.content);
        });
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [booking, setBooking] = useState(null);
    const [review, setReview] = useState(null);

    // useEffect uppdaterar localStorage när nya meddelanden läggs till
    useEffect(() => {
        const chatHistory = messages.map((message) => ({
            role: message?.getType() === 'human'
                ? 'user'
                : 'assistant',
            content: message.content
        }));

        localStorage.setItem(
            'messages',
            JSON.stringify(chatHistory)
        );
    }, [messages]);

    // Funktion: getAnswer
    const getAnswer = async (question) => {
        const userMessage = new HumanMessage(question);

        const history = [
            ...messages,
            userMessage
        ];

        setMessages(history);
        setIsLoading(true);
        setError(false);

        try {
            const answer = await invokeAssistant(messages, question);
            console.log('ANSWER', answer);

            const aiMessage = new AIMessage(answer.content);

            setMessages([
                ...history,
                aiMessage
            ]);

            if(answer.booking) {
                setBooking(answer.booking);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Funktion: clearHistory
    const clearHistory = () => {
        setMessages([
            new AIMessage(
                'Hejsan! Jag är din hjälpsamma AI-assistent!'
            )
        ]);
        setBooking(null);
        setReview(null);
    };

    return { 
        messages, 
        getAnswer,
        isLoading,
        error,
        clearHistory,
        booking,
        review
    }
}