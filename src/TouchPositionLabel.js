import React, {useEffect, useRef} from 'react';

export default (props) => {
    const {
        touchPosition: {
            x = 0,
            y = 0,
        } = {},
        isPositionOutside = true,
        isActive = false
    } = props;

    const canvasRef = useRef(undefined);

    useEffect(() => {
        if(canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(window.innerWidth, y);
            ctx.stroke();
        }
    }, [y]);

    return (
        <div className="sonification-image">
            <canvas ref={canvasRef} id="mycanvas" width={window.innerWidth} height={window.innerHeight}/>
        </div>
    );
}