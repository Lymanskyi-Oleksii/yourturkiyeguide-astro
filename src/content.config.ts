// Колекція турів (пункт 6.1 плану): один файл src/content/tours/<slug>.md на тур.
// Ім'я файлу стає адресою: personalised + hello.md → /excursions/personalised/hello
// Схема перевіряє дані при збиранні: забули поле — збирання впаде з повідомленням, у якому файлі.
//
// Поля з позначкою «HTML» виводяться як є, тож у них можна писати <br> і <span class="highlight">.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const routeItem = z.object({
    image: z.string(),
    alt: z.string(),
    title: z.string(),
    description: z.string(),
});

const tours = defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/tours' }),
    schema: z.object({
        // Розділ сайту і порядок у списку
        section: z.enum(['personalised', 'copyright']),
        order: z.number(),

        // Заголовок вкладки і сторінки, опис для пошуковиків
        title: z.string(),
        description: z.string(),
        // Заголовок у шапці сторінки, якщо відрізняється від title
        heroTitle: z.string().optional(),
        subtitle: z.string(),
        heroImage: z.string(),

        // Картка туру в списках і на головній
        card: z.object({
            title: z.string().optional(), // якщо відрізняється від title
            description: z.string(),
            image: z.string(),
            durationValue: z.string(), // для фільтра тривалості
            durationLabel: z.string(),
            price: z.number(), // для фільтра ціни
            priceLabel: z.string(),
            category: z.string(), // для фільтра тем
        }),

        // Категорія відгуків у Firestore і її підпис у блоці відгуків
        ratingCategory: z.string(),
        reviewsLabel: z.string(),

        // «Что вас ожидает»: підрозділи програми (text — HTML)
        programTitle: z.string().default('Что вас ожидает'),
        program: z.array(z.object({ title: z.string(), text: z.string() })),

        // Карусель маршруту: до програми чи після неї
        route: z.array(routeItem).optional(),
        routePlacement: z.enum(['beforeProgram', 'afterProgram']).default('afterProgram'),

        // Блоки «Организационные детали», «Дополнительные расходы»… (items — HTML)
        info: z.array(z.object({ title: z.string(), items: z.array(z.string()) })),
        meeting: z.object({ title: z.string().default('Место встречи'), text: z.string() }), // text — HTML

        // «Условия бронирования» (text — HTML)
        conditions: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string() })),

        // Віджет бронювання
        booking: z.object({
            duration: z.string(),
            format: z.string(),
            method: z.string(),
            price: z.string(),
            priceNote: z.string(),
        }),
        // Текст повідомлення у WhatsApp — звичайними словами, кодується автоматично
        whatsappText: z.string(),

        // Галерея: фото 1.webp … count.webp з папки, плюс необов'язкове відео наприкінці
        gallery: z.object({
            folder: z.string(),
            count: z.number().int().positive(),
            video: z.object({ poster: z.string(), src: z.string(), title: z.string() }).optional(),
        }),
    }),
});

export const collections = { tours };
