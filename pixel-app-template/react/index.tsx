import { canUseDOM } from 'vtex.render-runtime'

import type { PixelMessage } from './typings/events'

export function handleEvents(e: PixelMessage) {
  console.info(e);
  switch (e.data.eventName) {
    case 'vtex:pageView': {
      break
    }
    case 'vtex:orderPlaced': {
      console.info("ORDER PLACED");
      break
    }

    default: {
      break
    }
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
