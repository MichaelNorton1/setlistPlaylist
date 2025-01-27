import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [band, setBand] = useState("");
    const [yearOf, setYearOf] = useState("");
    const [setlists, setSetlists] = useState([]);
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get("access_token");
        if (token) {
            setAccessToken(token);
            window.history.replaceState({}, document.title, "/");
        }
    }, []);

    const handleBandSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://playlist-api-mu.vercel.app/band", {
                band,
                yearOf,
            });
            console.log(response);
            setSetlists(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred.");
        }
    };

    const handleSpotifyLogin = () => {
        window.location.href = "https://playlist-api-mu.vercel.app/login";
    };

    return (
        <div className="p-4">
            <header className="mb-4">
                <h1 className="text-2xl font-bold">Band Setlist Finder</h1>
                <p className="text-gray-600">Search for band setlists by year.</p>
            </header>

            <section className="mb-6">
                {!accessToken ? (
                    <button
                        onClick={handleSpotifyLogin}
                        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
                    >
                        Login with Spotify
                    </button>
                ) : (
                    <p className="text-green-600">You are logged in to Spotify!</p>
                )}
            </section>

            <section>
                <form onSubmit={handleBandSearch} className="mb-4">
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Band Name
                        </label>
                        <input
                            type="text"
                            value={band}
                            onChange={(e) => setBand(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter band name"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Year
                        </label>
                        <input
                            type="number"
                            value={yearOf}
                            onChange={(e) => setYearOf(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter year"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                    >
                        Search Setlists
                    </button>
                </form>

                {error && <p className="text-red-500">{error}</p>}

                {setlists.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Setlists</h2>
                        <ul className="list-disc pl-5">
                            {setlists.map((setlist, index) => (

                                <li key={index}>
                                    <strong>{setlist.eventDate}</strong>: {setlist.venue?.name}, {setlist.venue?.city?.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
}

export default App;
