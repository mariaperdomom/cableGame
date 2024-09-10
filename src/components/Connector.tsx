import React, { useEffect, useState } from 'react';
import classes from './Connector.module.css';
import { /* Box, */ Box, Group, Image } from '@mantine/core';

interface ConnectorProps {
  connector: {
    id: number;
    color: string;
  };
  onConnect: (originId: number, destinationId: number, x: number, y: number) => void;
  isConnected: boolean ;
  showColor?: boolean;
  type: 'origin' | 'destination';
  cables: { originId: number; destinationId: number, x: number, y: number }[];
}

const Connector: React.FC<ConnectorProps> = ({ connector, onConnect, isConnected, type, showColor/* , cables */ }) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [cableCoordinates, setCableCoordinates] = useState<{ x1: number, y1: number, x2: number, y2: number }>({ x1: 0, y1: 0, x2: 0, y2: 0 });
  
  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setCanvas(canvas);
    setCtx(ctx);
  }, [])


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'origin') {
      e.dataTransfer.setData('originId', connector.id.toString());
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const originId = Number(e.dataTransfer.getData('originId'));
    console.log(e, 'hola')
    const x: number = e.clientX;
    const y: number = e.clientY;

    if (type === 'destination' && !isConnected && originId) {
      onConnect(originId, connector.id, x, y);
      setCableCoordinates({ x1: x, y1: y, x2: 100, y2: 100 });
      drawCable();
    }
  };

  const drawCable = () => {
    if(ctx) {
      console.log(cableCoordinates)
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.beginPath();
      ctx.moveTo(cableCoordinates!.x1, cableCoordinates!.y1);
      ctx.lineTo(cableCoordinates!.x2, cableCoordinates!.y2);
      ctx.lineWidth = 20
      ctx.strokeStyle = connector.color;
      ctx.stroke();
      /* ctx.closePath(); */
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'destination' && !isConnected) {
      e.preventDefault();
    }
  };

  return (
    <>
      <canvas 
        id="myCanvas"
        width='400px'
        height='200px'
        style={{position:'absolute'}}
      />
      <Group gap={0} align='center' justify='center'>
        { type === 'destination' &&
          <Image 
            src={'../assets/cableD.jpg'} 
            h={'14px'} 
            w={'50px'}
            style={{
              position: 'relative',
              left: '30px'
            }}
          />
        }
        <Box 
          className={classes.connector}
          style={{
            width: '140px',
            height: '20px',
            backgroundColor: showColor ? connector.color  : ( !isConnected ? 'gray' : connector.color),
            borderRadius: '3px',
            margin: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid black',
            cursor: isConnected ? 'not-allowed' : 'pointer',
            zIndex: 1000
          }}
          draggable={type === 'origin' && !isConnected}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
        
        { type === 'origin' &&
          <Image 
            src={'../assets/cableD.jpg'} 
            h={'14px'} 
            w={'50px'}
            style={{
              position: 'relative',
              right: '30px'
            }}
          />
        }
      </Group>
    </>
  );
};

export default Connector;