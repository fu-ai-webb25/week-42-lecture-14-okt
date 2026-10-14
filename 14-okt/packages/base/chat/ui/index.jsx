
import { Message } from '@chat-app/message';
import { Loading } from '@chat-app/loading';
import { useRef, useEffect } from 'react';
import { useChat } from '@chat-app/usechat';
import './index.css';

export const Chat = () => {
    const {
        messages,
        getAnswer,
        isLoading,
        error,
        clearHistory,
        booking,
        review
    } = useChat();

    const inputRef = useRef();
    const messagesRef = useRef(null);

    // Hanterar scrollningen på sidan vid nya meddelanden
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop =
                messagesRef.current.scrollHeight;
        }
    }, [messages, isLoading, booking, review]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const userInput = inputRef.current.value.trim();
        if (!userInput) return;

        inputRef.current.value = '';
        getAnswer(userInput);
    };

    const messageComponents = messages.map((message, index) => {
        const role = message.getType() === 'human'
            ? 'user'
            : 'assistant';

        return (
            <Message
                key={index}
                content={message.content}
                role={role}
            />
        );
    });

    return (
        <main className="chat">
            <section className="chat__messages" ref={messagesRef}>
                {messageComponents}

                {booking && (
                    <article className="booking-ticket">
                        <h2>Din biobiljett</h2>

                        <h3>{booking.title}</h3>

                        <p>Visningstid: {booking.showtime}</p>
                        <p>Antal biljetter: {booking.tickets}</p>
                        <p>Bokningsnummer: {booking.id}</p>

                        <button
                            type="button"
                            onClick={() => window.print()}
                        >
                            Skriv ut biljett
                        </button>
                    </article>
                )}

                {review && (
                    <article className="review-card">
                        <h2>Din filmrecension</h2>

                        <h3>{review.movie}</h3>

                        <p>Betyg: {review.rating ?? "Ej angivet"}/5</p>
                        <p>Känsla: {review.sentiment}</p>
                        <p>Sammanfattning: {review.summary}</p>
                    </article>
                )}

                {isLoading && <Loading />}
                {error && <p>{error}</p>}
            </section>

            <form className="chat__form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="chat__input"
                    ref={inputRef}
                />

                <button className="chat__submit">
                    Skicka
                </button>

                <button
                    type="button"
                    className="chat__submit"
                    onClick={clearHistory}
                >
                    Clear
                </button>
            </form>
        </main>
    );
};
