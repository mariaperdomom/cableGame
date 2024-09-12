import { Box, Group, Stack, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react'
import classes from './Connector.module.css';

interface ConnectorData {
    id: number;
    color: string;
}

const Game = () => {
    const initialConnectors = [
        { id: 1, color: 'red'},
        { id: 2, color: 'blue'},
        { id: 3, color: 'green'},
        { id: 4, color: 'yellow'},
    ];
    const [showColor,setShowColor] = useState<boolean>(true);
    const [originConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
    const [destinationConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
    const [cables, setCables] = useState<{ originId: number; destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string }[]>([]);
    const [originId, setOriginId] = useState<number>(0);
    const [destineId, setDestineId] = useState<number>(0);
    const [color, setColor] = useState<string>('');
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const positionRef = useRef<{x1: number, y1: number, x2: number, y2: number}>()

    useEffect(() => {
        const canvas = document.getElementById('canvasGame') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        setCanvas(canvas);
        setCtx(ctx);
    }, []);
    
    useEffect(() => {
        setTimeout(() => {
        setShowColor(false);
        },3000)
    }, []);

    // Maneja la conexión de un conector de origen a destino
    const handleConnect = (originId: number, destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string) => {
        if(originId === destinationId) {
        setCables([...cables, { originId, destinationId, x1, y1, x2, y2, color }]);
        }
    };

    // Función para barajar los conectores de destino
    function shuffle(array: ConnectorData[]) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Verifica si un conector ya está conectado
    const isConnected = (connectorId: number) => {
        return cables.find((cable) => cable.originId === connectorId && cable.destinationId === connectorId);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        positionRef.current = ({...positionRef.current, x1: x, y1: y, x2: x, y2: y})
        /* setConnections([...connections, { x1: x, y1: y, x2: x, y2: y }]);
        console.log(connections, 'down'); */
        
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const lastPosition = positionRef.current;
    positionRef.current = ({...positionRef.current, x1: lastPosition!.x1, y1: lastPosition!.y1, x2: x, y2: y})
    };

    const handleMouseUp = () => {
    const lastPosition = positionRef.current;
    handleConnect(originId, destineId, lastPosition!.x1, lastPosition!.y1, lastPosition!.x2,lastPosition!.y2, color)
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
    }, [cables]);

    return (
        <Group justify='space-between' gap={0} /* w={'35vw'} */>
            <Stack mr={-20}>
                <Text fz={'h4'} ta={'center'} fw={'bold'}>Orígen</Text>
                {originConnectors.map((connector) => (
                    <div key={connector.id}>
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
                                cursor: isConnected! ? 'not-allowed' : 'pointer',
                                /* zIndex: 1000 */
                            }}
                            onClick={() => {
                                setOriginId(connector.id);
                                setColor(connector.color);
                            }}
                        />
                    </div>
                ))}
            </Stack>
            <canvas 
                id="canvasGame"
                width='250'
                height='250'
                style={{backgroundColor: 'pink', zIndex: 10}}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
            <Stack ml={-20}>
                <Text fz={'h4'} ta={'center'} fw={'bold'}>Destino</Text>
                {destinationConnectors.map((connector) => (
                <div key={connector.id}>
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
                            cursor: isConnected! ? 'not-allowed' : 'pointer',
                            /* zIndex: 1000 */
                        }}
                        onClick={() => {
                            setDestineId(connector.id);
                        }}
                    />
                </div>
                ))}
            </Stack>
        </Group>
    )
}

export default Game