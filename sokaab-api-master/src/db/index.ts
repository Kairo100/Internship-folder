const knexConfig = {
  development: {
    client: 'mssql',
    connection: {
      user: 'sa',
      password: '2@mKZgSgr5Uz^9P$',
      host: '188.166.88.167',
      database: 'Shaqodoon',
    },
  },
  production: {
    client: 'mssql',
    connection: {
      user: 'sa',
      password: '2@mKZgSgr5Uz^9P$',
      host: '188.166.88.167',
      database: 'Shaqodoon',
    },
  },
};

// const knex = require('knex');
import knex from 'knex';

let cachedConnection;

const getDatabaseConnector = () => {
  if (cachedConnection) {
    console.log('Cached Connection');
    return cachedConnection;
  }
  const configByEnvironment = knexConfig[process.env.NODE_ENV || 'development'];

  if (!configByEnvironment) {
    throw new Error(
      `Failed to get knex configuration for env:${process.env.NODE_ENV}`,
    );
  }
  console.log('New Connection');
  const connection = knex(configByEnvironment);
  cachedConnection = connection;
  return connection;
};

export default getDatabaseConnector;
