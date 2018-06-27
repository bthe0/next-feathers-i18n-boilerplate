import React, { createContext } from 'react';

/**
 * Global app context
 */

const { Consumer, Provider } = createContext();

/**
 * Export the context
 */

export {
    Consumer,
    Provider
}