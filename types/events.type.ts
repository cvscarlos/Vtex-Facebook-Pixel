export const CATEGORY = 'vtex:categoryView';
export const DEPARTAMENT = 'vtex:departmentView';
export const PAGE_INFO = 'vtex:pageInfo';

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

export interface PageInfoData extends EventData {
  eventName: typeof PAGE_INFO;
  event: 'pageInfo';
  eventType: 'departmentView';

  category?: { id: string; name: string };
  department: { id: string; name: string };

  // accountName: string;
  // pageTitle: string;
  // pageUrl: string;
  // orderBy: string;
  // appliedFilters: { name: string }[];
  // search: {
  //   category: { id: string; name: string };
  //   results: number;
  //   operator: string;
  //   searchState: any;
  // };
}

export interface ProductViewData extends EventData {
  event: 'productView';
  eventName: 'vtex:productView';
  product: Product;
}

export interface CategoryViewData extends EventData {
  event: 'categoryView';
  eventName: typeof CATEGORY;
  products: Product[];
}

export interface DepartmentViewData extends EventData {
  event: 'departmentView';
  eventName: typeof DEPARTAMENT;
  products: Product[];
}

export interface DepartmentInfo {
  eventName: 'cvs:departmentInfo';
  departmentData: DepartmentViewData | CategoryViewData;
  pageInfo: PageInfoData;
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
  transactionPayment: { id: string };
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
  category: string;
  productId: string;
}
