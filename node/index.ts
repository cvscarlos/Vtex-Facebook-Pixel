import type {
  ClientsConfig,
  EventContext,
  RecorderState,
  ServiceContext,
} from '@vtex/api';
import { LRUCache, method, Service } from '@vtex/api';

import { Clients } from './clients';
import { reportOrderPlaced } from './middlewares/pixel-conversion';

const TIMEOUT_MS = 2000;

// Create a LRU memory cache for the Status client.
// The 'max' parameter sets the size of the cache.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
// Note that the response from the API being called must include an 'etag' header
// or a 'cache-control' header with a 'max-age' value. If neither exist, the response will not be cached.
// To force responses to be cached, consider adding the `forceMaxAge` option to your client methods.
const memoryCache = new LRUCache<string, any>({ max: 5000 });
metrics.trackCache('status', memoryCache);

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 3,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: { memoryCache },
  },
};

declare global {
  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    code: number;
  }

  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>; // eslint-disable-line no-unused-vars

  // eslint-disable-next-line no-unused-vars
  interface StatusChangeContext extends EventContext<Clients> {
    body: {
      domain: string;
      orderId: string;
      currentState: string;
      lastState: string;
      currentChangeDate: string;
      lastChangeDate: string;
    };
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    cvsOrderPlaced: method({
      POST: [reportOrderPlaced],
    }),
  },
});
