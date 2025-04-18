import React, {useState, useEffect} from "react";
import axios from "axios";
import AddToPlaylist from "./components/AddToPlaylist.jsx";
import Spinner from "react-bootstrap/Spinner";
import logErrorToServer from "./logErrorToServer.js";
import SearchBar from "./components/SearchBar.jsx";

function App() {
    const [band, setBand] = useState("");
    const [yearOf, setYearOf] = useState("");
    const [setlists, setSetlists] = useState([]);
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(false);
    let date = new Date();


    // decide on state managment to make more components
    // local storage?
    // add and delete from songs to send to spotity

    useEffect(() => {


// Example usage: Call this function when an error occurs

        setYearOf(2024)
        const query = new URLSearchParams(window.location.search);
        const token = query.get("access_token");
        if (token) {
            setAccessToken(token);
            sessionStorage.setItem("accessToken", token);

            window.history.replaceState({}, document.title, "/");
        }

    }, []);

    const handleBandSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("https://playlist-api-mu.vercel.app/band", {
                band,
                yearOf,
            });
            const transformedData = response.data.map((item) => ({
                setlist: item,
                set: item?.sets, // assuming sets is part of the item
            }));
            setSetlists(transformedData)

            setLoading(false);
            setError(null);
        } catch (err) {
            console.log(err);
            setLoading(false);
            setError(err.response?.data?.error || "An error occurred.");
            await logErrorToServer(JSON.stringify(err));
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
                {!sessionStorage.getItem("accessToken") && !accessToken ? (
                    <button
                        onClick={handleSpotifyLogin}
                        className=""
                    >
                        Login with Spotify
                    </button>
                ) : (
                    <p className="text-green-600">You are logged in to Spotify!</p>
                )}
                {setlists.length > 0 && (<div>
                    <button onClick={() => {
                        setSetlists([])
                    }}>back to search
                    </button>
                </div>)}
            </section>


            <section>
                {setlists.length === 0&& (
                    <form onSubmit={handleBandSearch} className="mb-4">
                    <div className="mb-2">


                        <SearchBar setBand={setBand}></SearchBar>

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
                            placeholder={date.getFullYear()}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                    >
                        {loading ? <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                        /> : "Search Setlists"}
                    </button>
                </form>) }

                {error && <p className="text-red-500">{error}</p>}

                {setlists.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Setlists</h2>
                        <ul className="list-disc pl-5">

                            {setlists.map((setlist, index) => (


                                setlist.set && setlist.set.set[0]?.song.length > 0 ? (<>


                                    <li key={index}>
                                        <h3>
                                            <strong>{setlist.setlist.eventDate}</strong>: {setlist.setlist.venue?.name}, {setlist.setlist.venue?.city?.name}
                                        </h3>
                                        <AddToPlaylist
                                            playlistArr={setlist.set.set} band={band}/>
                                        <div>
                                            {setlist.set.set.map((item, index) => (

                                                <div key={index} style={{marginBottom: "20px"}}>
                                                    {item.name && <h2>{item.name}</h2>}
                                                    <ul>
                                                        {item.song.map((song, i) => (
                                                            <li key={i}>
                                                                <strong>{song.name || "Unnamed Song"}</strong>


                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>


                                    </li>
                                    <br/></>) : null
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
}

export default App;
