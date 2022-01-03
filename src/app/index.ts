import { ConfigOptions } from './types';
import Server from './server/Server';
import * as CrudRoutes from './crud-routes';
import * as DataTypes from './data-types';

// Loads the config file and calls the createServer function
const createServer = async (config: string | ConfigOptions) => {
	const server = Server.getInstance();
	if (typeof config == 'string') await server.configureServerUsingConfigFile(config);
	else if (typeof config === 'object') await server.configureServer(config);
	else throw new Error('Invalid Config');
};

const createWithTemplate = async (template: string) => {
	const server = Server.getInstance();
	server.configureServerUsingTemplate(template);
};

export default { createServer, createWithTemplate, CrudRoutes, DataTypes };
