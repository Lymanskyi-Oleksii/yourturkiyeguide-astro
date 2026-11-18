// Назва бренду і контакти — єдине місце, звідки їх беруть шапка, футер,
// кнопки зв'язку й заголовки сторінок (пункти 4.2 і 6.3 плану).
// Змінився номер чи посилання — правити тільки тут.
export const SITE_NAME = 'TravelsTurkey';

export const SITE = {
    name: SITE_NAME,
    guide: 'Фырат Динлер',
    phone: '+905443266871',
    phoneDisplay: '+90 544 326 6871',
    email: 'firatdicle_47@hotmail.com',
    telegram: 'https://t.me/+905443266871',
    // Посилання лишені в тому вигляді, в якому вони працювали на сайті
    whatsapp: 'https://wa.me/+905443266871',
    viber: 'viber://chat?number=+905443266871',
    instagram: 'https://www.instagram.com/tourkey_travels',
    facebook: 'https://www.facebook.com/firat.n.dinler',
} as const;

// Посилання WhatsApp із готовим текстом повідомлення
export function whatsappLink(text?: string): string {
    return text ? `${SITE.whatsapp}?text=${text}` : SITE.whatsapp;
}
