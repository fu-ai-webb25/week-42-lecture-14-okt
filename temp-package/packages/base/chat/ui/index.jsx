import { Message } from '@chat-app/message';
import { Loading } from '@chat-app/loading';
import { useRef, useEffect } from 'react';
import { useChat } from '@chat-app/usechat';
import './index.css';

export const Chat = () => {
    const { messages, getAnswer, isLoading, error, clearHistory } = useChat();
    const inputRef = useRef();
    
    // Hanterar scrollningen på sidan vid nya meddelanden
    const messagesRef = useRef(null);
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop =
                messagesRef.current.scrollHeight;
        }
    }, [messages, isLoading]);  

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userInput = inputRef.current.value;
        inputRef.current.value = '';
        getAnswer(userInput);
    }

    const messageComponents = messages.map((message, index) => {
        const role = message.getType() === 'human'
            ? 'user'
            : 'assistant';
        
        return <Message 
            key={ index }
            content={ message.content }
            role={ role }
        />
    });

    return (
        <main className="chat">
            <section className="chat__messages" ref={ messagesRef }>
                { messageComponents }
                { isLoading && <Loading /> }
                { error && <p>{ error }</p> }
            </section>
            <form className="chat__form" onSubmit={ handleSubmit }>
                <input type="text" className="chat__input" ref={ inputRef } />
                <button className="chat__submit">Skicka</button>
                <button type="button" className="chat__submit" onClick={ clearHistory } >Clear</button>
            </form>
        </main>
    )
}