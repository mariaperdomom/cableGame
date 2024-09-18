import React, { useState } from 'react';
import { Container } from '@mantine/core';
import Game from './components/Game';
import Register from './components/Register';
import Welcome from './components/Welcome';
import End from './components/End';

const App: React.FC = () => {
  const [ actions, setActions ] = useState<string>('');
  const [ userCode, setUserCode ] = useState<string>('');
  const [ userName, setUserName ] = useState<string>('');
    
  return (
    <Container 
      fluid 
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FAC224',
      }}
    >
      { actions === '' && 
        <Welcome setActions={setActions} />
      }
      { actions === 'register' && 
        <Register setActions={setActions} setUserCode={setUserCode} userName={userName} setUserName={setUserName}/>
      }
      { actions === 'game' &&
        <Game setActions={setActions} userCode={userCode} userName={userName}/>
      }
      { actions === 'end' &&
        <End setActions={setActions} />
      }
    </Container>
  );
};

export default App;