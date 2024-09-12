import React, { useEffect, useRef, useState } from 'react';
import classes from './Connector.module.css';
import { Box, Group } from '@mantine/core';

interface ConnectorProps {
  connector: {
    id: number;
    color: string;
  };
  onConnect: (originId: number, destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string) => void;
  isConnected: boolean ;
  showColor?: boolean;
  type: 'origin' | 'destination';
  cables: { originId: number; destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string }[];
}

const Connector: React.FC<ConnectorProps> = ({ connector, onConnect, isConnected, type, showColor, cables }) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [originId, setOriginId] = useState<number>(connector.id);
  const [originPosition, setOriginPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const originPositionRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  /* 
  const [destinationPosition, setDestinationPosition] = useState<{ x: Number, y: Number}>(); */
  
  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setCanvas(canvas);
    setCtx(ctx);
  }, [])


  /* const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if (type === 'origin') {
      e.dataTransfer.setData('originId', connector.id.toString());
    }
  }; */

  /* useEffect(() => {
    if(isConnected) {
      drawCable();
    }
  }, [isConnected]); */

  /* const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const originId = Number(e.dataTransfer.getData('originId'));
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if (type === 'destination' && !isConnected && originId) {
        onConnect(originId, connector.id, x, y, x, y, connector.color);
    }

  }; */

  /* const drawCable = () => {
    if(ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      for(let i=0; i< cables.length; i++) {
        ctx.beginPath();
        ctx.moveTo(cables[i].x1, cables[i].y1);
        ctx.lineTo(cables[i].x2, cables[i].y2);
        ctx.lineWidth = 15;
        ctx.strokeStyle = cables[i].color;
        ctx.stroke();
      }
    }
  } */

  /* const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'destination' && !isConnected) {
      e.preventDefault();
    }
  }; */

  /* useEffect(() => {
    actions
  }, [originPosition]) */

  const handleOrigin = (x: number, y: number) => {
    setOriginId(connector.id);
    /* if(x > 0 && y > 0)  */
    setOriginPosition({...originPosition, x, y});
  }

  const handleDestination = (x: number, y: number) => {
    const destination = connector.id;
    console.log(originId, destination, originPosition.x, originPosition.y, x, y, connector.color);
    
    onConnect(originId, destination, originPosition.x, originPosition.y, x, y, connector.color);
  }

  return (
    <>
      <Group gap={0} align='center' justify='center'>
        {/* { type === 'destination' &&
          <Image 
            src={'../assets/cableD.jpg'} 
            h={'14px'} 
            w={'50px'}
            style={{
              position: 'relative',
              left: '30px'
            }}
          />
        } */}
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
            border: '1px solid black',
            cursor: isConnected ? 'not-allowed' : 'pointer',
            zIndex: 1000
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => 
            {
              if(type === 'origin') {
                handleOrigin(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                console.log('in', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                
                /* originPositionRef.current = ({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
                setOriginPosition({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
                console.log(originPositionRef.current.x, originPositionRef.current.y); */
              } 
              if(type === 'destination') {
                handleDestination(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                console.log('out', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                
              }
              /* if (type === 'destination' && !isConnected && originId) {
                  const x = e.nativeEvent.offsetX;
                  const y = e.nativeEvent.offsetY;
                  const destination = connector.id;
                  console.log(destination, 'entro');
                  console.log(originId, destination, originPositionRef.current.x, originPositionRef.current.y, x, y, connector.color);
                  
                  
                  onConnect(originId, destination, originPositionRef.current.x, originPositionRef.current.y, x, y, connector.color);
              } */
            }}
          /* draggable={type === 'origin' && !isConnected}
          onDragStart={(e)=> {handleDragStart(e);}}
          onDrop={handleDrop}
          onDragOver={handleDragOver} */
        />
        
        {/* { type === 'origin' &&
          <Image 
            src={'../assets/cableD.jpg'} 
            h={'14px'} 
            w={'50px'}
            style={{
              position: 'relative',
              right: '30px'
            }}
          />
        } */}
      </Group>
    </>
  );
};

export default Connector;