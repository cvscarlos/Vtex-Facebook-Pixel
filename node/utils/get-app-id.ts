export function getAppId(): string {
	const app = process.env.VTEX_APP_ID;
	const [appName] = String(app).split('@');
	return appName;
}
