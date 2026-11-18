// Єдине джерело даних про тури для всіх сторінок — колекція src/content/tours (пункт 6.1)
import { getCollection, type CollectionEntry } from 'astro:content';

export type TourEntry = CollectionEntry<'tours'>;
export type Section = TourEntry['data']['section'];

export const tourHref = (t: { section: string; slug: string }) =>
    `/excursions/${t.section}/${t.slug}`;

// Дані для картки туру (TourCard) у списках і на головній
export function cardProps(entry: TourEntry) {
    const t = entry.data;
    return {
        slug: entry.id,
        section: t.section,
        title: t.card.title ?? t.title,
        description: t.card.description,
        image: t.card.image,
        durationValue: t.card.durationValue,
        durationLabel: t.card.durationLabel,
        price: t.card.price,
        priceLabel: t.card.priceLabel,
        category: t.card.category,
        ratingCategory: t.ratingCategory,
    };
}

export type Tour = ReturnType<typeof cardProps>;

const SECTION_ORDER: Section[] = ['personalised', 'copyright'];

// Усі тури: спершу індивідуальні, потім авторські, усередині — за полем order
export async function getTours(section?: Section): Promise<Tour[]> {
    const entries = await getCollection('tours', (e) => !section || e.data.section === section);
    return entries
        .sort((a, b) =>
            SECTION_ORDER.indexOf(a.data.section) - SECTION_ORDER.indexOf(b.data.section)
            || a.data.order - b.data.order)
        .map(cardProps);
}

// Словник «категорія відгуку → тур» для підписів у відгуках
export async function getCategoryTours(): Promise<Record<string, { title: string; href: string }>> {
    const tours = await getTours();
    return Object.fromEntries(
        tours.map((t) => [t.ratingCategory, { title: t.title, href: tourHref(t) }]),
    );
}
