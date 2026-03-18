import axios from 'axios';

// API endpoints configuration
const API_ENDPOINTS = {
  local: {
    baseUrl: 'http://localhost:8888',
    band: '/band',
    login: '/login',
    error: '/error'
  },
  live: {
    baseUrl: 'https://playlist-api-mu.vercel.app',
    band: '/band',
    login: '/login',
    error: '/error'
  }
};

// Spotify API endpoints
const SPOTIFY_API = {
  baseUrl: 'https://api.spotify.com/v1',
  search: '/search',
  me: '/me',
  playlists: '/playlists'
};

// Determine which environment to use
const isLocal = import.meta.env.DEV || import.meta.env.VITE_USE_LOCAL_API === 'true';
const currentEnv = isLocal ? 'local' : 'live';
const apiConfig = API_ENDPOINTS[currentEnv];

console.log(`Using ${currentEnv} API environment: ${apiConfig.baseUrl}`);

// Create axios instance for our API
const apiClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Create axios instance for Spotify API
const spotifyClient = axios.create({
  baseURL: SPOTIFY_API.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API composable hook
export const useApi = () => {
  
  // Our API endpoints
  const endpoints = {
    band: `${apiConfig.band}`,
    login: `${apiConfig.login}`,
    error: `${apiConfig.error}`
  };

  // Spotify API endpoints
  const spotifyEndpoints = {
    search: `${SPOTIFY_API.search}`,
    me: `${SPOTIFY_API.me}`,
    playlists: `${SPOTIFY_API.playlists}`
  };

  // Our API methods
  const api = {
    // Band setlist search
    searchBandSetlists: async (band, yearOf) => {
      try {
        const response = await apiClient.post(endpoints.band, {
          band,
          yearOf
        });
        return response.data;
      } catch (error) {
        console.error('Error searching band setlists:', error);
        throw error;
      }
    },

    // Spotify login redirect
    getLoginUrl: () => {
      return `${apiConfig.baseUrl}${endpoints.login}`;
    },

    // Error logging
    logError: async (message) => {
      try {
        await apiClient.post(endpoints.error, { msg: message });
        console.log("Error logged successfully.");
      } catch (error) {
        console.error("Failed to log error:", error);
      }
    }
  };

  // Spotify API methods
  const spotify = {
    // Search for tracks
    searchTrack: async (trackName, artistName, accessToken) => {
      try {
        const response = await spotifyClient.get(spotifyEndpoints.search, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            q: `track:${trackName} artist:${artistName}`,
            type: 'track',
            limit: 1
          }
        });
        const tracks = response.data.tracks.items;
        return tracks.length > 0 ? tracks[0].uri : null;
      } catch (error) {
        console.error("Error searching for track:", error);
        throw error;
      }
    },

    // Get current user info
    getCurrentUser: async (accessToken) => {
      try {
        const response = await spotifyClient.get(spotifyEndpoints.me, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
      } catch (error) {
        console.error("Error getting current user:", error);
        throw error;
      }
    },

    // Create playlist
    createPlaylist: async (userId, playlistData, accessToken) => {
      try {
        const response = await spotifyClient.post(
            `/users/${userId}/playlists`,
            playlistData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );
        return response.data;
      } catch (error) {
        console.error("Error creating playlist:", error);
        throw error;
      }
    },

    // Add tracks to playlist
    addTracksToPlaylist: async (playlistId, trackUris, accessToken) => {
      try {
        const response = await spotifyClient.post(
          `${spotifyEndpoints.playlists}/${playlistId}/tracks`,
          { uris: trackUris },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error adding tracks to playlist:", error);
        throw error;
      }
    },

    // Search for artists
    searchArtists: async (query, accessToken) => {
      if (!accessToken) {
        throw new Error('No access token provided');
      }
      
      try {

        const response = await spotifyClient.get(spotifyEndpoints.search, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            q: query.split(' ').join('%20'),
            type: 'artist',
            limit: 5
          }
        });
        return response.data;
      } catch (error) {
        console.error("Error searching artists:", error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
          console.error('Token may be expired or invalid. Please re-authenticate.');
        }
        throw error;
      }
    }
  };

  return {
    // Environment info
    environment: currentEnv,
    isLocal,
    apiConfig,
    
    // API methods
    api,
    spotify,
    
    // Endpoints (for direct access if needed)
    endpoints,
    spotifyEndpoints
  };
};
