import React, { useState } from 'react';
import CableGame from './components/CableGame';
import { Button, Center, Container, Group, Image, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconAuth2fa, IconInfoCircle } from '@tabler/icons-react';
import XCableGame from './components/xCableGame';
import GeneralGame from './components/GeneralGame';
import Canvas from './components/Canvas';
import Game from './components/Game';
import Register from './components/Register';
/* import Canvas from './components/Canvas';
import NewCableGame from './components/NewCableGame';
import OtherCableGame from './components/OtherCableGame'; */

const App: React.FC = () => {
  const [ actions, setActions ] = useState<string>('');
  const [ userCode, setUserCode ] = useState<string>('');
    
  return (
    <Container h={'100vh'} fluid>
      <Center h={'100%'} >
        <Stack gap={'xl'} p={'xl'} justify='center' align='center'>
          { actions === '' && 
            <Stack onClick={()=> setActions('register')} style={{cursor: 'pointer'}} justify='center' gap={'xl'}>
              <Title order={1} ta={'center'}>Bienvenidos</Title>
              {/* <Image src={'./assets/cableD.jpg'} h={30} />
              <Text ta={'center'}>Has tu magia</Text> */}
            </Stack>
          }
          { actions === 'register' && 
            <Register setActions={setActions} setUserCode={setUserCode}/>
          }
          { actions === 'game' &&
             <Game setActions={setActions} userCode={userCode}/>
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