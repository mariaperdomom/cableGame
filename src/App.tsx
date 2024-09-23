import React, { useState } from 'react';
import { AspectRatio, BackgroundImage, Container, Group, Image, Stack } from '@mantine/core';
import Register from './components/Register';
import Welcome from './components/Welcome';
import End from './components/End';
import ProductGame from './components/ProductGame';

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
        <BackgroundImage src='../assets/REGISTRO_ID.png' style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Stack justify='space-between' style={{ height: '100%' }}>
            <AspectRatio ratio={16 / 9} style={{ width: '100%' }}>
              <Stack justify='center' align='center'>
                <Image src={'../assets/LogoHubbell.png'} h={'50%'} w={'40%'}/>
              </Stack>
            </AspectRatio>
            <Register setActions={setActions} setUserCode={setUserCode} userName={userName} setUserName={setUserName}/>
            <Group justify='space-around' align='center' wrap='nowrap'>
              <Image src={'../assets/Burndy/BurndyLogo.png'} h={'10vh'} w={'30vw'} fit='contain'/>
              <Image src={'../assets/Raco/RacoLogo.png'} h={'10vh'} w={'10vw'} fit='contain'/>
              <Image src={'../assets/Wiegmann/WiegmannLogo.png'} h={'10vh'} w={'30vw'} fit='contain'/>
            </Group>
          </Stack>
        </BackgroundImage>
      }
      { actions === 'game' &&
        <BackgroundImage src='../assets/JUEGO.png' style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Stack justify='space-between' style={{ height: '100%' }}>
            <AspectRatio ratio={16 / 9} style={{ width: '100%' }} mt={-180}>
              <Stack justify='center' align='center'>
                <Image src={'../assets/LogoHubbell.png'} h={'35%'} w={'25%'}/>
              </Stack>
            </AspectRatio>
            <ProductGame setActions={setActions} userCode={userCode} userName={userName}/>
            <AspectRatio ratio={16 / 9} style={{ width: '100%' }} mt={-240}>
              <Group justify='space-around' align='center' wrap='nowrap'>
                <Image src={'../assets/Burndy/BurndyLogo.png'} h={'10vh'} w={'30vw'} fit='contain'/>
                <Image src={'../assets/Raco/RacoLogo.png'} h={'10vh'} w={'10vw'} fit='contain'/>
                <Image src={'../assets/Wiegmann/WiegmannLogo.png'} h={'10vh'} w={'30vw'} fit='contain'/>
              </Group>
            </AspectRatio>
          </Stack>
        </BackgroundImage>
      }
      { actions === 'end' &&
        <End setActions={setActions} setUserName={setUserName}/>
      }
    </Container>
  );
};

export default App;