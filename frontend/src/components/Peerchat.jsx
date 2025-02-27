import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

const Avatar = ({ src, alt, fallback, size = 'md' }) => {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizeStyles[size]} rounded-full overflow-hidden bg-purple-200 flex items-center justify-center text-purple-700`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        fallback || alt?.charAt(0) || '?'
      )}
    </div>
  );
};

const UserCard = ({ user, onMessage }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white shadow-sm rounded-lg mb-4">
      <Avatar
        src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
        alt={user.name}
        fallback={user.name.charAt(0)}
      />
      <div className="flex-grow">
        <h2 className="font-semibold text-lg text-purple-900">{user.name}</h2>
        <p className="text-sm text-purple-600">{user.email}</p>
      </div>
      <button 
        onClick={() => onMessage(user.id)}
        className="bg-purple-600 text-white py-2 px-4 rounded-lg">
        Message
      </button>
    </div>
  );
};

const UsersPage = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/getusers?current_user_id=${currentUserId}`);
        // Filter out the current user
        const filteredUsers = response.data.filter(user => user.id !== currentUserId);
        setUsers(filteredUsers);
      } catch (err) {
        setError('Failed to fetch users');
        toast.error('Error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const handleMessageClick = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-client-id/${userId}`);
      const clientId = response.data.client_id;
      window.location.href = `/socket?clientId=${clientId}&userId=${userId}`;
    } catch (error) {
      toast.error("Failed to fetch client ID for messaging");
    }
  };

  if (loading) {
    return <p className="text-purple-600 text-center mt-4">Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-900 mb-6">All Users</h1>
      <div>
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard key={user.id} user={user} onMessage={handleMessageClick} />
          ))
        ) : (
          <p className="text-purple-600">No users found.</p>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default UsersPage;
