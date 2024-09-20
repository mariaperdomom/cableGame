import { Button, Group, Paper, PinInput, Stack, Text, Title } from '@mantine/core'
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
    const attendeesPoints = 10;
    
    const validateCode = async () => {
        try {
            const getAttendeeByUserCode = await checkInServiceTs.getAttendeeByUserCode({userCode: code});
            if(getAttendeeByUserCode) {
                setIsValidated(true);
                setUserCode(code);
                setUserName(getAttendeeByUserCode.properties.names);
            } else {
                setErrorCode(true);
            }
        } catch (err) {
            setErrorCode(true);
        }
    }

    const participation = async () => {
        try {
            const getUserParticipation = await checkInServiceTs.getUserParticipation({userCode: code});
            if(getUserParticipation?.points) {                
                setActions('game')
            } else {
                nextStep();
            }
        } catch (err) {
            console.log(err)
        }
    }
    
    const nextStep = async () => {
        try {
            //los 10 puntos son de participación
            const saveUserParticipation = await checkInServiceTs.saveUserParticipation({userCode: code, points: attendeesPoints})
            if(saveUserParticipation) {
                setActions('game')
            }
        } catch (err) {
            console.log('error al guardar');
        }
    }

    return (
        <Stack gap={'xl'} justify='center' align='center' h={'100%'} mt={-80}>
            <Title order={1} /* size={'xl'} */ ta={'center'} mb={'xl'} c={'white'} tt={'uppercase'}>Escribe tu <Text span inherit c={'#FAC224'}>código ID</Text></Title>

            <PinInput
                size={"xl"} 
                length={6} 
                value={code}
                onChange={(event) => setCode(event)}
                error={errorCode && !isValidated}
            />
            {errorCode && !isValidated &&
                <Group gap={5} align='center' mt={-25}>
                    <IconInfoCircle color='white'/>
                    <Text c={'white'}>El código ingresado no está registrado en el evento</Text>
                </Group>
            }
            { userName &&
                <Paper p={'xs'}>
                    <Group gap={5} align='center' >
                        <IconHandStop />
                        <Text fz={'lg'}>¡Bienvenido {userName}!</Text>
                    </Group>
                </Paper>
            }
            <Group justify='center'>
                <Button size='xl' color='#FAC224' variant='subtle' onClick={()=> {setActions('')}}>Cancelar</Button>
                { !isValidated ? 
                    <Button size='xl' color='#FAC224' onClick={validateCode}>Válidar</Button>
                    :
                    <Button size='xl' color='#FAC224' onClick={participation}>Siguiente</Button>
                }
            </Group>
        </Stack>
    )
}

export default Register;