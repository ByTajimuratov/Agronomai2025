
import { AppLanguage } from '../types';

export const formatCurrency = (amount: number, language: AppLanguage): string => {
  let locale = 'en-US';
  let currency = 'UZS';

  switch (language) {
    case AppLanguage.UZ:
      locale = 'uz-UZ';
      break;
    case AppLanguage.RU:
      locale = 'ru-RU';
      break;
    default:
      locale = 'en-US';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: number | Date, language: AppLanguage): string => {
  let locale = 'en-US';

  switch (language) {
    case AppLanguage.UZ:
      locale = 'uz-UZ';
      break;
    case AppLanguage.RU:
      locale = 'ru-RU';
      break;
    default:
      locale = 'en-US';
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};
