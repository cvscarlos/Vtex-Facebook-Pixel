import FacebookGraph from './facebook-graph';

const mockHttpPost = jest.fn();
jest.mock('@vtex/api', () => ({
	ExternalClient: class A {
		public http = {
			post: mockHttpPost,
		};

		public context = {
			account: 'mock-account',
		};
	},
}));

jest.mock('../utils/get-app-id');

describe('FacebookGraph', () => {
	const mockIOContext: any = {};

	const mockGetAppSettings = jest.fn().mockResolvedValue({
		pixelId: 'pixel-id-123',
		conversionApiAccessToken: 'access-token-456',
	});
	const mockContext: any = {
		clients: { apps: { getAppSettings: mockGetAppSettings } },
	};

	const mockEvent: any = { event_name: 'PageView' };

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should throw an error if app settings are missing', async () => {
		const facebookGraph = new FacebookGraph(mockIOContext);

		mockGetAppSettings.mockResolvedValueOnce({});

		await expect(
			facebookGraph.getEvent(mockEvent, mockContext)
		).rejects.toThrow('Missing pixelId');
	});

	it('should make a POST request to Facebook Graph API', async () => {
		const facebookGraph = new FacebookGraph(mockIOContext);

		await facebookGraph.getEvent(mockEvent, mockContext);

		expect(mockHttpPost).toBeCalledTimes(1);
		expect(mockHttpPost).toBeCalledWith(
			'v17.0/pixel-id-123/events',
			{ data: [{ event_name: 'PageView' }] },
			{
				params: { access_token: 'access-token-456' },
				metric: 'mock-account-_facebook-graph_event-POST',
			}
		);
	});
});
