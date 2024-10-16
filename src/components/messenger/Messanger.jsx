import React, { useContext, useEffect, useRef, useState } from 'react';
import Conversation from '../Conversation/Conversation';
import Message from '../Message/Message';
import ChatOnline from '../chatOnline/ChatOnline';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;
const sockeID=import.meta.env.VITE_SOCKET_ID

function Messanger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [arrivedMessage, setArrivedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setnewMessages] = useState('');
  const socket = useRef();
  const scrollRef = useRef();
  const { user } = useContext(AuthContext);

  console.log(sockeID,baseUrl)
  useEffect(() => {
    socket.current = io(sockeID);
    socket.current.on('getMessage', (data) => {
      setArrivedMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', users => {
      console.log(users);
    });
  }, [socket]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/conversations/${user._id}`);
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        try {
          const res = await axios.get(`${baseUrl}/api/messages/${currentChat._id}`);
          setMessages(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMessages();
  }, [currentChat]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const message = {
      senderId: user._id,
      text: newMessages,
      conversationId: currentChat._id
    };
    const receiverId = currentChat.members.find(member => member !== user._id);
    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessages
    });
    setnewMessages('');
    try {
      const res = await axios.post(`${baseUrl}/api/messages`, message);
      setMessages([...messages, res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    arrivedMessage && currentChat?.members.includes(arrivedMessage.senderId) &&
      setMessages((prev) => [...prev, arrivedMessage]);
  }, [arrivedMessage, currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex   h-[calc(100vh-70px)]">
      {/* Chat Menu */}
      <div className="flex  bg-[#1e2c34] p-4">
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Search..." 
            className="p-2 rounded-md outline-none w-full bg-gray-200"
          />
          {conversations && conversations.map((c) => (
            <div key={c._id} onClick={() => setCurrentChat(c)} className="cursor-pointer">
              <Conversation conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-cover bg-center bg-[url('https://w0.peakpx.com/wallpaper/538/546/HD-wallpaper-whatsapp-dark-mode-whatsapp.jpg')] p-4">
        <div className="flex flex-col h-full justify-between">
          {currentChat ? (
            <>
              <div className="flex-1  overflow-y-scroll space-y-4 p-2 scrollbar-hide">
                {messages.map((m) => (
                  <div key={m._id} ref={scrollRef}>
                    <Message message={m} own={m.senderId === user._id} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <textarea
                  className="flex-grow p-2 rounded-md border border-gray-300 resize-none h-12"
                  placeholder="Send a message..."
                  onChange={(e) => setnewMessages(e.target.value)}
                  value={newMessages}
                />
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded-md"
                  onClick={handlesubmit}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <span className="text-white text-2xl text-center mt-8">Start a Chat</span>
          )}
        </div>
      </div>

      {/* Chat Online */}
      <div className="flex-3 bg-blue-600 p-4">
        <div className="flex flex-col">
          <ChatOnline />
        </div>
      </div>
    </div>
  );
}

export default Messanger;
