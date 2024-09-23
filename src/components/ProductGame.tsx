import { Avatar, Button, Group, Image, Modal, Stack, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react'
import classes from './Connector.module.css';
import { useCountDown } from './useCountDown';
import { useDisclosure } from '@mantine/hooks';
import { checkInServiceTs } from './firebaseService';

interface ConnectorData {
    id: number;
    urlProduct: string;
    urlLogo: string;
}

interface Props {
    setActions: (action: string) => void; 
    userCode: string;
    userName: string;
}

const ProductGame = (props: Props) => {
    const { setActions, userCode, userName } = props;
    const initialConnectors = [
        { id: 1, urlProduct: '../assets/Burndy/Burndy1.png', urlLogo: '../assets/Burndy/BurndyLogo.png'},
        { id: 2, urlProduct: '../assets/Burndy/Burndy2.png', urlLogo: '../assets/Burndy/BurndyLogo.png'},
        { id: 3, urlProduct: '../assets/Burndy/Burndy3.png', urlLogo: '../assets/Burndy/BurndyLogo.png'},
        { id: 4, urlProduct: '../assets/Raco/Raco1.png', urlLogo: '../assets/Raco/RacoLogo.png'},
        { id: 5, urlProduct: '../assets/Raco/Raco2.png', urlLogo: '../assets/Raco/RacoLogo.png'},
        { id: 6, urlProduct: '../assets/Raco/Raco3.png', urlLogo: '../assets/Raco/RacoLogo.png'},
        { id: 7, urlProduct: '../assets/Wiegmann/Wiegmann.png', urlLogo: '../assets/Wiegmann/WiegmannLogo.png'},
    ];
    const [showColor,setShowColor] = useState<boolean>(true);
    const [originConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
    const [destinationConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
    const [cables, setCables] = useState<{ originId: number; destinationId: number, x1: number, y1: number, x2: number, y2: number }[]>([]);
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
    const waitTime : number = 5000;
    const [activeCountDown, setActiveCountDown] = useState<boolean>(false);
    const countDownOrigin = useCountDown(5, 'origin');
    const countDownGame = useCountDown(32, 'game');
    const [, { close }] = useDisclosure(false);
    const [participatedPoints, setParticipatedPoints] = useState<number>(0);
    const limitedErrorAttempts = 9;
    const attendeesPoints = 10;
    const logoHubbell = '../assets/LogoHubbell.png'

    useEffect(() => {
        //Declaración del canvas para mostrar las líneas de conección
        const canvas = document.getElementById('canvasGame') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        setCanvas(canvas);
        setCtx(ctx);
        
        //Se declara los 3 segundos en los que el usuario puede ver los colores verdaderos antes de ocultarlos
        setTimeout(() => {
            setShowColor(false);
            setActiveCountDown(true);
        },waitTime)

        participation();
    }, []);

    //Muestra las lineas trazadas de los cables ya conectados
    useEffect(() => {
        correctLine();
    }, [cables, ctx]);

    //Si no hizo nada y solo se quedo viendo llama a la funcion para abrir el modal
    useEffect(() => {
        if(countDownGame.seconds === 0){
            setGameOver(true);
        }
    },[countDownGame.seconds])

    //Te guarda los puntos al terminar el juego
    useEffect(() => {
        if(gameOver){
            const save = async () => {
                if(participatedPoints === attendeesPoints) {
                    try {
                        const saveUserParticipation = await checkInServiceTs.saveUserParticipation({userCode: userCode, points: points + attendeesPoints})
                        if(saveUserParticipation) {
                            setGameOver(true);
                            /* console.log('llego aqui') */
                        }
                    } catch (err) {
                        console.log('error  al guardar');
                    }
                } else {
                    try {
                        const saveUserParticipation = await checkInServiceTs.saveUserParticipation({userCode: userCode})
                        if(saveUserParticipation) {
                            setGameOver(true);
                            /* console.log('llego aqui 2') */
                        }
                    } catch (err) {
                        console.log('error  al guardar');
                    }
                }
            }
            save();
        } 
    }, [gameOver])

    const correctLine = () => {
        if (ctx) {
            ctx.clearRect(0, 0, canvas!.width, canvas!.height);
            cables.forEach((cable) => {
                ctx.beginPath();
                ctx.moveTo(cable.x1, cable.y1);
                ctx.lineTo(cable.x2, cable.y2);
                ctx.lineWidth = 10;
                ctx.strokeStyle = '#FAC224';
                ctx.stroke();
            });
        }
    }

    const participation = async () => {
        try {
            const getUserParticipation = await checkInServiceTs.getUserParticipation({userCode});
            if(getUserParticipation?.points) {                
                setParticipatedPoints(getUserParticipation?.points);
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Maneja la conexión de un conector de origen a destino
    const handleConnect = (originId: number, destinationId: number, x1: number, y1: number, x2: number, y2: number) => {
        setAttempts(attempts + 1);
        if(errorAttempts < limitedErrorAttempts){
            if(originId === destinationId) {
                setCables([...cables, { originId, destinationId, x1, y1, x2, y2 }]);
                setPoints(points + attendeesPoints);
                
                if(cables.length === 6) {
                    setGameOver(true);
                }
            } else {
                setErrorAttempts(errorAttempts + 1);
                correctLine();
            }
            setOriginId(0);
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
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#FAC224';
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
    const destination = (e: React.MouseEvent<HTMLDivElement>, destinationId: number) => {
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
                handleConnect(originId, destinationId, lastPosition.x1, lastPosition.y1, canvasX, canvasY);
            }
        }
    }
    
    return (
        <Stack gap={'xl'} h={'100%'} justify='center' mt={-190}>
            <Group justify='center' align='center' gap={'xl'}>
                <Button color='#FAC224' size='40' h={70} style={{cursor: 'none', pointerEvents: 'none'}}>Tiempo: {activeCountDown ? countDownGame.seconds : '40' }</Button>
                <Button color='#FAC224' size='40' h={70} style={{cursor: 'none', pointerEvents: 'none'}}>Puntos: {points}</Button>
                <Button color='#FAC224' size='40' h={70} style={{cursor: 'none', pointerEvents: 'none'}}>Errores: {errorAttempts} / {limitedErrorAttempts}</Button>
            </Group>
            {showColor &&
                <Group justify='center'>
                    <Avatar 
                        radius="150" 
                        size="300" 
                        src={null} 
                        className={classes.pulse}
                        style={{position: 'absolute', top: '48vh'}}
                    ><Text inherit c={'#FAC224'}>{countDownOrigin.seconds}</Text></Avatar>
                </Group>
            }
            <Group justify='center' gap={0} wrap='nowrap'>
                <Stack gap={'xl'}>
                    {originConnectors.map((connector) => (
                        <Avatar 
                            key={connector.id}
                            variant={originId !== connector.id ? 'filled' : 'light'} 
                            radius='lg' 
                            size='175' 
                            color='#FAC224'
                            src={null} 
                            onClick={(e) => origin(e, connector.id)}
                            style={{
                                cursor: isConnected(connector.id) ? 'not-allowed' : 'pointer',
                                pointerEvents: isConnected(connector.id) && 'none',
                            }}
                        >
                            <Image src={showColor ? connector.urlProduct : ( !isConnected(connector.id) ? originId === connector.id ? connector.urlProduct : logoHubbell : connector.urlProduct)} />
                        </Avatar>
                    ))}
                </Stack>
                <canvas 
                    id="canvasGame"
                    width={window.innerWidth * 0.55}
                    height='1400'
                    style={{/* backgroundColor: 'pink', */ zIndex: 10}}
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                />
                <Stack gap={'xl'}>
                    {destinationConnectors.map((connector) => (
                        <Avatar 
                            key={connector.id}
                            variant={'filled'} 
                            className={originId ? classes.littlePulse : ''}
                            radius='lg' 
                            size='175'
                            color='#FAC224'
                            src={null} 
                            onClick={(e) => originId && destination(e, connector.id)}
                            style={{
                                cursor: (isConnected(connector.id) || !isInitialPositionSet) ? 'not-allowed' : 'pointer',
                                pointerEvents: isConnected(connector.id) && 'none'
                            }}
                        >
                            <Image src={showColor ? connector.urlProduct  : ( !isConnected(connector.id) ? logoHubbell : connector.urlProduct)} />
                        </Avatar>
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
                    size={'xl'}
                    radius={'lg'}
                    styles={{
                        content: {
                          backgroundColor: '#FAC224',
                          position: 'relative',
                        },
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url("${logoHubbell}")`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.2, 
                        zIndex: -1,
                    }} />
                    <Stack gap={'xl'} justify='center'>
                        <Text fz={'60'} ta={'center'} fw={'bold'} tt={'uppercase'}>¡Finalizó el juego {userName}!</Text>
                        <Text fz={'45'} ta={'center'} fw={'bold'} tt={'uppercase'}>Puntaje: {points}</Text>
                        <Text fz={'45'} ta={'center'} fw={'bold'} tt={'uppercase'}>Intentos: {attempts}</Text>
                        <Text fz={'45'} ta={'center'} fw={'bold'} tt={'uppercase'}>Intentos fallidos: {errorAttempts}</Text>
                        <Button onClick={() => {close(); setActions('end')}} color='dark' size='50' h={100}>Confirmar</Button>
                    </Stack>
                </Modal>
            }
        </Stack>
    )
}

export default ProductGame;