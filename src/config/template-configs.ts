import { DefaultRoutes, DataType } from '../types'

export const ECommConfig = {
	db: {
		removeExisting: true,
	},
	models: {
		User: {
			schema: {
				name: {
					type: DataType.String,
					required: true,
				},
				email: {
					type: DataType.String,
					required: true,
					isEmail: true,
				},
				password: {
					type: DataType.String,
					required: true,
					range: {
						from: 8,
						to: 16,
						inclusive: true,
					},
				},
				phone: DataType.Integer,
				address: {
					street: DataType.String,
					houseNumber: DataType.String,
					city: DataType.String,
					zipCode: DataType.Integer,
				},
			},
			timestamps: true,
			routes: [DefaultRoutes.ALL],
		},
		Product: {
			schema: {
				title: {
					type: DataType.String,
					required: true,
				},
				description: {
					type: DataType.String,
					lte: 700,
				},
				price: {
					type: DataType.Decimal,
					required: true,
					gte: 0.0,
				},
			},
			timestamps: true,
			routes: [DefaultRoutes.ALL],
		},
		Orders: {
			schema: {
				userId: {
					type: DataType.String,
					required: true,
				},
				productId: {
					type: DataType.String,
					required: true,
				},
			},
			routes: [DefaultRoutes.ALL],
			timestamps: true,
		},
	},
};

export const SocialMediaConfig = {
	models: {
		User: {
			schema: {
				name: {
					type: DataType.String,
					required: true,
				},
				username: DataType.String,
				email: {
					type: DataType.String,
					required: true,
					isEmail: true,
				},
				password: {
					type: DataType.String,
					required: true,
					range: {
						from: 8,
						to: 16,
						inclusive: true,
					},
				},
				phone: DataType.Integer,
			},
			timestamps: true,
			routes: [DefaultRoutes.ALL],
		},
		Post: {
			schema: {
				title: {
					type: DataType.String,
					required: true,
					lte: 150,
				},
				description: {
					type: DataType.String,
					lte: 750,
				},
				likes: {
					type: DataType.Integer,
					default: 0,
					gte: 0,
				},
				shares: {
					type: DataType.Integer,
					default: 0,
					gte: 0,
				},
				userId: {
					type: DataType.String,
					required: true,
				},
			},
			routes: [DefaultRoutes.ALL],
			timestamps: true,
		},
		Comment: {
			schema: {
				schema: {
					title: {
						type: DataType.String,
						required: true,
					},
					postId: {
						type: DataType.String,
						required: true,
					},
					upvotes: {
						type: DataType.Integer,
						default: 0,
						gte: 0,
					},
					downvotes: {
						type: DataType.Integer,
						default: 0,
						gte: 0,
					},
				},
			},
			routes: [DefaultRoutes.ALL],
			timetsmaps: true,
		},
	},
};
