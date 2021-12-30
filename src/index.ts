import { ConfigOptions } from './types';
import Server from './server/Server';

// Loads the config file and calls the createServer function
export const createServer = async (config: string | ConfigOptions) => {
	const server = Server.getInstance();
	if (typeof config == 'string') await server.configureServerUsingConfigFile(config);
	else if (typeof config === 'object') await server.configureServer(config);
	else throw new Error('Invalid Config');
};

export const createServerWithTemplate = async (template: string) => {
	const server = Server.getInstance();
	server.configureServerUsingTemplate(template);
}

export * as CrudRoutes from './crud-routes';
export * as DataTypes from './data-types';

