import React from "react";
import { Player } from "./Player/Player.tsx";

function App() {
    return (
        <div className="Player">
            <Player
                audio_url="/assets/audio/6am_in_budapest.mp3"
                image_url="https://i1.sndcdn.com/artworks-g1mTPzW280bSzmyH-zCssMg-t500x500.jpg"
                name="6AM in Budapest"
                artists="OG Buda"
            />
        </div>
    );
}

export default App;
