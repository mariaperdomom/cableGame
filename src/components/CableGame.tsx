import React, { useEffect, useState } from 'react';
import Connector from './Connector';

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
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '50px' }}>
      <div>
        <h3>Orígenes</h3>
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
      </div>
     
      <div>
        <h3>Destinos</h3>
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
      </div>
    </div>
  );
};

export default CableGame;