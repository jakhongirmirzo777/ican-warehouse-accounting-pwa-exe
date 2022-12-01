export const TOKEN_KEY = 'Authorization'
export const EXPIRE_KEY = 'Expire'
export const APP_LANG_KEY = 'Lang'
export const NOTIFICATION_DEFAULT_DELAY = 2000
export const MINI_MENU_MEDIA_WIDTH = 750

export const THEME = {
  key: 'Theme',
  LIGHT: 'light',
  DARK: 'dark',
}

export const ROLES = {
  SUPER_ADMIN: 'superAdmin',
  ORGANISATION: 'organisation',
  EMPLOYER: 'employer',
}

export const POSITIONS = {
  BUYER: 'buyer',
  SELLER: 'seller',
}

export const POSITIONS_INDEXED = Object.entries(POSITIONS).reduce(
  (acc: Array<Record<string, string | number>>, [_, val]) => {
    return [
      ...acc,
      {
        text: val,
        value: val,
      },
    ]
  },
  []
)

export const NOTIFICATION_TYPES: Record<
  string,
  'success' | 'error' | 'warning'
> = {
  SUCCESS_TYPE: 'success',
  ERROR_TYPE: 'error',
  WARNING_TYPE: 'warning',
}

export const MKO_STATUSES = {
  '10': 'active',
  '0': 'notActive',
}

export const MKO_STATUSES_COLORED = {
  '10': {
    theme: 'rgba(40, 180, 70, 0.24)',
    color: '#28B446',
  },
  '0': {
    theme: 'rgba(255,32,144,0.24)',
    color: '#FF2090',
  },
}

export const MKO_STATUSES_INDEXED = Object.entries(MKO_STATUSES).reduce(
  (acc: Array<Record<string, string | number>>, [key, val]) => {
    return [
      ...acc,
      {
        text: val,
        value: +key,
      },
    ]
  },
  []
)

export const PRICE_CHANGE = {
  '1': 'priceChangeNew',
  '2': 'priceChangeOld',
  '3': 'priceChangeMean',
}

export const PRICE_CHANGE_INDEXED = Object.entries(PRICE_CHANGE).reduce(
  (acc: Array<Record<string, string | number>>, [key, val]) => {
    return [
      ...acc,
      {
        text: val,
        value: +key,
      },
    ]
  },
  []
)

export const LOCATIONS_STATUSES = {
  0: {
    title: 'notActive',
    color: 'danger',
    confirmTitle: 'activate',
  },
  10: {
    title: 'active',
    color: 'success',
    confirmTitle: 'doNotActivate',
  },
}

export const TRANSACTION_TYPES = {
  debit: 'debit',
  credit: 'credit',
  other: 'other',
}

export const TRANSACTION_TYPES_INDEXED = Object.entries(
  TRANSACTION_TYPES
).reduce((acc: Array<Record<string, string | number>>, [key, val]) => {
  return [
    ...acc,
    {
      text: val,
      value: key,
    },
  ]
}, [])

export const PAYMENT_TYPES = {
  myuzcard: 'myuzcard',
  cash: 'cash',
  terminal: 'terminal',
  bank: 'bankAccount',
  card: 'card',
  system: 'system',
  discount: 'discount',
}

export const PAYMENT_TYPES_INDEXED = Object.entries(PAYMENT_TYPES).reduce(
  (acc: Array<Record<string, string | number>>, [key, val]) => {
    return [
      ...acc,
      {
        text: val,
        value: key,
      },
    ]
  },
  []
)

export const PAYMENT_STATUSES = {
  '10': 'success',
  '0': 'error',
  '5': 'pending',
  '3': 'canceled',
}

export const PAYMENT_STATUSES_VALUE = {
  SUCCESS: 10,
  ERROR: 0,
  PENDING: 5,
  CANCELED: 3,
}

export const PAYMENT_STATUSES_COLORED = {
  '10': {
    theme: 'rgba(40, 180, 70, 0.24)',
    color: '#28B446',
  },
  '0': {
    theme: 'rgba(255,32,144,0.24)',
    color: '#FF2090',
  },
  '5': {
    theme: 'rgba(23,189,192,0.24)',
    color: '#17BDC0',
  },
  '3': {
    theme: 'rgba(230,168,18,0.24)',
    color: '#E6A812',
  },
}

export const PAYMENT_STATUSES_INDEXED = Object.entries(PAYMENT_STATUSES).reduce(
  (acc: Array<Record<string, string | number>>, [key, val]) => {
    return [
      ...acc,
      {
        text: val,
        value: +key,
      },
    ]
  },
  []
)

export const USER_STATUS = {
  '10': 'active',
  '0': 'notActive',
}

export const USER_STATUS_VALUE = {
  ACTIVE: 10,
  UN_ACTIVE: 0,
}

export const USER_STATUS_COLORED = {
  '10': {
    theme: 'rgba(40, 180, 70, 0.24)',
    color: '#28B446',
  },
  '0': {
    theme: 'rgba(255,32,144,0.24)',
    color: '#FF2090',
  },
}

export const USER_STATUS_INDEXED = Object.entries(MKO_STATUSES).reduce(
  (acc: Array<Record<string, string | number>>, [key, val]) => {
    return [
      ...acc,
      {
        text: val,
        value: +key,
      },
    ]
  },
  []
)

export const INVENTORY_DOCUMENTS_STATUS = {
  '1': 'new',
  '5': 'canceled',
  '10': 'heldFinRecord',
}

export const INVENTORY_DOCUMENTS_STATUS_INDEXED = Object.entries(
  INVENTORY_DOCUMENTS_STATUS
).reduce((acc: Array<Record<string, string | number>>, [key, val]) => {
  return [
    ...acc,
    {
      text: val,
      value: +key,
    },
  ]
}, [])

export const INVENTORY_DOCUMENTS_STATUS_VALUE = {
  NEW: 1,
  CANCELED: 5,
  HELD: 10,
}

export const INVENTORY_DOCUMENTS_COLORED = {
  '1': {
    theme: 'rgba(40, 180, 70, 0.24)',
    color: '#28B446',
  },
  '10': {
    theme: 'rgba(23,189,192,0.24)',
    color: '#17BDC0',
  },
  '5': {
    theme: 'rgba(255,32,144,0.24)',
    color: '#FF2090',
  },
}

export const PUT_PLACE_INDEXED = [
  {
    text: 'showcase',
    value: 1,
  },
  {
    text: 'warehouse',
    value: 0,
  },
]
