import React, {useEffect} from 'react';
import * as Tone from 'tone'

export default (props) => {
    Tone.start();

    const player = props.player
    const y = props.touchPosition.y;


    const incrementUnit = 60/window.innerHeight;
    console.log(incrementUnit)

    useEffect(()=>{
        const duration = 60; //in seconds
        const start = duration * (y/window.innerHeight);

        player.stop("+0")
        player.start("+0", start, incrementUnit);
        player.fadeIn=incrementUnit/2;
        player.fadeOut=incrementUnit/2;
    },[y]);

    useEffect(()=>{
        if(props.isPositionOutside) {
            player.stop("+0")
        }
    },[props.isPositionOutside]);

    return (
        <div></div>
    );
}