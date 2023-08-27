import { IOClients } from '@vtex/api';

import FacebookGraph from './facebook-graph';

export class Clients extends IOClients {
  public get facebookGraphHttp() {
    return this.getOrSet('FacebookGraph_', FacebookGraph);
  }
}
