import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "../components/css/Chat.css";

// Configuración de Socket.io
const socket = io("http://localhost:8080", {
    withCredentials: true,
});

const Chat = () => {
    const [messages, setMessages] = useState([]); // Mensajes grupales
    const [messageInput, setMessageInput] = useState(""); // Entrada del mensaje

    useEffect(() => {
        // Escuchar mensajes grupales del servidor
        const handleReceiveMessage = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        // Registrar evento
        socket.on("receive_message", handleReceiveMessage);

        // Limpiar eventos al desmontar el componente
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, []);

    const sendMessage = () => {
        if (!messageInput.trim()) return; // No enviar mensajes vacíos

        // Emitir mensaje al servidor
        socket.emit("send_message", { message: messageInput });
        setMessageInput(""); // Limpiar el campo de texto
    };

    return (
        <div className="Chat">
            <div className="chat-container">
                <h3>Chat</h3>
                <div className="chat-section">
                    <div className="messages">
                        {/* Mostrar mensajes grupales */}
                        {messages.map((msg, idx) => (
                            <p key={idx}>{msg}</p>
                        ))}
                    </div>
                    <div className="input-section">
                        <input
                            type="text"
                            value={messageInput}
                            placeholder="Type your message here"
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
