import {
	ProductViewData,
	OrderPlacedData,
	AddToCartData,
	DepartmentInfo,
	PageInfoData,
	DepartmentViewData,
	CategoryViewData,
	PAGE_INFO,
	DEPARTAMENT,
	CATEGORY,
	SEARCH,
	InternalSiteSearchViewData,
	SearchInfo,
	PageViewData,
} from '../types/events.type';

type PixelData =
	| PageViewData
	| ProductViewData
	| AddToCartData
	| OrderPlacedData
	| DepartmentInfo
	| SearchInfo;

function singleFbq(
	eventName: string,
	eventData: Record<string, unknown>,
	options?: { eventID?: string }
) {
	const pixelId = window.cvsAppSettings?.pixelId || '---';
	fbq('trackSingle', pixelId, eventName, eventData, options);
}

function singleFbqCustom(
	eventName: string,
	eventData: Record<string, unknown>
) {
	const pixelId = window.cvsAppSettings?.pixelId || '---';
	fbq('trackSingleCustom', pixelId, eventName, eventData);
}

function pageView() {
	singleFbq('PageView', {});
}

function productView(data: ProductViewData) {
	const {
		product,
		currency,
		product: { productName, items, categories },
	} = data;

	singleFbq('ViewContent', {
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

	singleFbq('AddToCart', {
		value:
			items.reduce((accumulator, item) => accumulator + item.price, 0) /
			100,
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

function viewCategory(data: DepartmentInfo) {
	const { currency, products } = data.departmentData;
	const { department, category } = data.pageInfo;

	const contentIds = products.flatMap((p) => p.items.map((i) => i.itemId));
	const categoryName = category?.name
		? `${department.name}/${category.name}`
		: department.name;

	singleFbq('ViewContent', {
		content_type: 'product_group',
		content_category: categoryName,
		content_ids: [...contentIds],
		currency,
	});

	singleFbqCustom('CategoryView', {
		content_type: 'category',
		content_category: categoryName,
		content_ids: [...contentIds],
		currency,
	});
}

function search(data: SearchInfo) {
	const { currency, products } = data.searchView;
	const { search } = data.pageInfo;

	const contentIds = products.flatMap((p) => p.items.map((i) => i.itemId));

	singleFbq('Search', {
		content_type: 'product_group',
		content_ids: [...contentIds],
		search_string: search.term || '---',
		currency,
	});
}

async function orderPlaced(data: OrderPlacedData) {
	const {
		transactionCurrency,
		transactionId,
		transactionTotal,
		transactionProducts,
	} = data;
	const jsEventData = {
		currency: transactionCurrency,
		value: transactionTotal,
		contents: transactionProducts.map((product) => ({
			id: product.sku,
			quantity: product.quantity,
			item_price: product.sellingPrice,
		})),
	};
	singleFbq('Purchase', jsEventData, { eventID: transactionId });

	const payload = {
		eventData: data,
		userAgent: navigator.userAgent,
		pageUrl: window.location.href,
	};
	await fetch('/_cvs-rep/order-placed', {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: { 'Content-Type': 'application/json' },
	});
}

const eventsCache: Record<string, PixelData> = {};

function createDepartmentInfoEvent() {
	const pageInfo = eventsCache['vtex:pageInfo'] as unknown as PageInfoData;
	const departmentView = eventsCache[
		DEPARTAMENT
	] as unknown as DepartmentViewData;
	const categoryView = eventsCache[CATEGORY] as unknown as CategoryViewData;
	const departmentData = departmentView || categoryView;

	const combinedEvent: DepartmentInfo = {
		eventName: 'cvs:departmentInfo',
		departmentData,
		pageInfo,
	};

	delete eventsCache[DEPARTAMENT];
	delete eventsCache[CATEGORY];
	delete eventsCache[PAGE_INFO];

	return combinedEvent;
}

function createSearchInfoEvent() {
	const pageInfo = eventsCache[PAGE_INFO] as unknown as PageInfoData;
	const searchView = eventsCache[
		SEARCH
	] as unknown as InternalSiteSearchViewData;

	const combinedEvent: SearchInfo = {
		eventName: 'cvs:searchInfo',
		searchView,
		pageInfo,
	};

	delete eventsCache[SEARCH];
	delete eventsCache[PAGE_INFO];

	return combinedEvent;
}

function getCombinedEvents(): PixelData | undefined {
	const isDepartmentInfo =
		eventsCache[PAGE_INFO] &&
		(eventsCache[DEPARTAMENT] || eventsCache[CATEGORY]);
	if (isDepartmentInfo) return createDepartmentInfoEvent();

	const isSearchInfo = eventsCache[PAGE_INFO] && eventsCache[SEARCH];
	if (isSearchInfo) return createSearchInfoEvent();

	return undefined;
}

async function handleEvent(eventData: PixelData) {
	switch (eventData.eventName) {
		case 'vtex:pageView': {
			pageView();
			break;
		}
		case 'vtex:productView': {
			productView(eventData);
			break;
		}
		case 'vtex:addToCart': {
			addToCart(eventData);
			break;
		}
		case 'cvs:departmentInfo': {
			viewCategory(eventData);
			break;
		}
		case 'cvs:searchInfo': {
			search(eventData);
			break;
		}
		case 'vtex:orderPlaced':
		case 'vtex:orderPlacedTracked': {
			await orderPlaced(eventData);
			break;
		}
		default: {
			break;
		}
	}
}

type EventPixel = { data: PixelData };
function isPixelData(event: any): event is EventPixel {
	const eventName = event?.data?.eventName;
	return (
		eventName &&
		(eventName.startsWith('vtex:') || eventName.startsWith('cvs:'))
	);
}

async function handleMessage(event: EventPixel) {
	const eventData = event.data;
	eventsCache[eventData.eventName] = eventData;

	const combinedEvent = getCombinedEvents();
	await (combinedEvent ? handleEvent(combinedEvent) : handleEvent(eventData));
}

let isAppReady = false;
const messagesCache: EventPixel[] = [];
function consumeMessageFromCache() {
	if (messagesCache.length === 0) return;
	if (!isAppReady) return;

	const message = messagesCache.shift();
	if (!message) return;
	handleMessage(message);

	consumeMessageFromCache();
}
function listingMessage(event: any) {
	try {
		if (event.data === 'cvsAppSettingsReady' || window.cvsAppSettings)
			isAppReady = true;

		if (!isPixelData(event)) {
			return;
		}

		messagesCache.push(event);
		consumeMessageFromCache();
	} catch (error) {
		console.warn('cvs-facebook-pixel - ERROR', error);
	}
}

// FB Helper: https://developers.facebook.com/docs/marketing-api/conversions-api/payload-helper
// FB event reference: https://developers.facebook.com/docs/meta-pixel/reference
window.addEventListener('message', listingMessage);
