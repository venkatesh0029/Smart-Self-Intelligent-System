import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastEvent, setLastEvent] = useState(null);
    const wsRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

    const connect = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        wsRef.current = new WebSocket(`${WS_URL}/ws`);

        wsRef.current.onopen = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
            wsRef.current.send(JSON.stringify({ command: 'start' }));
        };

        wsRef.current.onclose = () => {
            console.log('Disconnected from WebSocket');
            setIsConnected(false);
            setTimeout(connect, 3000); // Auto reconnect
        };

        wsRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'event') {
                setLastEvent(message.data);
            }
        };
    };

    useEffect(() => {
        connect();
        return () => wsRef.current?.close();
    }, []);

    return (
        <SocketContext.Provider value={{ isConnected, lastEvent, API_URL }}>
            {children}
        </SocketContext.Provider>
    );
};
