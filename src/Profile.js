
import React from 'react';

const Profile = ({ session, role }) => {
  if (!session || !session.user) {
    return <div style={{ color: 'red' }}>No user session found.</div>;
  }
  return (
    <div>
      <h2>Profile Page</h2>
      <p><strong>Email:</strong> {session.user.email}</p>
      <p><strong>Role:</strong> {role}</p>
    </div>
  );
};

export default Profile;
