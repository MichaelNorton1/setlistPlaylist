import React, {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useSetlist } from '../contexts/SetlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../composables/useApi.js';


/*
 * Search.js is responsible for the dynamic search bar
 */
function SearchBar() {
    const { updateBand } = useSetlist();
    const { accessToken, handleSpotifyLogin } = useAuth();
    const { spotify } = useApi();
    const [options, setOptions] = useState([])
    const [authError, setAuthError] = useState(false)


    useEffect(() => {
        // Clear options and auth error when access token changes
        if (!accessToken) {
            setOptions([]);
            setAuthError(false);
        }
    }, [accessToken]);




    function updateOptions(event, value, reason) {
        if (value && value !== '' && accessToken) {
            setAuthError(false);
            spotify.searchArtists(value, accessToken)
                .then(result => {
                    const artists = result.artists.items.map(artist => ({
                        type: 'Artists',
                        artists: artist.name,
                        img: (artist.images.length ? artist.images.slice(-1)[0].url : null),
                        id: artist.id
                    }))
                    setOptions([...artists])
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (error.response?.status === 401) {
                        setAuthError(true);
                    }
                });
        } else if (!accessToken) {
            console.warn('No access token available for Spotify search');
        }
    }

    const handleSelectionChange = (event, value) => {
        console.log(value)
        if (value) {
            updateBand(value.artists)
        }
    }

    return (
        <div className="SearchBar">
            {!accessToken && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    Please login with Spotify to search for artists
                </div>
            )}
            {authError && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    Your session has expired. 
                    <button 
                        onClick={handleSpotifyLogin} 
                        style={{ 
                            marginLeft: '10px', 
                            background: 'none', 
                            border: '1px solid red', 
                            color: 'red', 
                            padding: '2px 8px', 
                            cursor: 'pointer' 
                        }}
                    >
                        Re-authenticate
                    </button>
                </div>
            )}
            <Autocomplete
                options={options}
                getOptionLabel={(option) => `${option.name ? `${option.name} - ` : ''}${option.artists}`}
                renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                        <li key={key} {...otherProps}>
                            {option.img && <img src={option.img} width={32} height={32} alt="album artwork" />}
                            &nbsp;
                            {option.name && <span>{option.name} -&nbsp;</span>}
                            {option.artists}
                            &nbsp;
                            {option.explicit && <span style={{ fontSize: '.75em', fontWeight: 'bold', color: 'red' }}>E</span>}
                        </li>
                    );
                }}
                autoHighlight
                autoSelect
                noOptionsText={authError ? "Session expired - please re-authenticate" : (accessToken ? "Search for Artists" : "Login required to search")}
                onInputChange={updateOptions}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} label="Pick an Artist" variant="outlined" />}
                onChange={handleSelectionChange}
                groupBy={(option) => option.type}
                disabled={!accessToken || authError}
            />

        </div>
    )
}

export default SearchBar
