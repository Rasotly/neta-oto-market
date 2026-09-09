export const formatPrice = (price) => {
  if (price == null) return '';
  return Number(price).toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }) + ' ₺';
};
