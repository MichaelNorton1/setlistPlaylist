import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSetlist } from '../contexts/SetlistContext';

const LoginForm = () => {
  const { isAuthenticated, handleSpotifyLogin } = useAuth();
  const { setlists, clearSetlists } = useSetlist();

  if (setlists.length > 0) {
    return (
      <div>
        <button onClick={clearSetlists}>
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <section className="mb-6">
      {!isAuthenticated ? (
        <button onClick={handleSpotifyLogin} className="">
          Login with Spotify
        </button>
      ) : (
        <p className="text-green-600">You are logged in to Spotify!</p>
      )}
    </section>
  );
};

export default LoginForm;
