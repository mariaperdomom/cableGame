import React, { useState, useEffect } from 'react';

interface Props {
  showLine: boolean;
  cables: { originId: number; destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string }[];
}

const NewCableGame = (props: Props) => {
  const { showLine, cables } = props;
  const [connections, setConnections] = useState<{ x1: number, y1: number, x2: number, y2: number }[]>([]);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setCanvas(canvas);
    setCtx(ctx);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setConnections([...connections, { x1: x, y1: y, x2: x, y2: y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (connections.length > 0) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const lastCable = connections[connections.length - 1];
      setConnections([...connections.slice(0, -1), { x1: lastCable.x1, y1: lastCable.y1, x2: x, y2: y }]);
    }
  };

  const handleMouseUp = () => {
    if (connections.length > 0) {
      const lastCable = connections[connections.length - 1];
      setConnections([...connections.slice(0, -1), { x1: lastCable.x1, y1: lastCable.y1, x2: lastCable.x2, y2: lastCable.y2 }]);
    }
  };

  useEffect(() => {
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      cables.forEach((cable) => {
        ctx.beginPath();
        ctx.moveTo(cable.x1, cable.y1);
        ctx.lineTo(cable.x2, cable.y2);
        ctx.stroke();
      });
    }
  }, [cables, ctx]);

  return (
    <div>
      <canvas
        id="myCanvas"
        width="300"
        height="250"
        /* style={{backgroundColor: 'red'}} */
       /*  onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp} */
      />
    </div>
  );
};

export default NewCableGame;