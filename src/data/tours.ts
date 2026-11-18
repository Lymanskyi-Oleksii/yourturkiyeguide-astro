// Єдине джерело даних про тури для всіх сторінок
import personalised from '../content/personalised.json';
import copyright from '../content/copyright.json';

export const tours = [
  ...personalised.map((t) => ({ ...t, section: 'personalised' as const })),
  ...copyright.map((t) => ({ ...t, section: 'copyright' as const })),
];

export const tourHref = (t: { section: string; slug: string }) =>
  `/excursions/${t.section}/${t.slug}`;

// Словник «категорія відгуку → тур» для підписів у відгуках
export const categoryTours = Object.fromEntries(
  tours.map((t) => [t.ratingCategory, { title: t.title, href: tourHref(t) }]),
);
