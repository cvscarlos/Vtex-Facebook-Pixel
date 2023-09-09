import type { InstanceOptions, IOContext } from '@vtex/api';
import { ExternalClient } from '@vtex/api';

import { getAppId } from '../utils/get-app-id';

export default class FacebookGraph extends ExternalClient {
  constructor(ioContext: IOContext, options?: InstanceOptions) {
    super('https://graph.facebook.com', ioContext, options);
  }

  public async getEvent(
    eventData: Record<string, unknown>,
    context: Context,
  ): Promise<unknown> {
    const settings = await context.clients.apps.getAppSettings(getAppId());
    const pixelId = settings.pixelId?.toString().trim();
    const accessToken = settings.conversionApiAccessToken?.toString().trim();

    if (!pixelId) throw new Error('Missing pixelId');
    if (!accessToken) throw new Error('Missing accessToken');

    return this.http.post(
      `v17.0/${pixelId}/events`,
      { data: [eventData] },
      {
        params: { access_token: accessToken },
        metric: `${this.context.account}-_facebook-graph_event-POST`,
      },
    );
  }
}
