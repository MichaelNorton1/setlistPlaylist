import React, {useEffect, useState} from 'react'
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

    useEffect(() => {
        setAccessToken(sessionStorage.getItem("accessToken"))

        console.log("access",accessToken,sessionStorage.getItem("accessToken"))
    }, []);


    const [options, setOptions] = useState([])

    function updateOptions(event, value, reason) {
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
                noOptionsText="Search for Artists "
                onInputChange={updateOptions}
                filterOptions={(options, state) => options}
                getOptionSelected={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} label="Pick an Artist" variant="outlined"/>}
                onChange={handleSelectionChange}
                groupBy={(option) => option.type}
            />
        </div>
    )
}

export default SearchBar
