import { createServer, CrudRoutes, DataTypes } from '../src/index';
import { ConfigOptions } from '../src/types';
import axios from 'axios';

describe('Creating the Server', () => {
	const response = {
		name: 'Awesome Rest',
		description: 'A highly configurable 📝, feature packed 💥 and awesome 😎🔥 fake rest api server.',
		docs: 'LINK_TO_DOCS',
	};

	test('Using JS Object', async () => {
		const config: ConfigOptions = {
			port: 5050,
			db: {
        name: 'using-object.db.json',
				removeExisting: true,
			},
			models: {
				User: {
					schema: {
						name: DataTypes.String,
					},
					includeTimestamps: true,
				},
			},
			routes: [
				{
					resource: 'user',
					model: 'User',
					routes: [CrudRoutes.ALL],
				},
			],
		};

		await createServer(config);

		const res = await axios.get('http://localhost:5050/');
		const data = res.data;

		expect(data).toStrictEqual(response);
	});

	test('Using Config JSON File', async () => {
		await createServer('./config.json');
		const res = await axios.get('http://localhost:5050/');
		const data = res.data;
		expect(data).toStrictEqual(response);
	});

	afterAll((done) => done());
});
