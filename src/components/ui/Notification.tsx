import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

let notificationId = 0;
const notifications: Notification[] = [];
const listeners: Array<() => void> = [];

export function addNotification(notification: Omit<Notification, 'id'>): void {
  const id = `notif_${notificationId++}_${Date.now()}`;
  notifications.push({ ...notification, id });
  listeners.forEach((listener) => listener());
  
  const duration = notification.duration || 3000;
  setTimeout(() => {
    const index = notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
      listeners.forEach((listener) => listener());
    }
  }, duration);
}

export function NotificationContainer() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) listeners.splice(index, 1);
    };
  }, []);

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getTypeStyles(notification.type)} px-4 py-2 rounded-lg shadow-lg animate-slide-in-right`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}

