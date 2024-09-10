import React, { useState } from 'react';
import CableGame from './components/CableGame';
import { Button, Center, Container, Group, Image, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconAuth2fa, IconInfoCircle } from '@tabler/icons-react';
import Canvas from './components/Canvas';
import NewCableGame from './components/NewCableGame';
import OtherCableGame from './components/OtherCableGame';

const App: React.FC = () => {
  const [ actions, setActions ] = useState('');
  const [ code, setCode ] = useState('000000');
  /* const [ submit, setSubmit ] = useState(false); */
  
  return (
    <Container h={'100vh'} >
      <Center h={'100%'} >
        <Stack gap={'xl'} p={'xl'} justify='center' align='center'>
          { actions === 's' && 
            <Stack onClick={()=> setActions('register')} style={{cursor: 'pointer'}} justify='center'>
              <Title order={1} ta={'center'}>Bienvenidos</Title>
              <Image src={'./assets/cableD.jpg'} h={50} />
              <Text ta={'center'}>Has tu magia</Text>
            </Stack>
          }
          { actions === 'register' && 
            <Stack gap={'xl'}>
              <Title order={1} style={{cursor: 'pointer'}} ta={'center'}>Registro</Title>
              <TextInput 
                label='Código'
                placeholder='M1E2A3'
                leftSection={<IconAuth2fa />}
                size='lg'
                withAsterisk
                value={code}
                onChange={(event) => setCode(event.currentTarget.value)}
                maxLength={6}
              />
              <Group gap={5} align='center' mt={-25}>
                <IconInfoCircle color='gray'/>
                <Text c={'gray'}>Código de 6 dígitos alphanúmericos</Text>
              </Group>

              <Group>
                <Button size='lg' variant='subtle'>Cancelar</Button>
                <Button size='lg' disabled={code === ''} /* loading={submit} */ onClick={()=> {setActions('game')}}>Siguiente</Button>
              </Group>
            </Stack>
          }
          { actions === '' &&
            <>
              <Title order={1} onClick={()=> setActions('end')} style={{cursor: 'pointer'}} ta={'center'}>Juego</Title>
              <CableGame />
              {/* <Canvas /> */}
              {/* <NewCableGame /> */}
              {/* <OtherCableGame /> */}
            </>
          }
          { actions === 'end' &&
            <Title order={1} onClick={()=> setActions('')} style={{cursor: 'pointer'}} ta={'center'}>Final</Title>
          }
        </Stack>
      </Center>
    </Container>
  );
};

export default App;