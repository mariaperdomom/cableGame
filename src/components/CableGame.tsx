import React, { useEffect, useRef, useState } from 'react';
import Connector from './Connector';
import { Group, Stack, Text } from '@mantine/core';
import NewCableGame from './NewCableGame';
import Connector2 from './Connector2';

interface ConnectorData {
  id: number;
  color: string;
  x: number;
  y: number;
}

const CableGame: React.FC = () => {
  // Inicializa los conectores de origen y destino
  const initialConnectors = [
    { id: 1, color: 'red', x: 0, y: 0},
    { id: 2, color: 'blue', x: 0, y: 0 },
    { id: 3, color: 'green', x: 0, y: 0 },
    { id: 4, color: 'yellow', x: 0, y: 0 },
  ];
  
  const [showColor,setShowColor] = useState<boolean>(true);
  const [originConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
  const [destinationConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
  const [cables, setCables] = useState<{ originId: number; destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string }[]>([]);
  const [originPosition, setOriginPosition] = useState<{ x: number, y: number}>({x: 0, y: 0});
  const [connectorOriginId, setConnectorOriginId] = useState<number>(0);
  const [connectorDestineId, setConnectorDestineId] = useState<number>(0);
  const [connectorColor, setConnectorColor] = useState<string>('');

  // Maneja la conexión de un conector de origen a destino
  const handleConnect = (originId: number, destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string) => {
    if(originId === destinationId) {
      setCables([...cables, { originId, destinationId, x1, y1, x2, y2, color }]);
    }
  };

  const handlePosition = (x: number, y: number) =>{
    console.log(x, y, 'well');
    
    setOriginPosition({...originPosition,  x, y });
    console.log(originPosition, 'wwwwwwwwww');
  }

  useEffect(() => {
    setTimeout(() => {
      setShowColor(false);
    },3000)
  }, []);

  // Función para barajar los conectores de destino
  function shuffle(array: ConnectorData[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Verifica si un conector ya está conectado
  const isConnected = (connectorId: number) => {
    return cables.find((cable) => cable.originId === connectorId && cable.destinationId === connectorId);
  };

  return (
    <>
    <Group justify='space-between' gap={0} /* w={'35vw'} */>
      <Stack mr={-20}>
        <Text fz={'h4'} ta={'center'} fw={'bold'}>Orígen</Text>
        {originConnectors.map((connector) => (
          <div key={connector.id}>
            <Connector
              connector={connector}
              onConnect={handleConnect}
              isConnected={isConnected(connector.id) !== undefined}
              type="origin"
              showColor={showColor}
              cables={cables}
              onPositions={handlePosition}
              onOriginId={setConnectorOriginId}
              onColor={setConnectorColor}
            />
          </div>
        ))}
      </Stack>
      {/* <canvas 
        id="myCanvas"
        width='250'
        height='250'
        style={{backgroundColor: 'pink'}}
      /> */}
      <NewCableGame 
        cables={cables} 
        onPositions={handlePosition} originId={connectorOriginId} destineId={connectorDestineId} onConnect={handleConnect}
        color={connectorColor}
      />
      <Stack ml={-20}>
        <Text fz={'h4'} ta={'center'} fw={'bold'}>Destino</Text>
        {destinationConnectors.map((connector) => (
          <div key={connector.id}>
            <Connector2
              connector={connector}
              onConnect={handleConnect}
              isConnected={isConnected(connector.id) !== undefined}
              type="destination"
              showColor={showColor}
              cables={cables}
              originPosition={originPosition}
              onDestineId={setConnectorDestineId}
            />
          </div>
        ))}
      </Stack>
    </Group>
    </>
  );
};

export default CableGame;