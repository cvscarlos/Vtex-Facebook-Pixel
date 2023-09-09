export interface EventData {
  event: string;
  eventName: string;
  currency: string;
}

export interface AddToCartData extends EventData {
  event: 'addToCart';
  eventName: 'vtex:addToCart';
  items: AddToCartProduct[];
}

export interface OrderPlacedData extends Order, EventData {
  event: 'orderPlaced';
  eventName: 'vtex:orderPlacedTracked' | 'vtex:orderPlaced';
}

export interface ProductViewData extends EventData {
  event: 'productView';
  eventName: 'vtex:productView';
  product: Product;
}

interface Order {
  currency: string;
  accountName: string;
  orderGroup: string;
  salesChannel: string;
  coupon: string;
  visitorType: string;
  visitorContactInfo: string[];
  visitorContactPhone: string;
  transactionId: string;
  transactionDate: string;
  transactionAffiliation: string;
  transactionTotal: number;
  transactionShipping: number;
  transactionTax: number;
  transactionCurrency: string;
  transactionPaymentType: PaymentType[];
  transactionShippingMethod: ShippingMethod[];
  transactionProducts: ProductOrder[];
  transactionPayment: {
    id: string;
  };
}

interface PaymentType {
  group: string;
  paymentSystemName: string;
  installments: number;
  value: number;
}

interface ShippingMethod {
  itemId: string;
  selectedSla: string;
}

interface ProductOrder {
  id: string;
  name: string;
  sku: string;
  skuRefId: string;
  skuName: string;
  brand: string;
  brandId: string;
  seller: string;
  sellerId: string;
  category: string;
  categoryId: string;
  categoryTree: string[];
  categoryIdTree: string[];
  originalPrice: number;
  price: number;
  sellingPrice: number;
  tax: number;
  quantity: number;
  components: any[];
  measurementUnit: string;
  unitMultiplier: number;
}

interface Product {
  brand: string;
  categoryId?: string;
  categories: string[];
  productId: string;
  productName: string;
  selectedSku?: string;
  items: Sku[];
  [key: string]: any;
}

interface Sku {
  itemId: string;
  name: string;
  sellers?: {
    commertialOffer: {
      Price: number;
      [key: string]: any;
    };
    AvailableQuantity: number;
    [key: string]: any;
  };
}

interface AddToCartProduct {
  brand: string;
  name: string;
  price: number;
  quantity: number;
  skuId: string;
  variant: string;
}
