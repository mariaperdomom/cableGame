import React from 'react';

interface ConnectorProps {
  connector: {
    id: number;
    color: string;
  };
  onConnect: (originId: number, destinationId: number) => void;
  isConnected: boolean  ;
  showColor?: boolean;
  type: 'origin' | 'destination';
}

const Connector: React.FC<ConnectorProps> = ({ connector, onConnect, isConnected, type, showColor }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'origin') {
      e.dataTransfer.setData('originId', connector.id.toString());
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const originId = Number(e.dataTransfer.getData('originId'));

    if (type === 'destination' && !isConnected && originId) {
      onConnect(originId, connector.id);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'destination' && !isConnected) {
      e.preventDefault();
    }
  };


  return (
    <div
      className="connector"
      style={{
        width: '300px',
        height: '20px',
        backgroundColor: showColor ? connector.color  : ( !isConnected ? 'gray' : connector.color),
        borderRadius: '10%',
        margin: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid black',
        cursor: isConnected ? 'not-allowed' : 'pointer',
      }}
      draggable={type === 'origin' && !isConnected}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
    </div>
  );
};

export default Connector;