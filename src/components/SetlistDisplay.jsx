import React from 'react';
import { useSetlist } from '../contexts/SetlistContext';
import AddToPlaylist from './AddToPlaylist.jsx';
import {useGlobalSetlist} from "../contexts/GlobalSetlist.jsx";

const SetlistDisplay = () => {
  const { setlists, band } = useSetlist();
    const [globalPlaylist, setGlobalPlaylist] = useGlobalSetlist();

  if (setlists.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Setlists</h2>
      <ul className="list-disc pl-5">
        {setlists.map((setlist, index) => (
          setlist.set && setlist.set.set[0]?.song.length > 0 ? (
            <div key={index}>
              <li>
                <h3>
                  <strong>{setlist.setlist.eventDate}</strong>: {setlist.setlist.venue?.name}, {setlist.setlist.venue?.city?.name}
                </h3>
                <AddToPlaylist
                  playlistArr={setlist.set.set}
                  band={band}
                />
                  {globalPlaylist.map((item, index) => (
                      <div key={index}>{item.name}</div>  // ← whatever your object keys are
                  ))}
                  {/*<button onClick={()=>{


                      const songs = setlist.set.set.flatMap((item) =>
                          item.song
                              .map((song) => ({ name: song.name, band: band }))
                              .filter((obj) => obj.name)
                      );
                          console.log(songs);

                      setGlobalPlaylist((prevState) => [setlist.set.set,...prevState])
                      console.log(globalPlaylist);

                  }}>add to global playlist</button>*/}
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
              <br />
            </div>
          ) : null
        ))}
      </ul>
    </div>
  );
};

export default SetlistDisplay;
