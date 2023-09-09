import {
  PixelMessage,
  ProductViewData,
  OrderPlacedData,
  AddToCartData,
} from './typings/events.type';

function productView(data: ProductViewData) {
  const {
    product,
    currency,
    product: { productName, items, categories },
  } = data;

  fbq('track', 'ViewContent', {
    content_ids: items.map(({ itemId }) => itemId),
    content_name: productName,
    content_type: 'product',
    currency,
    content_category: categories.map((c) => c.replace(/\//g, '')).join('/'),
    value: product.items[0]?.sellers?.[0].commertialOffer.Price,
  });
}

function addToCart(data: AddToCartData) {
  const { items, currency } = data;

  fbq('track', 'AddToCart', {
    value:
      items.reduce((accumulator, item) => accumulator + item.price, 0) / 100,
    content_ids: items.map((sku) => sku.skuId),
    contents: items.map((sku) => ({
      id: sku.skuId,
      quantity: sku.quantity,
      item_price: sku.price / 100,
    })),
    content_type: 'product',
    currency,
  });
}

async function orderPlaced(data: OrderPlacedData) {
  const payload = {
    eventData: data,
    userAgent: navigator.userAgent,
    pageUrl: window.location.href,
  };
  await fetch('/_cvs-rep/order-placed', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function handleMessages(event: PixelMessage) {
  try {
    switch (event.data.eventName) {
      case 'vtex:productView': {
        productView(event.data);
        break;
      }
      case 'vtex:addToCart': {
        addToCart(event.data);
        break;
      }
      case 'vtex:orderPlaced':
      case 'vtex:orderPlacedTracked': {
        await orderPlaced(event.data);
        break;
      }
      default: {
        break;
      }
    }
  } catch (error) {
    console.error('cvs-facebook-pixel', error);
  }
}

window.addEventListener('message', handleMessages);
