import { Box, Button, Group, Paper, PinInput, Stack, Text, Title } from '@mantine/core'
import { IconHandStop, IconInfoCircle } from '@tabler/icons-react'
import { useState } from 'react';
import { checkInServiceTs } from './firebaseService';

interface Props {
    setActions: (action: string) => void; 
    setUserCode: (code: string) => void;
    userName: string;
    setUserName: (name: string) => void;
}

const Register = (props: Props) => {
    const { setActions, setUserCode, userName, setUserName } = props;
    const [ code, setCode ] = useState<string>('');
    const [ isValidated, setIsValidated ] = useState<boolean>(false);
    const [ errorCode, setErrorCode ] = useState<boolean>(false);
    
    const validateCode = async () => {
        try {
            const getAttendeeByUserCode = await checkInServiceTs.getAttendeeByUserCode({userCode: code})
            if(getAttendeeByUserCode) {
                setIsValidated(true);
                setUserCode(code);
                setUserName(getAttendeeByUserCode.properties.names)
            } else {
                setErrorCode(true);
            }
        } catch (err) {
            setErrorCode(true);
        }
    }
    
    const nextStep = async () => {
        try {
            //los 10 puntos son de participación
            const saveUserParticipation = await checkInServiceTs.saveUserParticipation({userCode: code, points: 10})
            if(saveUserParticipation) {
                setActions('game')
            }
        } catch (err) {
            console.log('error al guardar');
        }
    }

    return (
        <Stack gap={'xl'} justify='center' align='center' h={'100%'}>
            <Title order={1} style={{cursor: 'pointer'}} ta={'center'} mb={'xl'}>Registro</Title>

            <Box w={'25%'}>
                <Text fw={'bold'} ta={'start'} fz={'xl'} mb={10}>Código</Text>
                <PinInput
                    size="xl" 
                    length={6} 
                    value={code}
                    onChange={(event) => setCode(event)}
                    error={errorCode && !isValidated}
                />
            </Box>
            {errorCode && !isValidated &&
                <Group gap={5} align='center' mt={-25} w={'25%'}>
                    <IconInfoCircle color='red'/>
                    <Text c={'red'}>El código ingresado no está registrado en el evento</Text>
                </Group>
            }
            { userName &&
                <Paper w={'25%'} p={'xs'}>
                    <Group gap={5} align='center' >
                        <IconHandStop />
                        <Text fz={'lg'}>¡Bienvenido {userName}!</Text>
                    </Group>
                </Paper>
            }
            <Group justify='end' w={'25%'}>
                <Button size='xl' color='dark' variant='subtle' onClick={()=> {setActions('')}}>Cancelar</Button>
                { !isValidated ? 
                    <Button size='xl' color='dark' onClick={validateCode}>Válidar</Button>
                    :
                    <Button size='xl' color='dark' onClick={nextStep}>Siguiente</Button>
                }

            </Group>
        </Stack>
    )
}

export default Register;