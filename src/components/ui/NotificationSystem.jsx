import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; // Not used
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { useMusic } from '../../hooks/useMusic';

const NotificationSystem = () => {
  const { notification, actions } = useMusic();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (notification) {
      const newNotification = {
        ...notification,
        id: notification.id || Date.now()
      };

      setNotifications(prev => [...prev, newNotification]);

      // Auto remove after duration
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  }, [notification, removeNotification]); // Added missing dependency

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification?.id === id) {
      actions.clearNotification();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600 text-white';
      case 'error':
        return 'bg-red-500 border-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600 text-black';
      case 'info':
      default:
        return 'bg-blue-500 border-blue-600 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-80 max-w-96
              ${getColors(notif.type)}
              backdrop-blur-sm bg-opacity-95
            `}
          >
            <div className="flex-shrink-0">
              {getIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {notif.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(notif.id)}
              className="flex-shrink-0 hover:bg-black hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
