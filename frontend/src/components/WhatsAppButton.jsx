import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = "905060617553";
  const message = "Merhaba, Neta Oto Market ürünleri hakkında bilgi almak istiyorum.";
  const encodedMessage = encodeURIComponent(message);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      title="WhatsApp ile Bize Ulaşın"
    >
      <MessageCircle size={32} color="#ffffff" />
    </a>
  );
};

export default WhatsAppButton;
