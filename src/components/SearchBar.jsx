import React, {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


/*
 * Search.js is responsible for the dynamic search bar
 */
function SearchBar({setBand}) {
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem("accessToken"));
    const [options, setOptions] = useState([])

    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    }


    useEffect(() => {
        setAccessToken(sessionStorage.getItem("accessToken"))


    }, []);




    function updateOptions(event, value, reason) {

        setAccessToken(sessionStorage.getItem("accessToken"))
        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
        if (value && value !== '') {
            fetch(`https://api.spotify.com/v1/search?q=${value.split(' ').join('%20')}&type=artist&limit=5`, { headers })
                .then(response => response.json())
                .then(
                    (result) => {



                        const artists = result.artists.items.map(artist => ({
                            type: 'Artists',
                            artists: artist.name,
                            img: (artist.images.length ? artist.images.slice(-1)[0].url : null),
                            id: artist.id
                        }))

                        setOptions([...artists])
                        console.log(artists, options)
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
            setBand(value.artists)

            // Example: You can set selected track/artist as a seed for playlist generation or other logic
        }
    }

    return (
        <div className="SearchBar">
            <Autocomplete
                options={options}
                getOptionLabel={(option) => `${option.name ? `${option.name} - ` : ''}${option.artists}`}
                renderOption={(props, option) => (
                    <li {...props}>
                        {option.img && <img src={option.img} width={32} height={32} alt="album artwork" />}
                        &nbsp;
                        {option.name && <span>{option.name} -&nbsp;</span>}
                        {option.artists}
                        &nbsp;
                        {option.explicit && <span style={{ fontSize: '.75em', fontWeight: 'bold', color: 'red' }}>E</span>}
                    </li>
                )}
                autoHighlight
                autoSelect
                noOptionsText="Search for Artists"
                onInputChange={updateOptions}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} label="Pick an Artist" variant="outlined" />}
                onChange={handleSelectionChange}
                groupBy={(option) => option.type}
            />

        </div>
    )
}

export default SearchBar
