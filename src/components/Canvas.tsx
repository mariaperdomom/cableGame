import { useState, useEffect } from 'react';
import classes from './Connector.module.css';

const Canvas = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setCanvas(canvas);
    setCtx(ctx);
  }, []);

  const drawLine = () => {
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(100, 100);
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'red';
      ctx.stroke();
    }
  };

  return (
    <div>
        <canvas 
            id="myCanvas" 
            width="200" 
            height="200" 
            className={classes.connector}
        />
      <button onClick={drawLine}>Dibujar línea</button>
    </div>
  );
};

export default Canvas;