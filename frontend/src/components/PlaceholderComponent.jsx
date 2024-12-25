// PlaceholderComponent.js
import React from 'react';

const PlaceholderComponent = ({ name }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>{name} (Component not ready yet)</h2>
      <p>This component is under development.</p>
    </div>
  );
};

export default PlaceholderComponent;
