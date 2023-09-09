import { createHash } from 'crypto';

import { json } from 'co-body';

import { OrderPlacedData } from '../typings/events.type';

type Payload = {
  userAgent: string;
  pageUrl: string;
  eventData: OrderPlacedData;
};

export async function reportOrderPlaced(
  context: Context,
  next: () => Promise<any>,
) {
  const {
    clients: { facebookGraphHttp },
    cookies,
    req,
  } = context;

  const bodyPayload = (await json(req)) as any;
  if (!isPayload(bodyPayload)) throw new Error('Invalid payload');

  const { userAgent, pageUrl, eventData } = bodyPayload;

  const email = eventData.visitorContactInfo[0];
  const phone = eventData.visitorContactPhone;
  const purchaseDateInSeconds = Math.floor(
    new Date(eventData.transactionDate).getTime() / 1000,
  );

  const ipHeader = req.headers['x-forwarded-for'];
  const ipHeaderString = Array.isArray(ipHeader) ? ipHeader[0] : ipHeader;
  const ip = (ipHeaderString?.split(',').shift() || '').trim();

  const fbPurchaseEvent = {
    event_name: 'Purchase',
    event_id: eventData.transactionId,
    event_source_url: pageUrl,
    event_time: purchaseDateInSeconds,
    action_source: 'website',
    user_data: {
      client_ip_address: ip,
      client_user_agent: userAgent,
      em: [stringToSHA256(email)],
      ph: [stringToSHA256(phone)],
      fbc: cookies.get('_fbc'),
      fbp: cookies.get('_fbp'),
    },
    custom_data: {
      value: eventData.transactionTotal,
      currency: eventData.transactionCurrency,
      contents: eventData.transactionProducts.map((product) => ({
        id: product.sku,
        quantity: product.quantity,
        item_price: product.sellingPrice,
      })),
    },
  };

  const fbEventRequest = await facebookGraphHttp.getEvent(
    fbPurchaseEvent,
    context,
  );

  context.body = { fbEventRequest, fbPurchaseEvent };

  await next();
}

function stringToSHA256(string_: string): string {
  const standardizedEmail = string_.toLowerCase();
  const sha256 = createHash('sha256');
  sha256.update(standardizedEmail);
  return sha256.digest('hex');
}

function isPayload(payload: any): payload is Payload {
  return (
    typeof payload === 'object' &&
    typeof payload.userAgent === 'string' &&
    typeof payload.pageUrl === 'string' &&
    typeof payload.eventData === 'object'
  );
}
