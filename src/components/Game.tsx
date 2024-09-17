import { Avatar, Badge, Button, Group, Indicator, Modal, Stack, Text, Title } from '@mantine/core';
import { useEffect, useRef, useState } from 'react'
import classes from './Connector.module.css';
import { useCountDown } from './useCountDown';
import { useDisclosure } from '@mantine/hooks';
import { checkInServiceTs } from './firebaseService';

interface ConnectorData {
    id: number;
    color: string;
}

interface Props {
    setActions: (action: string) => void; 
    userCode: string;
    userName: string;
}

const Game = (props: Props) => {
    const { setActions, userCode, userName } = props;
    const initialConnectors = [
        { id: 1, color: 'red'},
        { id: 2, color: 'blue'},
        { id: 3, color: 'green'},
        { id: 4, color: 'brown'},
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
    const [isInitialPositionSet, setIsInitialPositionSet] = useState<boolean>(false);
    const [points, setPoints] = useState<number>(0);
    const [attempts, setAttempts] = useState<number>(0);
    const [errorAttempts, setErrorAttempts] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const waitTime : number = 3000;
    const [activeCountDown, setActiveCountDown] = useState<boolean>(false);
    const countDownOrigin = useCountDown(3, 'origin');
    const countDownGame = useCountDown(22, 'game');
    const [opened, { close }] = useDisclosure(false);

    //Declaración del canvas para mostrar las líneas de conección
    useEffect(() => {
        const canvas = document.getElementById('canvasGame') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        setCanvas(canvas);
        setCtx(ctx);
    }, []);
    
    //Se declara los 3 segundos en los que el usuario puede ver los colores verdaderos antes de ocultarlos
    useEffect(() => {
        setTimeout(() => {
            setShowColor(false);
            setActiveCountDown(true);
        },waitTime)
    }, []);

    //Muestra las lineas trazadas de los cables ya conectados
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

    //Si no hizo nada y solo se quedo viendo llama a la funcion para abrir el modal
    useEffect(() => {
        if(countDownGame.seconds === 0){
            setGameOver(true);
        }
    },[countDownGame.seconds])

    useEffect(() => {
        if(gameOver){
            const save = async () => {
                try {
                    const saveUserParticipation = await checkInServiceTs.saveUserParticipation({userCode: userCode, points: points + 10})
                    if(saveUserParticipation) {
                        setActions('game')
                    }
                } catch (err) {
                    console.log('error  al guardar');
                }
            }
            save();
        } 
    }, [gameOver])

    // Maneja la conexión de un conector de origen a destino
    const handleConnect = (originId: number, destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string) => {
        setAttempts(attempts + 1);
        if(errorAttempts < 4){
            if(originId === destinationId) {
                setCables([...cables, { originId, destinationId, x1, y1, x2, y2, color }]);
                setPoints(points + 10);
                
                if(cables.length === 3) {
                    setGameOver(true);
                }
            } else {
                setErrorAttempts(errorAttempts + 1);
                setOriginId(0);
            }
        } else {
            setGameOver(true);
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

    //Muestra una linea de conección en el canvas mientras se mueve el mouse
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
      
    //Maneja el control de la posición de los elementos seleccionados para poder obtener las coordenadas
    const handleCanvasClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (canvas && ctx) {
            setIsInitialPositionSet(!isInitialPositionSet);
            const rect = canvas.getBoundingClientRect();
            const x = e.nativeEvent.clientX - rect.left;
            const y = e.nativeEvent.clientY - rect.top;
            setInitialPosition({ x, y });
        }
    };

    //Obtención de la data de origin
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

    //Obtención de la data de destino
    const destination = (e: React.MouseEvent<HTMLDivElement>, destinationId: number, color: string) => {
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
                handleConnect(originId, destinationId, lastPosition.x1, lastPosition.y1, canvasX, canvasY, color);
            }
        }
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, originId: number) => {
        const x = e.nativeEvent.clientX;
        const y = e.nativeEvent.clientY;
        if(canvas && ctx) {
            const rect = canvas!.getBoundingClientRect();
            const canvasX = x - rect.left;
            const canvasY = y - rect.top;
            positionRef.current = { ...positionRef.current, x1: canvasX, y1: canvasY, x2: canvasX, y2: canvasY };
            handleCanvasDrag(e);
            setOriginId(originId);
        }
    }
    
    const handleCanvasDrag = (e: React.DragEvent<Element>) => {
        if (canvas && ctx) {
            setIsInitialPositionSet(!isInitialPositionSet);
            const rect = canvas.getBoundingClientRect();
            const x = e.nativeEvent.clientX - rect.left;
            const y = e.nativeEvent.clientY - rect.top;
            setInitialPosition({ x, y });
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleDragOverCanvas = (e: React.DragEvent<HTMLCanvasElement>) => {
        e.preventDefault();
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
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, destinationId: number, color: string) => {        
        const x = e.nativeEvent.clientX;
        const y = e.nativeEvent.clientY;
        if(canvas && ctx) {
            const rect = canvas!.getBoundingClientRect();
            const canvasX = x - rect.left;
            const canvasY = y - rect.top;
            const lastPosition = positionRef.current;
            if (lastPosition) {
                positionRef.current = { ...positionRef.current, x1: lastPosition.x1, y1: lastPosition.y1, x2: canvasX, y2: canvasY };
                handleCanvasDrag(e);
                handleConnect(originId, destinationId, lastPosition.x1, lastPosition.y1, canvasX, canvasY, color);
            }
        }
    }
    
    return (
        <Stack gap={'xl'} h={'100%'} justify='center' px={0}>
            <Title order={1} onClick={()=> setActions('end')} style={{cursor: 'pointer'}} ta={'center'}>Juego</Title>
            <Group justify='center' align='center' gap={'xl'}>
                <Text size='xl'>Tiempo: {activeCountDown ? countDownGame.seconds : '20' }</Text>
                <Text size='xl'>Puntos: {points}</Text>
                <Text size='xl'>Intentos fallidos: {errorAttempts} / 4</Text>
            </Group>
            {showColor &&
                <Group justify='center'>
                    <Avatar 
                        radius="100" 
                        size="xl" 
                        src={null} 
                        className={classes.pulse}
                        style={{position: 'absolute', top: '55vh'}}
                    >{countDownOrigin.seconds}</Avatar>
                </Group>
            }
            <Group justify='space-between' gap={0} wrap='nowrap'>
                <Stack w={'28vw'}>
                    <Text fz={'h2'} ta={'center'} fw={'bold'}>Orígen</Text>
                    <Stack gap={80}>
                        {originConnectors.map((connector) => (
                            <Badge
                                key={connector.id}
                                className={`${classes.connector} ${originId === connector.id && classes.blurBackground}`}
                                style={{
                                    width: '100%',
                                    height: '40px',
                                    backgroundColor: showColor ? connector.color : ( !isConnected(connector.id) ? originId === connector.id ? 'var(--mantine-color-gray-8)' : 'var(--mantine-color-dark-9)' : connector.color),
                                    borderRadius: '3px',
                                    border: '2px solid black',
                                    cursor: isConnected(connector.id) ? 'not-allowed' : 'pointer',
                                }}
                                onClick={(e) => origin(e, connector.id)}
                                draggable={!isConnected(connector.id)}
                                onDragStart={(e) => handleDragStart(e, connector.id)}
                            />
                        ))}
                    </Stack>
                </Stack>
                <canvas 
                    id="canvasGame"
                    width={window.innerWidth * 0.5}
                    height='480'
                    style={{/* backgroundColor: 'pink', */ zIndex: 10}}
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    onDragOver={handleDragOverCanvas}
                />
                <Stack w={'28vw'}>
                    <Text fz={'h2'} ta={'center'} fw={'bold'}>Destino</Text>
                    <Stack gap={80}>
                        {destinationConnectors.map((connector) => (
                            <Badge 
                                key={connector.id}
                                className={classes.connector}
                                style={{
                                    width: '100%',
                                    height: '40px',
                                    backgroundColor: showColor ? connector.color  : ( !isConnected(connector.id) ? 'var(--mantine-color-dark-9)' : connector.color),
                                    borderRadius: '3px',
                                    border: '2px solid black',
                                    cursor: (isConnected(connector.id) || !isInitialPositionSet) ? 'not-allowed' : 'pointer',
                                }}
                                leftSection={!isConnected(connector.id) && <Indicator position="middle-start" size={24} processing={isInitialPositionSet} mr={265} color={isInitialPositionSet ? 'var(--mantine-color-gray-7)' : 'transparent'} />}
                                onClick={(e) => destination(e, connector.id, connector.color)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, connector.id, connector.color)}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Group>

            {gameOver &&
                <Modal
                    opened={gameOver}
                    onClose={close}
                    centered
                    withCloseButton={false} 
                    closeOnClickOutside={false}
			        closeOnEscape={false}
                >
                    <Stack gap={'xl'} justify='center'>
                        <Text size={'xl'} ta={'center'} fw={'bold'}>¡Finalizó el juego {userName}!</Text>
                        <Text size={'xl'} ta={'center'}>Puntaje: {points}</Text>
                        <Text size={'xl'} ta={'center'}>Intentos: {attempts}</Text>
                        <Text size={'xl'} ta={'center'}>Intentos fallidos: {errorAttempts}</Text>
                        <Button onClick={() => {close(); setActions('end')}} color='dark' size='lg'>Confirmar</Button>
                    </Stack>

                </Modal>
            }
        </Stack>
    )
}

export default Game