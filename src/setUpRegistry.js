import React from 'react';
import Registry from '@folio/plugin-resource-registry';

const setUpRegistry = () => {
  const registry = Registry;
  // Widget resource
  registry.registerResource('widget');
};

export default setUpRegistry;
