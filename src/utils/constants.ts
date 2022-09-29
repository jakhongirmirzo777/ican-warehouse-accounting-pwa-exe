export const TOKEN_KEY = 'Authorization'
export const EXPIRE_KEY = 'Expire'
export const APP_LANG_KEY = 'Lang'
export const NOTIFICATION_DEFAULT_DELAY = 2000

export const ROLES = {
  SUPER_ADMIN: 'superAdmin',
  ORGANISATION: 'organisation',
  EMPLOYER: 'employer',
}

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

export const MINI_MENU_MEDIA_WIDTH = 750
