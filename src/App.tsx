import React, { useState } from 'react';
import { Container, Stack, Title } from '@mantine/core';
import Game from './components/Game';
import Register from './components/Register';

const App: React.FC = () => {
  const [ actions, setActions ] = useState<string>('');
  const [ userCode, setUserCode ] = useState<string>('');
  const [ userName, setUserName ] = useState<string>('');
    
  return (
    <Container h={'100vh'} fluid bg={'#FEE66F'} p={0}>
      { actions === '' && 
        <Stack onClick={()=> setActions('register')} style={{cursor: 'pointer'}} justify='center' gap={'xl'} h={'100%'}>
          <Title order={1} ta={'center'}>Bienvenidos</Title>
        </Stack>
      }
      { actions === 'register' && 
        <Register setActions={setActions} setUserCode={setUserCode} userName={userName} setUserName={setUserName}/>
      }
      { actions === 'game' &&
          <Game setActions={setActions} userCode={userCode} userName={userName}/>
      }
      { actions === 'end' &&
        <Stack onClick={()=> setActions('')} justify='center' h={'100%'}>
          <Title order={1} style={{cursor: 'pointer'}} ta={'center'}>¡Finalizó!</Title>
        </Stack>
      }
    </Container>
  );
};

export default App;