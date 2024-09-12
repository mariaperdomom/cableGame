import React, { useState, useEffect } from 'react';

interface Props {
  cables: { originId: number; destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string }[];
  onPositions?: ( x: number, y: number) => void;
  originId: number;
  destineId: number;
  onConnect: (originId: number, destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string) => void;
  color: string;
}

const NewCableGame = (props: Props) => {
  const { cables, onPositions, onConnect, originId, destineId, color } = props;
  const [connections, setConnections] = useState<{ x1: number, y1: number, x2: number, y2: number }[]>([]);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [positions, setPositions] = useState<{x1: number, y1: number, x2: number, y2: number}>({x1: 0, y1: 0, x2: 0, y2: 0});

  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setCanvas(canvas);
    setCtx(ctx);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if(onPositions) onPositions(x, y)
    setPositions({...positions, x1: x, y1: y, x2: x, y2: y})
    setConnections([...connections, { x1: x, y1: y, x2: x, y2: y }]);
    console.log(connections, 'down');
    
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (connections.length > 0) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      setPositions({...positions, x1: positions.x1, y1: positions.y1, x2: x, y2: y})
      const lastCable = connections[connections.length - 1];
      setConnections([...connections.slice(0, -1), { x1: lastCable.x1, y1: lastCable.y1, x2: x, y2: y }]);
    }
  };

  const handleMouseUp = () => {
    if (connections.length > 0) {
      /* console.log(originId, destineId, positions.x1, positions.y1, positions.x2, positions.y2, color);
      
      onConnect(originId, destineId, positions.x1, positions.y1, positions.x2, positions.y2, color); */
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
        ctx.lineWidth = 15;
        /* ctx.strokeStyle = cable.color; */
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default NewCableGame;