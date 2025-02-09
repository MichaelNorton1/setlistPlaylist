import React, { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


/*
 * Search.js is responsible for the dynamic search bar
 */
function SearchBar() {
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem("accessToken"));
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    }

    const [options, setOptions] = useState([])

    function updateOptions(event, value, reason) {
        if (value && value !== '') {
            fetch(`https://api.spotify.com/v1/search?q=${value.split(' ').join('%20')}&type=track,artist&limit=5`, { headers })
                .then(response => response.json())
                .then(
                    (result) => {
                        const artists = result.artists.items.map(artist => ({
                            type: 'Artists',
                            artists: artist.name,
                            img: (artist.images.length ? artist.images.slice(-1)[0].url : null),
                            id: artist.id
                        }))
                        const tracks = result.tracks.items.map(track => ({
                            type: 'Tracks',
                            name: track.name,
                            artists: track.artists.map(artist => artist.name).join(', '),
                            img: (track.album.images.length ? track.album.images.slice(-1)[0].url : null),
                            explicit: track.explicit,
                            id: track.id
                        }))
                        setOptions([...tracks, ...artists])
                    }
                )
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    const handleSelectionChange = (event, value) => {
        console.log(value)
        // Process selected track/artist for your use case here
        if (value) {
            // Example: You can set selected track/artist as a seed for playlist generation or other logic
        }
    }

    return (
        <div className="SearchBar">
            <Autocomplete
                options={options}
                getOptionLabel={(option) => `${option.name ? `${option.name} - ` : ''}${option.artists}` }
                renderOption={(option) => (
                    <React.Fragment>
                        {option.img && <img src={option.img} width={32} height={32} alt="album artwork"></img>}
                        &nbsp;
                        {option.name && <span>{option.name} -&nbsp;</span>}
                        {option.artists}
                        &nbsp;
                        {option.explicit && <span style={{fontSize: '.75em', fontWeight: 'bold', color: 'red'}}>E</span>}
                    </React.Fragment>
                )}
                autoHighlight
                autoSelect
                noOptionsText="Search for Artists or Tracks..."
                onInputChange={updateOptions}
                filterOptions={(options, state) => options}
                getOptionSelected={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} label="Pick a seed Song or Artist" variant="outlined"/>}
                onChange={handleSelectionChange}
                groupBy={(option) => option.type}
            />
        </div>
    )
}

export default SearchBar
