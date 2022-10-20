import { canUseDOM } from 'vtex.render-runtime';
import type { PixelMessage } from './typings/events';

interface VTEXProductItem {
  skuRefId: string
  name: string
  quantity: number
  sellingPrice: number
}

interface PreezieProductItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export function handleEventsv2(e: PixelMessage) {
  const eventName = e.data.eventName;

  if (!eventName) return;
  // console.log(eventName);

  switch (eventName) {
    case 'vtex:pageView': {
      break
    }
    case 'vtex:orderPlaced': {
      parseCartData(e.data);
      break
    }

    default: {
      break
    }
  }
}

export function parseCartData(data: any) {
  console.log("Building Preezie Data");
  const productsFromOrder = data.transactionProducts;

  const preezieProducts: Array<PreezieProductItem> = [];

  productsFromOrder.forEach((item: VTEXProductItem) => {
    const productId = item.skuRefId;
    const productName = item.name;
    const quantity = item.quantity;
    const price = item.sellingPrice;

    const tempItem: PreezieProductItem = {
      productId,
      productName,
      quantity,
      price
    };

    preezieProducts.push(tempItem);
  });

  const stringedProducts = JSON.stringify(preezieProducts);

  buildTrackingScript(stringedProducts);
}

const buildTrackingScript = (products: string) => {
  if (!canUseDOM) return;

  const headElement: Element = document.getElementsByTagName("head")[0];
  const scriptElement = document.createElement("script");
  const preezieFunction = `prz("event", "transaction", '{"products": ${products}}');`;

  scriptElement.innerHTML = preezieFunction;
  headElement.appendChild(scriptElement);
}

if (canUseDOM) {
  window.addEventListener('message', handleEventsv2);
}
