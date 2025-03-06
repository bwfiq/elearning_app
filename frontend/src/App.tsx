import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface User {
  pk: number;
  username: string;
  fullName: string;
  email: string;
  registrationDate: string;
}


function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(`${apiUrl}/api/users/`);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="App">
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.pk}>
            {user.username} ({user.fullName}) - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
