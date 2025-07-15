import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion'; // Not used
import {
  Users,
  Play,
  Pause,
  Volume2,
  MessageCircle,
  Share2,
  UserPlus,
  Crown,
  Headphones,
  Send,
  X
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useListeningParty, useWebSocket } from '../../services/websocketService';
import { formatTime } from '../../utils/helpers';

const ListeningParty = ({
  partyId,
  currentSong,
  isPlaying,
  currentTime,
  onClose
}) => {
  const { participants, updatePartyState } = useListeningParty(partyId);
  // const party = {}; // Not used currently
  const { isConnected } = useWebSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Listen for chat messages
  const handleMessage = useCallback((data) => {
    if (data.partyId === partyId) {
      setMessages(prev => [...prev, data.message]);
    }
  }, [partyId]);

  useEffect(() => {

    // Setup WebSocket listeners for chat
    // wsService.on('chatMessage', handleMessage);

    return () => {
      // wsService.off('chatMessage', handleMessage);
    };
  }, [partyId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Send message through WebSocket
      // wsService.send('CHAT_MESSAGE', { partyId, message: message.trim() });

      // Add to local messages (temporary)
      const newMessage = {
        id: Date.now(),
        user: { name: 'You', avatar: '/default-avatar.jpg' },
        text: message.trim(),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      // Send invite through WebSocket
      // wsService.sendListeningPartyInvite([inviteEmail], partyId);
      setInviteEmail('');
      setShowInvite(false);
    }
  };

  const handleSyncPlayback = () => {
    updatePartyState({
      currentSong,
      isPlaying,
      currentTime,
      timestamp: Date.now()
    });
  };

  const ParticipantAvatar = ({ participant, isHost = false }) => (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <img
        src={participant.avatar || '/default-avatar.jpg'}
        alt={participant.name}
        className="w-10 h-10 rounded-full border-2 border-gray-600"
      />
      {isHost && (
        <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
      )}
      {participant.isListening && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Headphones className="w-2 h-2 text-white" />
        </motion.div>
      )}
    </motion.div>
  );

  const ChatMessage = ({ message }) => (
    <motion.div
      className="flex items-start space-x-3 p-3 hover:bg-gray-800/50 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <img
        src={message.user.avatar || '/default-avatar.jpg'}
        alt={message.user.name}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-white text-sm">{message.user.name}</span>
          <span className="text-xs text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-gray-300 text-sm mt-1">{message.text}</p>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-xl w-full max-w-4xl h-[80vh] overflow-hidden flex"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-green-500" />
                <div>
                  <h2 className="text-xl font-bold text-white">Listening Party</h2>
                  <p className="text-gray-400 text-sm">
                    {participants.length} participant{participants.length !== 1 ? 's' : ''}
                    {!isConnected && (
                      <span className="text-red-400 ml-2">• Disconnected</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setShowInvite(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>

                <Button
                  variant="outline"
                  size="small"
                  onClick={handleSyncPlayback}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Sync
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Participants</h3>
            <div className="flex flex-wrap gap-3">
              {participants.map((participant, index) => (
                <div key={participant.id} className="flex flex-col items-center space-y-2">
                  <ParticipantAvatar
                    participant={participant}
                    isHost={index === 0}
                  />
                  <span className="text-xs text-gray-400 truncate max-w-16">
                    {participant.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Now Playing */}
          {currentSong && (
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Now Playing</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={currentSong.imageUrl || '/placeholder-album.jpg'}
                  alt={currentSong.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{currentSong.title}</h4>
                  <p className="text-gray-400">{currentSong.artist}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-green-500" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-400">
                      {formatTime(currentTime)} / {formatTime(currentSong.duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Chat</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                </AnimatePresence>
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-gray-800">
            <div className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-green-500 hover:bg-green-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Invite Friend</h3>
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                className="mb-4"
              />
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowInvite(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  Send Invite
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ListeningParty;
