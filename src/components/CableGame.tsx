import React, { useEffect, useState } from 'react';
import Connector from './Connector';
import { Group, Stack, Text } from '@mantine/core';

interface ConnectorData {
  id: number;
  color: string;
}

const CableGame: React.FC = () => {
  // Inicializa los conectores de origen y destino
  const initialConnectors = [
    { id: 1, color: 'red' },
    { id: 2, color: 'blue' },
    { id: 3, color: 'green' },
    { id: 4, color: 'yellow' },
  ];
  
  const [showColor,setShowColor] = useState<boolean>(true);
  const [originConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
  const [destinationConnectors] = useState<ConnectorData[]>(shuffle([...initialConnectors]));
  const [cables, setCables] = useState<{ originId: number; destinationId: number }[]>([]);

  // Maneja la conexión de un conector de origen a destino
  const handleConnect = (originId: number, destinationId: number) => {

    setCables([...cables, { originId, destinationId }]);
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
    <Group justify='space-between' gap={'xl'}>
      <Stack>
        <Text fz={'h4'} ta={'center'} fw={'bold'}>Orígen</Text>
        {originConnectors.map((connector) => (
          <Connector
            key={connector.id}
            connector={connector}
            onConnect={handleConnect}
            isConnected={isConnected(connector.id) !== undefined}
            type="origin"
            showColor={showColor}
          />
        ))}
      </Stack>
     
      <Stack>
        <Text fz={'h4'} ta={'center'} fw={'bold'}>Destino</Text>
        {destinationConnectors.map((connector) => (
          <Connector
            key={connector.id}
            connector={connector}
            onConnect={handleConnect}
            isConnected={isConnected(connector.id) !== undefined}
            type="destination"
            showColor={showColor}
          />
        ))}
      </Stack>
    </Group>
  );
};

export default CableGame;