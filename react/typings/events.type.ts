import {
  AddToCartData,
  CategoryViewData,
  OrderPlacedData,
  ProductViewData,
} from '../../types/events.type';

export interface PixelMessage extends MessageEvent {
  data: ProductViewData | AddToCartData | OrderPlacedData | CategoryViewData;
}

export {
  ProductViewData,
  AddToCartData,
  OrderPlacedData,
  CategoryViewData,
} from '../../types/events.type';
