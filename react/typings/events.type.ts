import {
  AddToCartData,
  OrderPlacedData,
  ProductViewData,
} from '../../types/events.type';

export interface PixelMessage extends MessageEvent {
  data: ProductViewData | AddToCartData | OrderPlacedData;
}

export {
  ProductViewData,
  AddToCartData,
  OrderPlacedData,
} from '../../types/events.type';
