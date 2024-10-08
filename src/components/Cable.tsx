import { Avatar, Box, Button, Group, Modal, Paper, Stack, Text, Title } from '@mantine/core';
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
}

const Game = (props: Props) => {
    const { setActions, userCode } = props;
    const initialConnectors = [
        { id: 1, color: 'red'},
        { id: 2, color: 'blue'},
        { id: 3, color: 'green'},
        { id: 4, color: 'yellow'},
    ];
    const [points, setPoints] = useState<number>(0);
    const [originId, setOriginId] = useState<number>(0);
    const [attempts, setAttempts] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [showColor,setShowColor] = useState<boolean>(true);
    const [errorAttempts, setErrorAttempts] = useState<number>(0);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [activeCountDown, setActiveCountDown] = useState<boolean>(false);
    const [isInitialPositionSet, setIsInitialPositionSet] = useState<boolean>(false);
    const [originConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
    const [destinationConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
    const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);
    const [cables, setCables] = useState<{ originId: number; destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string }[]>([]);
    
    const positionRef = useRef<{x1: number, y1: number, x2: number, y2: number}>();

    const waitTime : number = 3000;
    const countDownOrigin = useCountDown(3, 'origin');
    const countDownGame = useCountDown(500, 'game');
    
    const [, { close }] = useDisclosure(false);

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
                    console.log(saveUserParticipation);
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
                if(ctx && canvas) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    cables.forEach((cable) => {
                        ctx.beginPath();
                        ctx.moveTo(cable.x1, cable.y1);
                        ctx.lineTo(cable.x2, cable.y2);
                        ctx.lineWidth = 5;
                        ctx.strokeStyle = cable.color;
                        ctx.stroke();
                    });
                }
            }
        } else {
            setGameOver(true);
        }
    };

    const handleDropNothin = (e : React.DragEvent<HTMLDivElement>) =>{
        e.preventDefault();
        console.log('handleDropNothin');
        if(ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            cables.forEach((cable) => {
                ctx.beginPath();
                ctx.moveTo(cable.x1, cable.y1);
                ctx.lineTo(cable.x2, cable.y2);
                ctx.lineWidth = 5;
                ctx.strokeStyle = cable.color;
                ctx.stroke();
            });
        }
    }

    // Función para barajar los conectores de destino
    function shuffle(array: ConnectorData[]) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Verifica si un conector ya está conectado
    const isConnected = (connectorId: number) => {
        if(showColor) return true
        return cables.find((cable) => cable.originId === connectorId && cable.destinationId === connectorId);
    };


    //Maneja el control de la posición de los elementos seleccionados para poder obtener las coordenadas
    const handleCanvasClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (canvas && ctx) {
            setIsInitialPositionSet(true);
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
            setIsInitialPositionSet(true);
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
        console.log(canvas ,ctx , initialPosition, isInitialPositionSet);
        if (canvas && ctx && initialPosition && isInitialPositionSet) {
            console.log('handleDragOverCanvas');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            cables.forEach((cable) => {
                ctx.beginPath();
                ctx.moveTo(cable.x1, cable.y1);
                ctx.lineTo(cable.x2, cable.y2);
                ctx.lineWidth = 5;
                ctx.strokeStyle = cable.color;
                ctx.stroke();
            });

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
        console.log('handleDrop'); 
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
        <Stack w={"1080px"} h={"100vh"}>
            <Title order={1} onClick={()=> setActions('end')} style={{cursor: 'pointer'}} ta={'center'}>Juego</Title>
            <Group justify='center' align='center' gap={'xl'}>
                <Paper radius={'md'}>
                    Tiempo: {activeCountDown ? countDownGame.seconds : '20' }
                </Paper>
                <Paper radius={'md'}>
                    Puntos: {points}
                </Paper>
                <Paper radius={'md'}>
                    Intentos: {errorAttempts} / 4
                </Paper>
            </Group>
            {showColor &&
                <Group justify='center'>
                    <Avatar 
                        radius="xl" 
                        size="lg" 
                        src={null} 
                        className={classes.pulse}
                        style={{position: 'absolute', top: '55vh'}}
                    >{countDownOrigin.seconds}</Avatar>
                </Group>
            }
            <Group justify='space-between' gap={0} w={"100%"} >
                <Stack mr={-10} gap={"lg"}>
                    <Text fz={'h4'} ta={'center'} fw={'bold'}>Orígen</Text>
                    {originConnectors.map((connector) => (
                        <div key={connector.id} style={{marginBlock: "100px"}}>
                            <Box
                                className={classes.connector}
                                style={{
                                    width: '150px',
                                    height: '80px',
                                    backgroundColor:  isConnected(connector.id) ? connector.color : "black",
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
                                draggable={!isConnected(connector.id)}
                                onDragStart={(e) => handleDragStart(e, connector.id)}
                                onDragEnd={(e) => handleDropNothin(e)}
                            />
                        </div>
                    ))}
                </Stack>
                <canvas 
                    id="canvasGame"
                    width='250'
                    height='600'
                    style={{ zIndex: 1,}}
                    onDragOver={handleDragOverCanvas}
                />
                <Stack ml={-10}>
                    <Text fz={'h4'} ta={'center'} fw={'bold'}>Destino</Text>
                    {destinationConnectors.map((connector) => (
                    <div key={connector.id} style={{marginBlock: "100px"}}>
                        <Box 
                            className={classes.connector}
                            style={{
                                width: '150px',
                                height: '80px',
                                backgroundColor: isConnected(connector.id) ? connector.color : "black",
                                borderRadius: '3px',
                                margin: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid black',
                                cursor: isConnected(connector.id)? 'not-allowed' : 'pointer',
                                /* zIndex: 1000 */
                            }}
                            onDragOver={handleDragOver}
                            draggable={false}
                            onDrop={(e) => handleDrop(e, connector.id, connector.color)}
                        />
                    </div>
                    ))}
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
                    Finalizo el juego

                    <Group justify='center'>
                        <Button onClick={() => {close(); setActions('end')}}>Confirmar</Button>
                    </Group>
                </Modal>
            }
        </Stack>
    )
}

export default Game