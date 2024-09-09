import React from 'react';
import classes from './Connector.module.css';
import { Box, Group, Image } from '@mantine/core';

interface ConnectorProps {
  connector: {
    id: number;
    color: string;
  };
  onConnect: (originId: number, destinationId: number) => void;
  isConnected: boolean  ;
  showColor?: boolean;
  type: 'origin' | 'destination';
}

interface Point {
  x: number;
  y: number;
}

const Connector: React.FC<ConnectorProps> = ({ connector, onConnect, isConnected, type, showColor }) => {
  var canvas : any = document.getElementById("mycanvas");
  if(canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    if(ctx) return ctx;
  }
  let points : Point[] = [];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'origin') {
      e.dataTransfer.setData('originId', connector.id.toString());
      points = [];
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const originId = Number(e.dataTransfer.getData('originId'));
    const x: number = e.clientX;
    const y: number = e.clientY;

    if (type === 'destination' && !isConnected && originId) {
      onConnect(originId, connector.id);
      points.push({x, y});
      drawCable();
    }
  };

  const drawCable = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for(let i=1; i< points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    /* ctx.closePath(); */
    ctx.stroke();
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'destination' && !isConnected) {
      e.preventDefault();
    }
  };

  return (
    <>
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
      <canvas id="myCanvas" width="0" height="0" /* style={{border: '1px solid #d3d3d3'}} */></canvas>
    </>
  );
};

export default Connector;