import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconAuth2fa, IconInfoCircle } from '@tabler/icons-react'
import { useState } from 'react';
import { checkInServiceTs } from './firebaseService';

interface Props {
    setActions: (action: string) => void; 
    setUserCode: (code: string) => void;
}

const Register = (props: Props) => {
    const { setActions, setUserCode } = props;
    const [ code, setCode ] = useState<string>('');
    const [ isValidated, setIsValidated ] = useState<boolean>(false);
    const [ errorCode, setErrorCode ] = useState<boolean>(false);
    
    const validateCode = async () => {
        try {
            const getAttendeeByUserCode = await checkInServiceTs.getAttendeeByUserCode({userCode: code})
            console.log(getAttendeeByUserCode)
            if(getAttendeeByUserCode) {
                setIsValidated(true);
                setUserCode(code);
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
            console.log(saveUserParticipation);
            if(saveUserParticipation) {
                setActions('game')
            }
        } catch (err) {
            console.log('error  al guardar');
        }
    }

    return (
        <Stack gap={'xl'} justify='center' align='center' h={'100%'}>
            <Title order={1} style={{cursor: 'pointer'}} ta={'center'} mb={'xl'}>Registro</Title>
            <TextInput 
                label='Código'
                placeholder='m1e2a3'
                leftSection={<IconAuth2fa />}
                size='xl'
                withAsterisk
                value={code}
                onChange={(event) => setCode(event.currentTarget.value)}
                minLength={6}
                maxLength={6}
                error={errorCode && !isValidated && 'El código ingresado no está registrado en el evento'}
                w={'30%'}
            />
            <Group gap={5} align='center' mt={-25} w={'30%'}>
                <IconInfoCircle color='gray'/>
                <Text c={'gray'}>Código de 6 dígitos alphanúmericos</Text>
            </Group>
            <Group justify='end' mt={'md'} w={'30%'}>
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

export default Register