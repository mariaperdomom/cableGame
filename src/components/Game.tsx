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
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const positionRef = useRef<{x1: number, y1: number, x2: number, y2: number}>();
    const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);
    const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);

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
        setCables([...cables, { originId, destinationId, x1, y1, x2, y2, color }]);
        if(originId !== destinationId) {
            setCables(cables.filter((cable, index) => index === cables.length - 1))
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

    const handleMouseMove = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (canvas && ctx && initialPosition && isInitialPositionSet) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const rect = canvas.getBoundingClientRect();
            const x = e.nativeEvent.clientX - rect.left;
            const y = e.nativeEvent.clientY - rect.top;
            ctx.beginPath();
            ctx.moveTo(initialPosition.x, initialPosition.y);
            ctx.lineTo(x, y);
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        }
    };
      
    const handleCanvasClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (canvas && ctx) {
            setIsInitialPositionSet(!isInitialPositionSet);
            const rect = canvas.getBoundingClientRect();
            const x = e.nativeEvent.clientX - rect.left;
            const y = e.nativeEvent.clientY - rect.top;
            setInitialPosition({ x, y });
        }
    };

    const origin = (e: React.MouseEvent<HTMLDivElement>, originId: number) => {
        const x = e.nativeEvent.clientX;
        const y = e.nativeEvent.clientY;
        if(canvas && ctx) {
            const rect = canvas!.getBoundingClientRect();
            const canvasX = x - rect.left;
            const canvasY = y - rect.top;
            positionRef.current = { ...positionRef.current, x1: canvasX, y1: canvasY, x2: canvasX, y2: canvasY };
            handleCanvasClick(e);
            setOriginId(originId);
        }
    }

    const destination = (e: React.MouseEvent<HTMLDivElement>, destineId: number, color: string) => {
        const x = e.nativeEvent.clientX;
        const y = e.nativeEvent.clientY;
        if(canvas && ctx) {
            const rect = canvas!.getBoundingClientRect();
            const canvasX = x - rect.left;
            const canvasY = y - rect.top;
            const lastPosition = positionRef.current;
            if (lastPosition) {
                positionRef.current = { ...positionRef.current, x1: lastPosition.x1, y1: lastPosition.y1, x2: canvasX, y2: canvasY };
                handleCanvasClick(e);
                handleConnect(originId, destineId, lastPosition.x1, lastPosition.y1, canvasX, canvasY, color);
            }
        }
    }
    
    useEffect(() => {
        if (ctx) {
            ctx.clearRect(0, 0, canvas!.width, canvas!.height);
            cables.forEach((cable) => {
            ctx.beginPath();
            ctx.moveTo(cable.x1, cable.y1);
            ctx.lineTo(cable.x2, cable.y2);
            ctx.lineWidth = 5;
            ctx.strokeStyle = cable.color;
            ctx.stroke();
            });
        }
    }, [cables, ctx]);

    return (
        <Group justify='space-between' gap={0} /* w={'35vw'} */>
            <Stack mr={-10}>
                <Text fz={'h4'} ta={'center'} fw={'bold'}>Orígen</Text>
                {originConnectors.map((connector) => (
                    <div key={connector.id}>
                        <Box
                            className={classes.connector}
                            style={{
                                width: '140px',
                                height: '20px',
                                backgroundColor: showColor ? connector.color : ( !isConnected(connector.id) ? 'black' : connector.color),
                                borderRadius: '3px',
                                margin: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid black',
                                cursor: isConnected(connector.id) ? 'not-allowed' : 'pointer',
                                /* zIndex: 1000 */
                            }}
                            onClick={(e) => origin(e, connector.id)}
                        />
                    </div>
                ))}
            </Stack>
            <canvas 
                id="canvasGame"
                width='250'
                height='250'
                style={{/* backgroundColor: 'pink', */ zIndex: 10}}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
            />
            <Stack ml={-10}>
                <Text fz={'h4'} ta={'center'} fw={'bold'}>Destino</Text>
                {destinationConnectors.map((connector) => (
                <div key={connector.id}>
                    <Box 
                        className={classes.connector}
                        style={{
                            width: '140px',
                            height: '20px',
                            backgroundColor: showColor ? connector.color  : ( !isConnected(connector.id) ? 'black' : connector.color),
                            borderRadius: '3px',
                            margin: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid black',
                            cursor: isConnected(connector.id) ? 'not-allowed' : 'pointer',
                            /* zIndex: 1000 */
                        }}
                        onClick={(e) => destination(e, connector.id, connector.color)}
                    />
                </div>
                ))}
            </Stack>
        </Group>
    )
}

export default Game