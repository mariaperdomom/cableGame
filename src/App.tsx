import React, { useState } from 'react';
import CableGame from './components/CableGame';
import { Center, Container, Stack, Title } from '@mantine/core';

const App: React.FC = () => {
  const [ actions, setActions ] = useState('');
  
  return (
    <Container h={'100vh'} >
      <Center h={'100%'} >
        <Stack gap={'xl'} p={'xl'} justify="center" align="center">
          { actions === '' && 
            <Title order={1} onClick={()=> setActions('register')}>Bienvenidos</Title>
          }
          { actions === 'register' && 
            <Title order={1} onClick={()=> setActions('game')}>Registro</Title>
          }
          { actions === 'game' &&
            <>
              <Title order={1} onClick={()=> setActions('end')}>Juego</Title>
              <CableGame />
            </>
          }
          { actions === 'end' &&
            <Title order={1} onClick={()=> setActions('')}>Final</Title>
          }
        </Stack>
      </Center>
    </Container>
  );
};

export default App;