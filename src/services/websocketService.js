// WebSocket service for real-time features
import React, { useState, useEffect } from 'react';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000;
    this.listeners = new Map();
    this.isConnected = false;
    this.token = null;
    this.heartbeatInterval = null;
    this.messageQueue = [];
  }

  // Connect to WebSocket server
  connect(token) {
    this.token = token;

    try {
      // For development, simulate WebSocket connection
      if (import.meta.env.DEV || !this.url.startsWith('wss://')) {
        console.log('WebSocket: Using development mode (no real connection)');
        this.isConnected = true;
        this.emit('connected');
        return;
      }

      this.ws = new WebSocket(`${this.url}?token=${token}`);
      this.setupEventListeners();
    } catch (error) {
      console.warn('WebSocket connection failed, using fallback mode:', error.message);
      this.isConnected = false;
      // Don't call handleReconnect in development to avoid spam
    }
  }

  // Setup WebSocket event listeners
  setupEventListeners() {
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.processMessageQueue();
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnected = false;
      this.stopHeartbeat();
      this.emit('disconnected', { code: event.code, reason: event.reason });

      // Attempt to reconnect unless it was a clean close
      if (event.code !== 1000) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  // Handle incoming messages
  handleMessage(data) {
    const { type, payload } = data;
    // const timestamp = data.timestamp; // Not used currently

    switch (type) {
      case 'PONG':
        // Heartbeat response
        break;

      case 'USER_JOINED':
        this.emit('userJoined', payload);
        break;

      case 'USER_LEFT':
        this.emit('userLeft', payload);
        break;

      case 'SONG_CHANGED':
        this.emit('songChanged', payload);
        break;

      case 'PLAYLIST_UPDATED':
        this.emit('playlistUpdated', payload);
        break;

      case 'LIKE_ADDED':
        this.emit('likeAdded', payload);
        break;

      case 'LIKE_REMOVED':
        this.emit('likeRemoved', payload);
        break;

      case 'COMMENT_ADDED':
        this.emit('commentAdded', payload);
        break;

      case 'LISTENING_PARTY_INVITE':
        this.emit('listeningPartyInvite', payload);
        break;

      case 'LISTENING_PARTY_UPDATE':
        this.emit('listeningPartyUpdate', payload);
        break;

      case 'NOTIFICATION':
        this.emit('notification', payload);
        break;

      case 'SYNC_REQUEST':
        this.emit('syncRequest', payload);
        break;

      default:
        console.warn('Unknown message type:', type);
        this.emit('message', data);
    }
  }

  // Send message to server
  send(type, payload = {}) {
    const message = {
      type,
      payload,
      timestamp: Date.now()
    };

    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for later
      this.messageQueue.push(message);
    }
  }

  // Process queued messages
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.ws.send(JSON.stringify(message));
    }
  }

  // Start heartbeat
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send('PING');
      }
    }, 30000); // 30 seconds
  }

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Handle reconnection
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);

      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

      setTimeout(() => {
        if (this.token) {
          this.connect(this.token);
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.stopHeartbeat();
    this.isConnected = false;
    this.token = null;
    this.messageQueue = [];
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit event to listeners
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event listener:', error);
        }
      });
    }
  }

  // Join a room (for group features)
  joinRoom(roomId) {
    this.send('JOIN_ROOM', { roomId });
  }

  // Leave a room
  leaveRoom(roomId) {
    this.send('LEAVE_ROOM', { roomId });
  }

  // Send listening party invite
  sendListeningPartyInvite(userIds, playlistId) {
    this.send('LISTENING_PARTY_INVITE', { userIds, playlistId });
  }

  // Update listening party state
  updateListeningParty(partyId, state) {
    this.send('LISTENING_PARTY_UPDATE', { partyId, state });
  }

  // Send current song update
  updateCurrentSong(songId, timestamp, isPlaying) {
    this.send('SONG_UPDATE', { songId, timestamp, isPlaying });
  }

  // Send like/unlike
  sendLike(songId, isLiked) {
    this.send(isLiked ? 'LIKE_SONG' : 'UNLIKE_SONG', { songId });
  }

  // Send comment
  sendComment(songId, comment) {
    this.send('ADD_COMMENT', { songId, comment });
  }

  // Request sync with other devices
  requestSync() {
    this.send('SYNC_REQUEST');
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      readyState: this.ws ? this.ws.readyState : WebSocket.CLOSED
    };
  }
}

// Create singleton instance
export const wsService = new WebSocketService();

// React hook for WebSocket
export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      setError(null);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
    };

    const handleError = (error) => {
      setError(error);
    };

    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);
    wsService.on('error', handleError);

    return () => {
      wsService.off('connected', handleConnected);
      wsService.off('disconnected', handleDisconnected);
      wsService.off('error', handleError);
    };
  }, []);

  return {
    isConnected,
    error,
    send: wsService.send.bind(wsService),
    on: wsService.on.bind(wsService),
    off: wsService.off.bind(wsService)
  };
}

// React hook for listening party
export function useListeningParty(partyId) {
  const [party, setParty] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (partyId) {
      wsService.joinRoom(`party_${partyId}`);

      const handlePartyUpdate = (data) => {
        if (data.partyId === partyId) {
          setParty(data.party);
          setParticipants(data.participants || []);
        }
      };

      const handleUserJoined = (data) => {
        if (data.roomId === `party_${partyId}`) {
          setParticipants(prev => [...prev, data.user]);
        }
      };

      const handleUserLeft = (data) => {
        if (data.roomId === `party_${partyId}`) {
          setParticipants(prev => prev.filter(p => p.id !== data.user.id));
        }
      };

      wsService.on('listeningPartyUpdate', handlePartyUpdate);
      wsService.on('userJoined', handleUserJoined);
      wsService.on('userLeft', handleUserLeft);

      return () => {
        wsService.leaveRoom(`party_${partyId}`);
        wsService.off('listeningPartyUpdate', handlePartyUpdate);
        wsService.off('userJoined', handleUserJoined);
        wsService.off('userLeft', handleUserLeft);
      };
    }
  }, [partyId]);

  const updatePartyState = (state) => {
    wsService.updateListeningParty(partyId, state);
  };

  return {
    party,
    participants,
    updatePartyState
  };
}

// React hook for real-time notifications
export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
    };

    wsService.on('notification', handleNotification);

    return () => {
      wsService.off('notification', handleNotification);
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    clearNotifications,
    removeNotification
  };
}

export default wsService;
