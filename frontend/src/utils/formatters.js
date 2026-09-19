export const formatPrice = (price) => {
  if (price == null) return '';
  return Number(price).toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }) + ' ₺';
};

export const formatPhoneNumber = (value) => {
  if (!value) return value;

  // Sadece rakamları tut
  let digits = value.replace(/[^\d]/g, '');

  // Eğer 0 ile başlıyorsa, 0'ı atla (her zaman 5 ile başlaması istendiği için)
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // Maksimum 10 haneli olabilir (5XX XXX XX XX)
  digits = digits.substring(0, 10);

  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 8) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
};
