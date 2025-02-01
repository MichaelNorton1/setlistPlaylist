import React, {useState} from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import logErrorToServer from "../logErrorToServer.js";

// eslint-disable-next-line react/prop-types
const AddToPlaylist = ({playlistArr}) => {
    const [playlistName, setPlaylistName] = useState("");

    const [message, setMessage] = useState("");
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem("accessToken"));
    const [loading, setLoading] = useState(false);
    const getAllSongs = (set) => {
        return set.flatMap((item) =>
            item.song.map((song) => song.name).filter((name) => name) // Remove empty song names
        );
    };

    const searchTrack = async (query) => {
        try {
            const response = await axios.get("https://api.spotify.com/v1/search", {
                headers: {Authorization: `Bearer ${accessToken}`},
                params: {
                    q: query,
                    type: "track",
                    limit: 1, // Get only the first matching track
                },
            });

            const tracks = response.data.tracks.items;
            return tracks.length > 0 ? tracks[0].uri : null;
        } catch (error) {
            console.error("Error searching for track:", error);
            await logErrorToServer(JSON.stringify(error));
            return null;
        }
    };

    const createPlaylist = async () => {

        if (!sessionStorage.getItem("accessToken")) {
            setMessage("Access token required!");
            return;
        }

        try {
            setLoading(true);
            // Step 1: Get the User ID
            const userResponse = await axios.get("https://api.spotify.com/v1/me", {
                headers: {Authorization: `Bearer ${accessToken}`},
            });
            const userId = userResponse.data.id;

            // Step 2: Create a new Playlist
            const playlistResponse = await axios.post(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    name: playlistName || "New Playlist",
                    description: "Created with Spotify API",
                    public: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const playlistId = playlistResponse.data.id;
            const trackUris=[]
            let songs =getAllSongs(playlistArr)
            console.log(songs);
            for (const entry of songs) {
                if (entry) {
                    const uri = await searchTrack(entry);
                    if (uri) trackUris.push(uri);
                }
            }

            // Step 3: Add Tracks to the Playlist

            await axios.post(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    uris: trackUris,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setLoading(false);
            setMessage("Playlist created and tracks added!");
        } catch (error) {
            setLoading(false);
            setMessage("Error creating playlist." + error);
            await logErrorToServer(JSON.stringify(error));
        }
    };







    return (
        <div className=" max-w-md mx-auto bg-gray-800 text-white rounded-lg">
            <h4 className="text-xl font-bold mb-2">Create Spotify Playlist</h4>
            <input
                className="w-full p-2 mb-2 text-white rounded"
                type="text"
                placeholder="Playlist Name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
            />



            <button
                className="w-full p-2 bg-green-500 hover:bg-green-700 rounded"
                onClick={createPlaylist}
            >
                {loading ? (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                        />
                        Processing...
                    </>
                ) : (
                    "Create Playlist"
                )}

            </button>
            {message && <p className="mt-2 text-black text-sm">{message}</p>}
        </div>
    );
};

export default AddToPlaylist;
