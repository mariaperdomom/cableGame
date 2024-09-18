import React, { useState } from 'react';
import { AspectRatio, Container } from '@mantine/core';
import Game from './components/Game';
import Register from './components/Register';
import ReactPlayer from 'react-player';

const App: React.FC = () => {
  const [ actions, setActions ] = useState<string>('');
  const [ userCode, setUserCode ] = useState<string>('');
  const [ userName, setUserName ] = useState<string>('');

   // Función que se llama cuando el video termina
   const handleVideoEnd = () => {
    setTimeout(() => {
      setActions('');
    }, 500); 
  };
    
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
        <AspectRatio 
          ratio={9 / 16} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          onClick={()=> setActions('register')}
        >
          <ReactPlayer 
            url={'../assets/Intro.mp4'}
            playing={true}
            loop={true}
            height={'100%'}
            width={'100%'}
            style={{ objectFit: 'cover' }}
          />
        </AspectRatio>
      }
      { actions === 'register' && 
        <Register setActions={setActions} setUserCode={setUserCode} userName={userName} setUserName={setUserName}/>
      }
      { actions === 'game' &&
          <Game setActions={setActions} userCode={userCode} userName={userName}/>
      }
      { actions === 'end' &&
        <AspectRatio 
          ratio={9 / 16} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <ReactPlayer 
            url={'../assets/Cierre.mp4'}
            playing={true}
            onEnded={handleVideoEnd}
            height={'100%'}
            width={'100%'}
            style={{ objectFit: 'cover' }}
          />
        </AspectRatio>
      }
    </Container>
  );
};

export default App;