import React from 'react';
import { useParams } from 'react-router-dom';

function UserHomePage() {
  const { username } = useParams<{ username: string }>();

  return (
    <div>
      <h1>User Home Page</h1>
      <p>Welcome to {username}'s page!</p>
    </div>
  );
}

export default UserHomePage;
