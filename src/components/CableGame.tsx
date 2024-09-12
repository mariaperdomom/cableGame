import React, { useEffect, useRef, useState } from 'react';
import Connector from './Connector';
import { Group, Stack, Text } from '@mantine/core';
import NewCableGame from './NewCableGame';

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
  const [showLine, setShowLine] = useState<boolean>(false)

  // Maneja la conexión de un conector de origen a destino
  const handleConnect = (originId: number, destinationId: number, x1: number, y1: number, x2: number, y2: number, color: string) => {
    if(originId === destinationId) {
      setCables([...cables, { originId, destinationId, x1, y1, x2, y2, color }]);
      setShowLine(true);
    } else {
      setShowLine(false);
    }
  };

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
          <Connector
            key={connector.id}
            connector={connector}
            onConnect={handleConnect}
            isConnected={isConnected(connector.id) !== undefined}
            type="origin"
            showColor={showColor}
            cables={cables}
          />
        ))}
      </Stack>
      {/* <canvas 
        id="myCanvas"
        width='250'
        height='250'
        style={{backgroundColor: 'pink'}}
      /> */}
      <NewCableGame showLine={showLine} cables={cables}/>
      <Stack ml={-20}>
        <Text fz={'h4'} ta={'center'} fw={'bold'}>Destino</Text>
        {destinationConnectors.map((connector) => (
          <Connector
            key={connector.id}
            connector={connector}
            onConnect={handleConnect}
            isConnected={isConnected(connector.id) !== undefined}
            type="destination"
            showColor={showColor}
            cables={cables}
          />
        ))}
      </Stack>
    </Group>
    </>
  );
};

export default CableGame;