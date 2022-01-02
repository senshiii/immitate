import express, { Express, NextFunction, Request, Response } from 'express';
import figlet from 'figlet';
import cors from 'cors';
import { ConfigOptions, DefaultRoutes, Model, Templates } from '../types';
import Database from './data/Database';
import path from 'path';
import Utils from './Util';
import FileOps from './data/FileOps';
import Validator from './validation/Validator';
import Logger from '../logging/Logger';
import { ECommConfig, SocialMediaConfig } from '../config/template-configs'

const DB_FILE_NAME = 'immitate.db.json';

export default class Server {
	private static instance: Server;
	private app: Express;
	private dbInstance: Database;
	private validator: Validator;

	private constructor() {
		// Creating Express Instance
		this.app = express();
		// Creating Database Instance
		this.dbInstance = new Database();
		// Setting Validation object
		this.validator = new Validator();
		// Post Initialization Setup
		this.postInitSetup();
	}

	static getInstance(): Server {
		if (this.instance == undefined || this.instance == null) this.instance = new Server();
		return this.instance;
	}

	private async printLogo(){
		// Printing the Big IMMITATE Logo
		try {
			console.log(
				await new Promise((resolve, reject) =>
					figlet('IMMITATE', (err, data) => {
						if (err) reject(err);
						resolve(data as string);
					})
				)
			);
		} catch (error) {}
	}

	async configureServerUsingTemplate(temp: string){
		switch(temp){
			case Templates.E_COMM: this.setUpEcomm();break;
			case Templates.SOCIAL_MEDIA:  this.setUpSocialMedia(); break;
			default: throw "Invalid Template";
		}
	}

	private async setUpEcomm() {
		await this.configureServer(ECommConfig);
	}
	
	private async setUpSocialMedia() {
		await this.configureServer(SocialMediaConfig);
	}

	async configureServer(config: ConfigOptions) {
		// TODO: Validate Config Object
		const port = config['port'] ?? 8080;
		const models = config['models'];
		let dbOpt = config['db'];
		let dbPath: string;
		let removeExisting = false;

		// Determining the DB File Name
		if (dbOpt) {
			if (typeof dbOpt == 'string') dbPath = dbOpt;
			else if (typeof dbOpt == 'object') {
				if (Utils.objectHasKey(dbOpt, 'name')) dbPath = dbOpt['name']!;
				else dbPath = DB_FILE_NAME;
				removeExisting = dbOpt['removeExisting'];
			}
		} else {
			dbPath = DB_FILE_NAME;
		}

		await this.printLogo();

		// Setting Db Path
		this.dbInstance.dbPath = path.resolve(dbPath!);
		// Creating Db File
		this.dbInstance.createDbFile(removeExisting);

		// Setting Home Route
		this.app.get('/', (_: Request, res: Response) => {
			res.json({
				name: 'Awesome Rest',
				description: 'A highly configurable 📝, feature packed 💥 and awesome 😎🔥 fake rest api server.',
				docs: 'LINK_TO_DOCS',
			});
		});

		// Registering Routes
		Object.entries(models).forEach(([key, model]) => {
			model['routes'].forEach((route) => {
				const endpoint = key.toLowerCase();
				Logger.info(`Discovered model - '${Utils.capitalize(key)}' identified by resource name - '${endpoint}'`);
				this.registerEndpoint(route, key, endpoint, model);
				Logger.print('\n');
			});
		});

		// GLOBAL ERROR HANDLER
		this.app.use((err: any, _: any, res: any, _1: any) => {
			if (err) return res.status(err.status ?? 500).json(err);
		});

		this.app.listen(port, () => {
			Logger.ok(`Server started on port ${port}. Visit http://localhost:${port}/ to know more\n`);
			Logger.info('Waiting for Requests...\n');
		});
	}

	async configureServerUsingConfigFile(configFilePath: string) {
		configFilePath = path.resolve(configFilePath);
		try {
			const config = FileOps.readObjectFromFile(configFilePath);
			await this.configureServer(config as ConfigOptions);
		} catch (err) {
			console.error(`Error reading config file at location: ${configFilePath}`, err);
			return;
		}
	}

	private postInitSetup() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(cors());
		this.app.use((req: Request, _: Response, next: NextFunction) => {
			Logger.logRequest(req.originalUrl, req.method, req.body);
			next();
		});
	}

	private registerCreateRoute(modelName: string, endpoint: string, model: Model) {
		this.app.post(`/${endpoint}`, (req: Request, res: Response, next: NextFunction) => {
			// console.log('[registerCreateRoute] body', req.body);

			const { success, errors, message } = this.validator.createOperationValidation(model, req.body);

			if (!success) return res.status(400).json({ message, errors, status: 400 });

			this.dbInstance
				.create(modelName, model, req.body)
				.then((createdEntity) => {
					res.status(201).json(createdEntity);
				})
				.catch((err) => next(err));
		});
	}

	private registerGetByIdRoute(modelName: string, endpoint: string) {
		this.app.get(`/${endpoint}/:id`, (req: Request, res: Response, next: NextFunction) => {
			this.dbInstance
				.findById(modelName, req.params.id)
				.then((entities) => res.json(entities))
				.catch((err) => next(err));
		});
	}

	private registerGetRoute(modelName: string, endpoint: string) {
		this.app.get(`/${endpoint}`, (req: Request, res: Response, next: NextFunction) => {
			this.dbInstance
				.findAll(modelName, req.query)
				.then((entities) => res.json(entities))
				.catch((err) => next(err));
		});
	}

	private registerDeleteRoute(modelName: string, endpoint: string) {
		this.app.delete(`/${endpoint}`, (req: Request, res: Response, next: NextFunction) => {
			this.dbInstance
				.delete(modelName, req.query)
				.then((servRes) => res.json(servRes))
				.catch((err) => next(err));
		});
	}

	private registerDeleteByIdRoute(modelName: string, endpoint: string) {
		this.app.delete(`/${endpoint}/:id`, (req: Request, res: Response, next: NextFunction) => {
			this.dbInstance
				.deleteById(modelName, req.params.id)
				.then((servRes) => res.json(servRes))
				.catch((err) => next(err));
		});
	}

	private registerUpdateByIdRoutes(modelName: string, endpoint: string, model: Model) {
		this.app.put(`/${endpoint}/:id`, (req: Request, res: Response, next: NextFunction) => {
			const { success, errors, message } = this.validator.updateOperationValidation(model, req.body);
			if (!success) {
				return res.status(400).json({ status: 400, message, errors });
			}

			this.dbInstance
				.updateById(modelName, req.params.id, req.body, model['timestamps'] ?? false)
				.then((updatedEntity) => res.json(updatedEntity))
				.catch((err) => next(err));
		});
	}

	private registerUpdateRoute(modelName: string, endpoint: string, model: Model) {
		this.app.put(`/${endpoint}`, (req: Request, res: Response, next: NextFunction) => {
			const { success, errors, message } = this.validator.updateOperationValidation(model, req.body);
			if (!success) {
				return res.status(400).json({ status: 400, message, errors });
			}

			this.dbInstance
				.update(modelName, req.body, model['timestamps'] ?? false, req.query)
				.then((updatedEntities) => res.json(updatedEntities))
				.catch((err) => next(err));
		});
	}

	private registerEndpoint(route: DefaultRoutes, modelName: string, endpoint: string, model: Model) {
		if (route === DefaultRoutes.ALL) Logger.ok(`Registered all routes`, '\t');
		else Logger.ok(`Registered endpoint ${route}`, '\t');

		switch (route) {
			case DefaultRoutes.ALL:
				this.registerCreateRoute(modelName, endpoint, model);
				this.registerGetByIdRoute(modelName, endpoint);
				this.registerGetRoute(modelName, endpoint);
				this.registerUpdateRoute(modelName, endpoint, model);
				this.registerUpdateByIdRoutes(modelName, endpoint, model);
				this.registerDeleteByIdRoute(modelName, endpoint);
				this.registerDeleteRoute(modelName, endpoint);
				break;

			case DefaultRoutes.CREATE:
				this.registerCreateRoute(modelName, endpoint, model);
				break;

			case DefaultRoutes.GET_BY_ID:
				this.registerGetByIdRoute(modelName, endpoint);
				break;

			case DefaultRoutes.GET:
				this.registerGetRoute(modelName, endpoint);
				break;

			case DefaultRoutes.UPDATE:
				this.registerUpdateRoute(modelName, endpoint, model);
				break;

			case DefaultRoutes.UPDATE_BY_ID:
				this.registerUpdateByIdRoutes(modelName, endpoint, model);
				break;

			case DefaultRoutes.DELETE_BY_ID:
				this.registerDeleteByIdRoute(modelName, endpoint);
				break;

			case DefaultRoutes.DELETE:
				this.registerDeleteRoute(modelName, endpoint);
				break;

			default:
		}
	}
}
