import { createServer, CrudRoutes, DataTypes, createServerWithTemplate } from '../src/index';
import { ConfigOptions } from '../src/types';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
// import kill from 'cross-port-killer';

describe('Creating the Server', () => {
	const response = {
		name: 'Awesome Rest',
		description: 'A highly configurable 📝, feature packed 💥 and awesome 😎🔥 fake rest api server.',
		docs: 'LINK_TO_DOCS',
	};

	describe(' with custom config', () => {
		const config: ConfigOptions = {
			db: {
				removeExisting: true,
			},
			models: {
				User: {
					schema: {
						name: DataTypes.String,
					},
					routes: [CrudRoutes.ALL],
					timestamps: true,
				},
			},
		};


		afterEach(() => {
			// Deleting Db File
			fs.unlinkSync(path.resolve('immitate.db.json'));
		});

		test('using js object', async () => {
			await createServer({ port: 5001, ...config });
			const res = await axios.get('http://localhost:5001/');
			const data = res.data;
			expect(data).toStrictEqual(response);
		});

		test('using JSON cofig file', async () => {
			const configFilePath = path.resolve(__dirname, 'config.json');
			// Creating Config File
			fs.writeFileSync(configFilePath, JSON.stringify({ port: 5002, ...config }));
			// Starting the server
			await createServer(configFilePath);
			// Creating a request
			const res = await axios.get(`http://localhost:5002/`);
			const data = res.data;
			expect(data).toStrictEqual(response);
			// Deleting config file
			fs.unlinkSync(configFilePath);
		});
	});

});
