import React from 'react';

interface AlertMessage {
  message: string;
}

const AlertMessage: React.FC<AlertMessage> = ({ message}) => {
  return (
    <div style={alertStyle}>
      {message}
    </div>
  );
};

const alertStyle: React.CSSProperties = {
  position: 'fixed',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#ff9800',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '5px',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1000, // Ensure it's above other elements
  pointerEvents: 'none', // Allow clicks to pass through
};

export default AlertMessage;
