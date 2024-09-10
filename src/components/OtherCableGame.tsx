import React, { useState, useEffect } from 'react';

const CableGame = () => {
  const initialConnectors = [
    { id: 1, color: 'red' },
    { id: 2, color: 'blue' },
    { id: 3, color: 'green' },
    { id: 4, color: 'yellow' },
  ];
  const [connectors, setConnectors] = useState(initialConnectors);
  const [connections, setConnections] = useState<{ connector1: number, connector2: number }[]>([]);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setCanvas(canvas);
    setCtx(ctx);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const connectorIndex = connectors.findIndex((connector) => {
      const distance = Math.sqrt((x - 100) ** 2 + (y - connector.id * 50) ** 2);
      return distance < 20;
    });
    if (connectorIndex !== -1) {
      setConnections([...connections, { connector1: connectorIndex, connector2: -1 }]);
      setDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const connectorIndex = connectors.findIndex((connector) => {
        const distance = Math.sqrt((x - 100) ** 2 + (y - connector.id * 50) ** 2);
        return distance < 20;
      });
      if (connectorIndex !== -1) {
        setConnections([...connections.slice(0, -1), { connector1: connections[connections.length - 1].connector1, connector2: connectorIndex }]);
      }
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  useEffect(() => {
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      connectors.forEach((connector, index) => {
        ctx.beginPath();
        ctx.rect(90, connector.id * 50 - 20, 20, 20);
        ctx.fillStyle = connector.color;
        ctx.fill();
      });
      connections.forEach((connection) => {
        ctx.beginPath();
        ctx.moveTo(110, connectors[connection.connector1].id * 50);
        ctx.lineTo(110, connectors[connection.connector2].id * 50);
        ctx.stroke();
      });
    }
  }, [connectors, connections, ctx]);

  return (
    <div>
      <canvas
        id="myCanvas"
        width="800"
        height="600"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default CableGame;