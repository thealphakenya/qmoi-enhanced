import { sendWhatsApp } from './qmoi_notifier';
 
sendWhatsApp('QMOI WhatsApp test: System is operational!')
  .then(() => console.log('WhatsApp test sent!'))
  .catch(console.error); 