// frontend/src/Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import Config from './Config';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<{ username: string; message: string; }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const username = localStorage.getItem('username') || 'Anonymous';
    const apiUrl = Config.apiUrl;
    const wsURL = apiUrl.replace('http', 'ws') + '/ws/chat/';

    const chatBoxRef = useRef<HTMLDivElement>(null); // Ref for the chat box

    useEffect(() => {
        const newSocket = new WebSocket(wsURL);

        newSocket.onopen = () => {
            console.log('WebSocket connected');
        };

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, { username: data.username, message: data.message }]);
        };

        newSocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [wsURL]);

    // Scroll to bottom when new message arrives
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (socket && socket.readyState === WebSocket.OPEN && newMessage.trim()) {
            socket.send(JSON.stringify({
                'message': newMessage,
                'username': username,
            }));
            setNewMessage('');
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div ref={chatBoxRef} style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.username}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
