import { Box, Group, Stack, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';

interface Connector {
  id: number;
  color: string;
  x: number;
  y: number;
}

interface Cable {
  originId: number;
  destinationId: number;
  x: number;
  y: number;
}

const XCableGame: React.FC = () => {
    const [connectors] = useState<Connector[]>([
        { id: 1, color: 'red', x: 10, y: 10},
        { id: 2, color: 'blue', x: 20, y: 20},
        { id: 3, color: 'green', x: 30, y: 30},
        { id: 4, color: 'yellow', x: 40, y: 40},
    ]);

    const [cables, setCables] = useState<Cable[]>([]);
    const [drawing, setDrawing] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [originId, setOriginId] = useState<number>(0);
    const [destinationId, setDestinationId] = useState<number>(0);
    const [originConnectors] = useState<Connector[]>(([...connectors]));
    const [destinationConnectors] = useState<Connector[]>(([...connectors]));
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        setCanvas(canvas);
        setCtx(ctx);
    }, [])

    const isConnected = (originId: number, destinationId: number) => {
        return cables.find((cable) => cable.originId === originId && cable.destinationId === destinationId);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, connector: Connector) => {
        if (!drawing && !dragging) {
        setOriginId(connector.id);
        setDrawing(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (drawing) {
            console.log('entro?')
            if (originId !== null && destinationId !== null) {
                if (!isConnected(originId, destinationId)) {
                const newCable: Cable = {
                    originId,
                    destinationId,
                    x: e.clientX,
                    y: e.clientY,
                };
                setCables([...cables, newCable]);
                console.log(ctx)
                if (ctx) {
                    console.log('llegue aqui')
                    ctx.clearRect(0, 0, canvas!.width, canvas!.height);
                    ctx.beginPath();
                    ctx.moveTo(
                    originConnectors.find((connector) => connector.id === originId)!.x,
                    originConnectors.find((connector) => connector.id === originId)!.y
                    );
                    ctx.lineTo(
                    destinationConnectors.find((connector) => connector.id === destinationId)!.x,
                    destinationConnectors.find((connector) => connector.id === destinationId)!.y
                    );
                    ctx.lineWidth = 20;
                    ctx.stroke();
                    ctx.closePath();
                }
                }
            }
        }
      };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>, connector: Connector) => {
        if (drawing) {
        setDestinationId(connector.id);
        setDrawing(false);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLCanvasElement>, connector: Connector) => {
        if (!drawing && !dragging) {
        setOriginId(connector.id);
        setDragging(true);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLCanvasElement>, connector: Connector) => {
        if (dragging) {
        setDestinationId(connector.id);
        setDragging(false);
        }
    };

    return (
        <div>
            <canvas
                id='myCanvas'
                width="450"
                height="300"
                style={{/* backgroundColor: 'red',  */position: 'absolute'}}
                onMouseDown={(e) => {
                const connector = connectors.find((connector) => connector.x === e.clientX && connector.y === e.clientY);
                if (connector) {
                    handleMouseDown(e, connector);
                }
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={(e) => {
                const connector = connectors.find((connector) => connector.x === e.clientX && connector.y === e.clientY);
                if (connector) {
                    handleMouseUp(e, connector);
                }
                }}
                onDragStart={(e) => {
                const connector = connectors.find((connector) => connector.x === e.clientX && connector.y === e.clientY);
                if (connector) {
                    handleDragStart(e, connector);
                }
                }}
                onDrop={(e) => {
                const connector = connectors.find((connector) => connector.x === e.clientX && connector.y === e.clientY);
                if (connector) {
                    handleDrop(e, connector);
                }
                }}
            />
        <Group justify='space-between' gap={'xl'}>
            <Stack>
                <Text fz={'h4'} ta={'center'} fw={'bold'}>Orígen</Text>
                {originConnectors.map((connector) => (
                    <div
                        key={connector.id}
                        style={{
                        position: 'relative',
                        /* top: 0,
                        left: 0, */
                        width: 140,
                        height: 20,
                        backgroundColor: connector.color,
                        }}
                        onClick={() => setOriginId(connector.id)}
                    >
                        Origen {connector.id}
                    </div>
                ))}
            </Stack>
            
            <Stack>
                <Text fz={'h4'} ta={'center'} fw={'bold'}>Destino</Text>
                {destinationConnectors.map((connector) => (
                    <div
                        key={connector.id}
                        style={{
                        position: 'relative',
                        /* top: 0,
                        left: 100, */
                        width: 150,
                        height: 20,
                        backgroundColor: connector.color,
                        }}
                        onClick={() => setOriginId(connector.id)}
                    >
                        Destino {connector.id}
                    </div>
                ))}
                </Stack>
            </Group>
        </div>
    );
};

export default XCableGame;