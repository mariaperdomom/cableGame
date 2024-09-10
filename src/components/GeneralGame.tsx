import React, { useState, useEffect } from 'react';

interface Connector {
  id: number;
  color: string;
  x: number;
  y: number;
}

interface Cable {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const GeneralGame = () => {
  const [originConnectors] = useState<Connector[]>([
    { id: 1, color: 'red', x: 10, y: 10 },
    { id: 2, color: 'blue', x: 20, y: 20 },
  ]);

  const [destinationConnectors] = useState<Connector[]>([
    { id: 3, color: 'green', x: 30, y: 30 },
    { id: 4, color: 'yellow', x: 40, y: 40 },
  ]);

  const [cables, setCables] = useState<Cable[]>([]);
  const [connection, setConnection] = useState<{ originId: number; destinationId: number | null} | null>(null);
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
    const originConnector = originConnectors.find((connector) => connector.x === x && connector.y === y);
    if (originConnector) {
      setConnection({ originId: originConnector.id, destinationId: null });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (connection && connection.originId !== null && connection.destinationId !== null) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      setCables([...cables, { x1: connection.originId, y1: connection.originId, x2: x, y2: y }]);
    }
  };

  const handleMouseUp = () => {
    if (connection && connection.originId !== null && connection.destinationId !== null) {
        console.log(connection)
      const destinationConnector = destinationConnectors.find((connector) => connector.x === connection.x2 && connector.y === connection.y2);
      if (destinationConnector) {
        setConnection({ originId: connection.originId, destinationId: destinationConnector.id });
      } else {
        setConnection(null);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const originConnector = originConnectors.find((connector) => connector.x === x && connector.y === y);
    if (originConnector) {
      setConnection({ originId: originConnector.id, destinationId: null });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
    if (connection && connection.originId !== null && connection.destinationId !== null) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const destinationConnector = destinationConnectors.find((connector) => connector.x === x && connector.y === y);
      if (destinationConnector) {
        setConnection({ originId: connection.originId, destinationId: destinationConnector.id });
      }
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
      originConnectors.forEach((connector) => {
        ctx.beginPath();
        ctx.arc(connector.x, connector.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = connector.color;
        ctx.fill();
      });
      destinationConnectors.forEach((connector) => {
        ctx.beginPath();
        ctx.arc(connector.x, connector.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = connector.color;
        ctx.fill();
      });
    }
  }, [cables, ctx]);

  return (
    <div>
      <canvas
        id="myCanvas"
        width="800"
        height="600"
        style={{ backgroundColor: 'red' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      />
    </div>
  );
};

export default GeneralGame;