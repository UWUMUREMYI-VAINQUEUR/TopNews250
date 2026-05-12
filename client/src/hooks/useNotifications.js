import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getNotifications } from '../services/api';

/* =======================
   API BASE URL
======================= */
const API = import.meta.env.VITE_API_URL;

export default function useNotifications(user) {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) { /* ignore */ }
    }
    load();
  }, []);

  useEffect(() => {
    if (!user) return;
    const s = io(API, { transports: ['websocket'] });
    setSocket(s);

    s.on('connect', () => {
      s.emit('joinRoom', user.id || user.username || localStorage.getItem('username'));
    });

    s.on('notification', (n) => {
      setNotifications(prev => [n, ...prev]);
    });

    return () => s.disconnect();
  }, [user]);

  return { socket, notifications, setNotifications };
}