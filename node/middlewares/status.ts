export async function status(context: Context, next: () => Promise<any>) {
  const {
    state: { code },
    clients: { status: statusClient },
  } = context;

  console.info('Received code:', code);

  const statusResponse = await statusClient.getStatus(code);

  console.info('Status response:', statusResponse);

  const {
    headers,
    data,
    status: responseStatus,
  } = await statusClient.getStatusWithHeaders(code);

  console.info('Status headers', headers);
  console.info('Status data:', data);

  context.status = responseStatus;
  context.body = data;
  context.set('Cache-Control', headers['cache-control']);

  await next();
}
