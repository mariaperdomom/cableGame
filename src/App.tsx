import React, { useState } from 'react';
import {Center, Container, Stack, Title } from '@mantine/core';
import Game from './components/Game';
import Register from './components/Register';

const App: React.FC = () => {
  const [ actions, setActions ] = useState<string>('');
  const [ userCode, setUserCode ] = useState<string>('');
    
  return (
    <Container h={'100vh'} fluid bg={'#FEE66F'} p={0}>
     {/*  <Center h={'100%'} w={'100%'}> */}
        {/* <Stack gap={'xl'} p={'xl'} justify='center' align='center'> */}
          { actions === '' && 
            <Stack onClick={()=> setActions('register')} style={{cursor: 'pointer'}} justify='center' gap={'xl'} h={'100%'}>
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
            <Stack onClick={()=> setActions('')} justify='center' h={'100%'}>
              <Title order={1} style={{cursor: 'pointer'}} ta={'center'}>Final</Title>
            </Stack>
          }
        {/* </Stack> */}
      {/* </Center> */}
    </Container>
  );
};

export default App;