import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!conversation || !currentUser) return;

    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/users?userId=${friendId}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [conversation, currentUser]);

  return (
    <div className='flex items-center space-x-4 p-4 cursor-pointer transition duration-300 hover:bg-slate-900 rounded-lg'>
      {user ? (
        <>
          <img
            className='w-10 h-10 rounded-full object-cover'
            src={user.profilePicture || "https://i.pinimg.com/474x/57/10/4e/57104e667436b771b7671e4054dc72be.jpg"}
            alt="User"
          />
          <span className='font-semibold  text-white text-lg truncate'>{user.username}</span>
        </>
      ) : (
        <p className='text-gray-500 text-sm'>Loading...</p>
      )}
    </div>
  );
}

export default Conversation;
