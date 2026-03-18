import React, {useState} from "react";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "../contexts/AuthContext";
import { useApi } from "../composables/useApi.js";

// eslint-disable-next-line react/prop-types
const AddToPlaylist = ({playlistArr,band}) => {
    const { accessToken } = useAuth();
    const { spotify } = useApi();
    const [playlistName, setPlaylistName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const getAllSongs = (set) => {
        return set.flatMap((item) =>
            item.song.map((song) => song.name).filter((name) => name) // Remove empty song names
        );
    };

    const searchTrack = async (trackName, artistName) => {

        try {
            const uri = await spotify.searchTrack(trackName, artistName, accessToken);
            return uri;
        } catch (error) {
            console.error("Error searching for track:", error);
            return null;
        }
    };

    const createPlaylist = async () => {
        if (!accessToken) {
            setMessage("Access token required!");
            return;
        }

        try {
            setLoading(true);
            // Step 1: Get the User ID
            const user = await spotify.getCurrentUser(accessToken);
            const userId = user.id;

            // Step 2: Create a new Playlist
            const playlist = await spotify.createPlaylist(
                userId,
                {
                    name: playlistName || "New Playlist",
                    description: "Created with Spotify API",
                    public: true,
                },
                accessToken
            );

            const playlistId = playlist.id;
            const trackUris = [];
            let songs = getAllSongs(playlistArr);


            for (const entry of songs) {
                if (entry) {
                    const uri = await searchTrack(entry, band);
                    if (uri) trackUris.push(uri);
                }
            }

            // Step 3: Add Tracks to the Playlist
            await spotify.addTracksToPlaylist(playlistId, trackUris, accessToken);

            setLoading(false);
            setMessage("Playlist created and tracks added!" + " <a>" +playlist.href + "</a>" );
        } catch (error) {
            setLoading(false);
            setMessage("Error creating playlist." + error);
            console.error("Playlist creation error:", error);
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
            {message && <p className="mt-2 text-black text-sm">{message} </p>}
        </div>
    );
};

export default AddToPlaylist;
