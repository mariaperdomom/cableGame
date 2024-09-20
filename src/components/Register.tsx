import { Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
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
        <Stack gap={'xl'} align='center' mt={-300} >
            <Title 
                order={1} 
                size={'100'} 
                ta={'center'} 
                mb={'xl'} 
                c={'white'} 
                tt={'uppercase'}
                style={{ fontFamily: 'Roboto, sans-serif' }}
                w={'60%'}
            >
                Escribe tu {''}
                <Text span inherit c={'#FAC224'}>código ID</Text>
            </Title>

            <TextInput 
                placeholder='m1e2a3'
                size='120'
                value={code}
                onChange={(event) => setCode(event.currentTarget.value)}
                required
                minLength={6}
                maxLength={6}
                error={errorCode && !isValidated && 
                    <Group gap={5} align='center' mt={-25}>
                        <IconInfoCircle color='white'/>
                        <Text c={'white'}>El código ingresado no está registrado en el evento</Text>
                    </Group>
                }
                variant="filled"
                w={'60%'}
            />
            { userName &&
                <Paper p={'xs'} w={'60%'}>
                    <Group gap={5} align='center' >
                        <Text fz={'40'}>¡Bienvenid@ {userName}!</Text>
                    </Group>
                </Paper>
            }
            <Group justify='center' mt={40} grow w={'60%'}>
                { !isValidated ? 
                    <Button size='80' h={120} style={{ fontFamily: 'Roboto, sans-serif' }} color='#FAC224' onClick={validateCode}>Válidar</Button>
                    :
                    <Button size='80' h={120} style={{ fontFamily: 'Roboto, sans-serif' }} color='#FAC224' onClick={participation}>Continuar</Button>
                }
            </Group>
        </Stack>
    )
}

export default Register;