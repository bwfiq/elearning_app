import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserHomePage from './UserHomePage';

interface User {
  pk: number;
  username: string;
  full_name: string;
  email: string;
  registration_date: string;
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
    <Router>
      <Routes>
        <Route path="/" element={<UserList users={users} />} />
        <Route path="/:username" element={<UserHomePage />} />
      </Routes>
    </Router>
  );
}

function UserList({ users }: { users: User[] }) {
  return (
    <div className="App">
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.pk}>
            <a href={`/${user.username}`}>{user.username}</a> ({user.full_name}) - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
