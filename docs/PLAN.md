# План виправлень сайту yourturkiyeguide-astro

Складено 11 листопада 2026 року за станом репозиторію на коміті `e45272a` (19 вересня 2026).

**На чому це базується.** Я прочитав увесь код, але не збирав і не запускав сайт, а правил безпеки Firestore, домену й хостингу в репозиторії немає. Тому всюди, де порада залежить від цих речей, це позначено окремо.

**Два уточнення до моїх попередніх повідомлень.** Перевіряючи кожен пункт для цього плану, я знайшов дві власні неточності:

- **Unsplash.** Я писав, що фон у `tourMapSelected.css` вантажиться з Unsplash. Насправді цей рядок закоментований і нічого не вантажить. Це просто мертвий коментар, його досить видалити (пункт 7.2).
- **Font Awesome.** Я писав, що жодна іконка не використовується. Насправді одна є: лупа `\f002` у підказці над головним фото галереї (`galleria.css`, рядок 67). Висновок той самий, але крок інший: спершу замінити цю іконку, потім прибирати бібліотеку (пункт 3.3).

---

## Як користуватися планом

Пункти згруповані в 7 етапів і йдуть у тому порядку, в якому їх варто робити. Кожен пункт має однакову будову: що не так, де це в коді, чому це важливо, як виправити, як перевірити.

Пріоритети:

- **P1** — зачіпає приватність людей або ламає сайт для відвідувачів. Робити першим.
- **P2** — помітно погіршує швидкість, вигляд або пошукову видимість.
- **P3** — порядок у коді, який полегшить подальшу роботу.

## Зведена таблиця

| № | Що зробити | Пріоритет | Орієнтовно часу |
|---|---|---|---|
| 1.1 | Прибрати email із публічних відгуків | P1 | 1 год |
| 1.2 | Додати модерацію відгуків | P1 | 1–2 год |
| 1.3 | Написати правила Firestore і покласти їх у репозиторій | P1 | 1–2 год |
| 1.4 | Полагодити ліміт «раз на 15 хвилин» | P1 | 15 хв |
| 1.5 | Прибрати шкідливий фільтр стоп-слів | P2 | 15 хв |
| 1.6 | Екранувати всі поля відгуку при виводі | P2 | 30 хв |
| 2.1 | Галерея: не перехоплювати клавіатуру всієї сторінки | P1 | 1 год |
| 2.2 | Галерея: не блокувати жести на телефоні | P1 | 15 хв |
| 2.3 | Галерея: прибрати глобальний перехоплювач помилок | P2 | 5 хв |
| 2.4 | Абсолютні посилання в картках турів | P1 | 10 хв |
| 2.5 | Фільтри: прибрати порожні варіанти, виправити валюту | P2 | 1–2 год |
| 2.6 | Заглушка «от … €/час» у трансфері | P2 | 5 хв |
| 2.7 | Підпис туру для відгуків про Каппадокію | P2 | 30 хв |
| 3.1 | Мініатюри й зменшені фото в галереях | P2 | 3–4 год |
| 3.2 | Зменшити оригінали фото | P2 | 1 год |
| 3.3 | Прибрати Font Awesome | P2 | 20 хв |
| 3.4 | Ліниве завантаження і розміри зображень | P2 | 1 год |
| 3.5 | Один запит до Firestore замість кількох | P2 | 1–2 год |
| 3.6 | Стиснути відео | P3 | 20 хв |
| 3.7 | Шрифт без кирилиці | P3 | 30 хв |
| 4.1 | Одна мова в інтерфейсі | P2 | 30 хв |
| 4.2 | Одна назва бренду | P2 | 30 хв |
| 4.3 | Порожні розділи | P2 | залежить від текстів |
| 4.4 | Вичитка текстів | P3 | 30 хв |
| 5.1 | `site`, sitemap, robots.txt, canonical | P2 | 1 год |
| 5.2 | Картинка для прев'ю в месенджерах | P2 | 30 хв |
| 5.3 | Один `<h1>` на сторінку | P2 | 1 год |
| 5.4 | `<button>` всередині `<a>` | P3 | 10 хв |
| 5.5 | Сторінка 404 | P3 | 20 хв |
| 6.1 | Один шаблон замість шести сторінок турів | P3 | 4–6 год |
| 6.2 | Спільний компонент фільтра | P3 | 1 год |
| 6.3 | Контакти й назва в одному файлі | P3 | 30 хв |
| 6.4 | Перенести CSS і JS з `public/` у `src/` | P3 | 3–5 год |
| 6.5 | Прибрати React і Tailwind | P3 | 20 хв |
| 6.6 | Адреси `/excursions` і `/services` без повтору | P3 | 30 хв |
| 7.1 | Видалити зайві файли | P3 | 15 хв |
| 7.2 | Видалити мертвий код | P3 | 30 хв |
| 7.3 | README і CLAUDE.md | P3 | 1 год |

Разом це приблизно 30–40 годин роботи. Етапи 1 і 2 (близько 8 годин) закривають усе критичне.

---

## Етап 0. Підготовка

1. **Окрема гілка на кожен етап.** Наприклад `fix/reviews-security`, `fix/gallery-input`, `perf/images`. Так кожен етап можна перевірити й відкотити окремо.
2. **Зрозумілі назви комітів.** Зараз в історії є `вщту`, `fixed`, `servic`. Краще писати, що саме зроблено: `reviews: remove email from public documents`.
3. **Перевірка перед кожним пушем.** `npm run build`, потім `npm run preview` і пройтися по змінених сторінках.
4. **Замір «до».** Запустіть Lighthouse в Chrome DevTools для головної та сторінки Каппадокії й збережіть результати. Після етапу 3 буде з чим порівняти.
5. **Резервна копія відгуків.** Перед етапом 1 експортуйте колекцію `reviews` (у Firebase Console або через `gcloud firestore export`), бо там буде міграція даних.

---

## Етап 1. Відгуки та безпека

Це найважливіший етап. Зараз будь-хто може прочитати email усіх авторів відгуків і записати в базу що завгодно.

### 1.1. Email авторів видно всім (P1)

**Що не так.** Форма обіцяє «Email (не будет опубликовано)», але email записується в той самий документ `reviews`, який сайт віддає всім відвідувачам. Достатньо відкрити консоль браузера, щоб отримати всі адреси.

**Де.** `public/assets/js/pages/reviews.js`, рядок 340 (запис поля `email`); `src/components/tour/TourReviews.astro` (поле форми).

**Чому важливо.** Це витік персональних даних і пряме порушення обіцянки на формі.

**Як виправити.** Спершу вирішіть, чи гід узагалі користується цими адресами.

- **Варіант А (рекомендую, якщо адреси не потрібні).** Видалити поле email із форми і з об'єкта `review`. Немає даних — немає ризику.
- **Варіант Б (якщо адреси потрібні для зв'язку).** Писати email в окрему колекцію `reviewContacts`, яку з сайту можна лише створювати, але не читати:

```js
import { doc, collection, writeBatch, serverTimestamp } from '…/firebase-firestore.js';

const reviewRef = doc(collection(this.db, 'reviews'));       // новий id
const batch = writeBatch(this.db);
batch.set(reviewRef, review);                                 // без email
if (email) {
  batch.set(doc(this.db, 'reviewContacts', reviewRef.id), {
    email,
    userId: this.user.uid,
    createdAt: serverTimestamp(),
  });
}
await batch.commit();
```

**Обов'язково в обох варіантах: почистити вже збережені адреси.** Вони лежать у наявних документах і лишаться публічними, доки їх не прибрати. Якщо відгуків небагато, видаліть поле `email` вручну у Firebase Console. Якщо багато, запустіть локально одноразовий скрипт:

```js
// scripts/migrate-reviews.mjs — запускати локально один раз
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeApp({ credential: cert('./serviceAccount.json') });
const db = getFirestore();

const snap = await db.collection('reviews').get();
for (const d of snap.docs) {
  const data = d.data();
  if (data.email) {
    // лише для варіанта Б: перенести адресу в закриту колекцію
    await db.collection('reviewContacts').doc(d.id).set({ email: data.email });
  }
  await d.ref.update({
    email: FieldValue.delete(),
    verified: data.verified !== false,   // старі відгуки без поля вважаємо схваленими (див. 1.2)
  });
}
console.log(`Оновлено ${snap.size} відгуків`);
```

Файл `serviceAccount.json` — це ключ із повним доступом до бази. Додайте його в `.gitignore` і ніколи не комітьте.

**Як перевірити.** Відкрийте сторінку відгуків, у DevTools → Network знайдіть відповідь Firestore і переконайтеся, що слова `email` там немає.

### 1.2. Немає модерації (P1)

**Що не так.** Позначку `verified: true` ставить сам браузер відвідувача, тому кожен відгук миттєво з'являється на сайті.

**Де.** `reviews.js`, рядок 346.

**Чому важливо.** Конкурент або спамер може за хвилину заповнити сайт образами, рекламою чи фальшивими оцінками.

**Як виправити.**

1. У `reviews.js` записувати `verified: false`.
2. Після відправлення не перемальовувати список, а показати повідомлення: «Спасибо! Отзыв появится на сайте после проверки».
3. У правилах Firestore заборонити створення з `verified: true` (пункт 1.3). Без цього зміна в коді нічого не захищає.
4. Схвалення: у Firebase Console → Firestore → `reviews` відфільтрувати `verified == false` і змінити поле на `true` або видалити документ. Зміни з консолі правила не обмежують.
5. Старі відгуки без поля `verified` після нових правил перестануть показуватися. Скрипт із пункту 1.1 проставляє їм `true`.

Якщо гіду незручно заходити в консоль, наступним кроком можна зробити маленьку закриту сторінку модерації з входом через Google. Тоді в правила додається перевірка адміністратора:

```
function isAdmin() {
  return request.auth != null
    && request.auth.token.email_verified
    && request.auth.token.email in ['адреса-гіда@example.com'];
}
```

**Як перевірити.** Залишити тестовий відгук, переконатися, що його немає на сайті, схвалити в консолі, оновити сторінку.

### 1.3. Правила Firestore (P1)

**Що не так.** Математична капча, ліміт часу й перевірка тексту працюють лише в браузері. Хто пише в базу напряму, оминає їх усі і може передати, наприклад, `rating: 100`. Правил безпеки в репозиторії немає, тож я не знаю, що налаштовано зараз.

**Чому важливо.** Єдиний справжній захист Firestore — це правила на сервері. Код у браузері зловмисник просто не виконує.

**Як виправити.** Створіть у корені файл `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function validReview() {
      let d = request.resource.data;
      let fields = ['name', 'rating', 'text', 'category', 'timestamp', 'userId', 'verified'];
      return d.keys().hasOnly(fields) && d.keys().hasAll(fields)
        && d.name is string && d.name.size() > 0 && d.name.size() <= 50
        && d.text is string && d.text.size() > 0 && d.text.size() <= 500
        && d.rating is int && d.rating >= 1 && d.rating <= 5
        && d.category in ['general', 'istanbul', 'colourful', 'tranzit',
                          'sophisticated', 'stambul', 'bosphorus', 'cappadocia']
        && d.timestamp == request.time
        && d.userId == request.auth.uid
        && d.verified == false;
    }

    match /reviews/{reviewId} {
      allow read: if resource.data.verified == true;
      allow create: if request.auth != null && validReview();
      allow update, delete: if false;
    }

    // лише для варіанта Б з пункту 1.1
    match /reviewContacts/{reviewId} {
      allow create: if request.auth != null
        && request.resource.data.keys().hasOnly(['email', 'userId', 'createdAt'])
        && request.resource.data.email is string
        && request.resource.data.email.size() <= 100
        && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if false;
    }
  }
}
```

Що з цього випливає для коду:

- **Об'єкт `review` має містити рівно ці сім полів.** Поля `date` та `email` прибрати. Дата й так рахується з `timestamp` при читанні.
- **Усі запити на читання мусять мати `where('verified', '==', true)`.** Основні запити вже такі. Запасний запит «завантажити всі відгуки» в `reviews.js` (блок `catch` у методі `loadReviews`, приблизно рядки 444–481) правила відхилять, його треба видалити.
- **Список категорій у правилах має збігатися з `ratingCategory` у JSON-файлах турів.** Додаєте новий тур — додайте його категорію і сюди.

Далі:

1. Додайте `firebase.json` з рядком `"firestore": { "rules": "firestore.rules" }` і розгортайте командою `firebase deploy --only firestore:rules`. Так правила зберігаються в git разом із кодом.
2. Перед розгортанням перевірте правила в Rules Playground у Firebase Console або в локальному емуляторі.
3. У Firebase Console → App Check переконайтеся, що для Cloud Firestore увімкнено Enforce. У коді App Check підключений, але без примусового режиму він нічого не блокує.

**Як перевірити.** У Rules Playground спробувати створити відгук із `rating: 100`, з `verified: true` і з зайвим полем. Усі три спроби мають бути відхилені.

### 1.4. Ліміт «раз на 15 хвилин» не працює (P1)

**Що не так.** У конструкторі час останнього відгуку читається раніше, ніж задається категорія. Тому читання йде з ключа `lastReviewSubmission_undefined`, а запис — у `lastReviewSubmission_general` (або іншу категорію). Після перезавантаження сторінки обмеження зникає.

**Де.** `reviews.js`, рядки 12 і 17.

**Як виправити.** Перенести рядки з категорією вище:

```js
constructor(options = {}) {
  this.category = options.category || 'general';
  this.categoryDisplayName = options.categoryDisplayName || 'Общие отзывы';

  this.reviews = [];
  this.selectedRating = 0;
  // …
  this.lastSubmissionTime = this.getLastSubmissionTime();   // тепер категорія вже відома
```

Варто також зробити ключ спільним для всіх категорій (`lastReviewSubmission`), інакше можна залишити по відгуку на кожній сторінці туру поспіль.

Це обмеження лише для чесних відвідувачів: `localStorage` легко очистити. Від зловмисників захищають модерація (1.2), правила (1.3) і App Check.

**Як перевірити.** Залишити відгук, перезавантажити сторінку: форма має бути вимкнена з повідомленням про очікування.

### 1.5. Фільтр стоп-слів відхиляє нормальні відгуки (P2)

**Що не так.** Список `['спам', 'реклама', 'купить', 'продажа', 'дешево']` шукає входження в текст. Відгук «Фырат помог купить ковёр и совсем не дёшево» буде відхилено як «неприемлемый контент».

**Де.** `reviews.js`, рядки 277–283. Поруч функція `sanitizeInput` (вирізає `javascript:` і `on…=`), яка теж псує звичайний текст і нічого не захищає.

**Як виправити.** Після появи модерації видалити список стоп-слів і `sanitizeInput`. Перевірки на суцільні великі літери й повтори символів можна залишити. Захист від шкідливого HTML — це екранування при виводі (1.6), а не вирізання при записі.

### 1.6. Не всі поля екрануються при виводі (P2)

**Що не так.** Ім'я і текст проходять через `escapeHtml`, а дата `review.date` і перша літера імені `review.name.charAt(0)` вставляються в HTML як є. Якщо в документі `name` виявиться не рядком, `charAt` викине помилку і список відгуків не намалюється взагалі.

**Де.** `reviews.js`, рядки 506 і 510; `home-reviews.js`, рядки 49 і 52.

**Як виправити.** Одна спільна функція для обох файлів, яка приводить усе до безпечного вигляду:

```js
// public/assets/js/pages/review-utils.js
export function esc(value) {
  const div = document.createElement('div');
  div.textContent = String(value ?? '');
  return div.innerHTML;
}

export function normalizeReview(raw) {
  const name = String(raw.name ?? '').trim() || 'Гость';
  const ts = raw.timestamp?.toDate?.();
  return {
    name,
    initial: name.charAt(0).toUpperCase(),
    text: String(raw.text ?? ''),
    rating: Math.min(5, Math.max(0, Number(raw.rating) || 0)),
    category: String(raw.category ?? 'general'),
    date: ts ? ts.toLocaleDateString('ru-RU') : '',
    time: ts ? ts.getTime() : 0,
  };
}
```

У шаблонах виводити `esc(r.initial)`, `esc(r.name)`, `esc(r.date)`, `esc(r.text)`.

---

## Етап 2. Помилки, які бачать відвідувачі

### 2.1. Галерея перехоплює клавіатуру всієї сторінки (P1)

**Що не так.** Обробник `keydown` висить на `document` і скасовує стандартну дію клавіш будь-де на сторінці туру:

- ↑ і ↓ гортають фото замість прокрутки сторінки;
- Enter на будь-якому посиланні чи кнопці відкриває фото на весь екран. Людина, яка дійшла клавішею Tab до кнопки WhatsApp і натисла Enter, не потрапить у WhatsApp;
- клавіша H будь-де відкриває довідку галереї.

**Де.** `public/assets/js/pages/galleria.js`, рядки 606–652.

**Чому важливо.** Це ламає бронювання для людей, які користуються клавіатурою, і дратує всіх, хто гортає сторінку стрілками.

**Як виправити.** Поза повноекранним режимом реагувати лише тоді, коли фокус усередині галереї.

1. У `src/components/tour/PhotoGallerySecondary.astro` зробити галерею фокусованою:

```astro
<div class="vertical-display" tabindex="0" role="region" aria-label="Фотогалерея">
```

2. У `galleria.js` на початку обробника:

```js
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;

  if (isFullscreen) {
    // Escape, ←, → — як зараз
    return;
  }

  const gallery = document.querySelector('.vertical-display');
  if (!gallery || !gallery.contains(document.activeElement)) return;   // фокус не в галереї — не втручаємось

  // ↑, ↓, Enter, Escape — як зараз
});
```

3. Оновити підказку під галереєю: «Нажмите на галерею, затем используйте ↑/↓».

**Як перевірити.** На сторінці туру: стрілки гортають сторінку; Tab до кнопки WhatsApp і Enter відкривають WhatsApp; після кліку по галереї стрілки гортають фото.

### 2.2. Галерея блокує жести на телефоні (P1)

**Що не так.** Два обробники на `document` скасовують дотики по всій сторінці: один блокує будь-який дотик двома пальцями (масштабування), другий скасовує кожен дотик, що стався менш ніж через 300 мс після попереднього. Через другий швидкі повторні натискання на кнопки можуть не спрацьовувати.

**Де.** `galleria.js`, рядки 654–668.

**Чому важливо.** Масштабування потрібне людям зі слабким зором, і блокувати його на всій сторінці не можна.

**Як виправити.** Видалити обидва обробники. Якщо треба уникнути подвійного тапу саме на галереї, це робиться одним рядком CSS:

```css
.vertical-display,
.photo-fullscreen-overlay {
  touch-action: manipulation;
}
```

**Як перевірити.** На телефоні: сторінка масштабується двома пальцями, швидкі натискання на кнопки працюють.

### 2.3. Будь-яка помилка JS показується як помилка галереї (P2)

**Що не так.** `window.addEventListener('error', …)` ловить помилки всіх скриптів сторінки (Firebase, відгуки, будь-що) і виводить відвідувачу «Сталася помилка в галереї. Перевірте консоль для деталей», до того ж українською на російськомовному сайті.

**Де.** `galleria.js`, рядки 716–719.

**Як виправити.** Видалити цей обробник. Помилки завантаження окремих фото й відео галерея вже обробляє через `onerror`.

### 2.4. Відносні посилання в картках турів (P1)

**Що не так.** На сторінках списків картка отримує `basePath="personalised"`, і посилання виходить відносним: `personalised/hello`. За адресою `/excursions/personalised` воно працює. Але якщо хостинг додає слеш у кінці (`/excursions/personalised/`, так роблять GitHub Pages і типовий nginx), браузер зібере `/excursions/personalised/personalised/hello`, а це 404.

**Де.** `src/pages/excursions/personalised.astro`, рядок 92; `src/pages/excursions/copyright.astro`, рядок 92; `src/components/TourCard.astro`, рядок 18.

**Як виправити.** Мінімально — зробити шляхи абсолютними, як уже зроблено на головній:

```astro
<TourCard basePath="/excursions/personalised" {...tour} />
<TourCard basePath="/excursions/copyright" {...tour} />
```

Краще — щоб картка сама знала адресу туру (див. спільний модуль у пункті 2.7), тоді помилитися буде ніде.

**Як перевірити.** Відкрити `/excursions/personalised/` зі слешем у кінці й клікнути по картці.

### 2.5. Фільтри з порожніми варіантами і не тією валютою (P2)

**Що не так.**

| Проблема | Де |
|---|---|
| Варіанти «Шопинг», «Гастро-тур», «Фототур» не знаходять жодного туру | `personalised.astro`, рядки 53–55 |
| Тур «По волнам Босфора» має категорію `bosphorus`, якої немає у списку тем | `personalised.json`, рядок 71 |
| «Больше 6 часов» нічого не знаходить | `personalised.astro`, рядок 66 |
| Підпис «Цена (USD)», хоча ціни в євро | `personalised.astro`, рядок 71 |
| На сторінці авторських турів один тур і п'ять варіантів типу, з яких працює один | `copyright.astro`, рядки 49–55 |
| Категорія називається українським словом «мистецька» | `personalised.json`, рядок 23; обидві сторінки |

**Як виправити.**

1. Будувати список тем із самих даних, тоді порожніх варіантів не буде в принципі:

```astro
---
const LABELS: Record<string, string> = {
  'историческая': 'Историческая',
  'искусство': 'Искусство',
  'морская прогулка': 'Морская прогулка',
  'многодневный': 'Многодневный тур',
};
const categories = [...new Set(tours.map((t) => t.category))];
---
<select class="filter-select" id="categorySelect">
  <option value="">Все темы</option>
  {categories.map((c) => <option value={c}>{LABELS[c] ?? c}</option>)}
</select>
```

2. У `personalised.json` замінити `"мистецька"` на `"искусство"`, а `"bosphorus"` на `"морская прогулка"`.
3. Виправити підпис на «Цена (EUR)» або «Цена, €».
4. Прибрати варіант «Больше 6 часов», доки таких турів немає.
5. На сторінці авторських турів не показувати пошук і фільтри, доки турів менше чотирьох: `{tours.length > 3 && <TourFilter … />}`.
6. Розмітка фільтра продубльована у двох файлах по 110 рядків. Винесіть її в компонент (пункт 6.2), щоб правити в одному місці.

### 2.6. Заглушка в цінах трансферу (P2)

**Що не так.** На сторінці трансферу відвідувач бачить «от … €/час».

**Де.** `src/pages/services/transfer.astro`, рядок 35.

**Як виправити.** Вписати справжню ціну або замінити на «по запросу», як у сусідній картці.

### 2.7. Відгуки про Каппадокію без підпису туру (P2)

**Що не так.** Словник «категорія відгуку → тур» будується лише з `personalised.json`. Тому на загальній сторінці відгуків і на головній відгуки про Каппадокію не мають посилання на тур.

**Де.** `src/components/tour/TourReviews.astro`, рядки 10–12; `src/pages/index.astro`, рядки 12–14.

**Як виправити.** Один модуль з усіма турами, яким користуються всі сторінки:

```ts
// src/data/tours.ts
import personalised from '../content/personalised.json';
import copyright from '../content/copyright.json';

export const tours = [
  ...personalised.map((t) => ({ ...t, section: 'personalised' as const })),
  ...copyright.map((t) => ({ ...t, section: 'copyright' as const })),
];

export const tourHref = (t: { section: string; slug: string }) =>
  `/excursions/${t.section}/${t.slug}`;

export const categoryTours = Object.fromEntries(
  tours.map((t) => [t.ratingCategory, { title: t.title, href: tourHref(t) }]),
);
```

У `TourReviews.astro` та `index.astro` імпортувати `categoryTours` звідси замість власних копій. `TourCard` може приймати готовий `href={tourHref(tour)}` замість `basePath`, і пункт 2.4 закриється сам.

---

## Етап 3. Швидкість

### 3.1. Галерея вантажить усі фото в повному розмірі (P2)

**Що не так.** Мініатюри галереї — це ті самі великі файли, зменшені стилями, і вантажаться вони всі одразу. Сторінка Каппадокії тягне 34 фото на 10 МБ, «Изысканный Стамбул» — 7 МБ.

**Де.** `galleria.js`, функція `createThumbnails` (рядки 84–176): `createImageElement(slide.image, …)`.

**Чому важливо.** Сайт для туристів відкривають переважно з телефону, часто в роумінгу. 10 МБ на сторінку — це довге очікування і витрачений трафік.

**Як виправити (рекомендований шлях).** Нехай Astro сам генерує зменшені версії під час збирання. Він обробляє лише зображення з `src/`, а з `public/` віддає як є, тому фото турів треба перенести.

1. Перенести папки з `public/assets/img/` у `src/assets/tours/` (`bosphorus`, `cappadocia`, `hello` і так далі).
2. Додати помічник:

```ts
// src/lib/gallery.ts
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/tours/*/*.webp',
  { eager: true },
);

export async function galleryFor(folder: string) {
  const entries = Object.entries(all)
    .filter(([path]) => path.includes(`/tours/${folder}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));   // 2 перед 10

  return Promise.all(
    entries.map(async ([, mod], i) => ({
      thumb: (await getImage({ src: mod.default, width: 240 })).src,
      image: (await getImage({ src: mod.default, width: 1600 })).src,
      title: `Фото ${i + 1}`,
    })),
  );
}
```

3. На сторінці туру замість `Array.from({ length: 13 }, …)`:

```astro
---
import { galleryFor } from '../../../lib/gallery';
const secondGalleryPhotos = await galleryFor('bosphorus');
---
```

Заодно зникає ручний лічильник фото, який треба було правити при кожному додаванні.

4. У `galleria.js` мініатюри брати з `slide.thumb` і вантажити ліниво. Атрибут `loading` треба ставити до `src`, інакше він не подіє:

```js
function createImageElement(src, alt = '', onLoad = null, onError = null, lazy = false) {
  const img = document.createElement('img');
  if (lazy) { img.loading = 'lazy'; img.decoding = 'async'; }
  img.alt = alt;
  if (onLoad) img.onload = onLoad;
  if (onError) img.onerror = onError;
  img.src = src;
  return img;
}

// у createThumbnails:
const img = createImageElement(slide.thumb || slide.image, title, onLoad, onError, true);
```

Точні назви функцій звірте з документацією Astro 7 (розділ Images): я перевірив, що `astro:assets` у сьомій версії є, але сам проєкт не збирав.

**Швидший шлях, якщо не хочеться переносити файли.** Одноразовим скриптом (пункт 3.2) згенерувати поруч папки `thumbs/` з фото шириною 240 px і передавати їх у галерею як `thumb`.

**Як перевірити.** DevTools → Network на сторінці Каппадокії: до відкриття галереї завантажено менше 1 МБ зображень.

### 3.2. Оригінали фото завеликі (P2)

**Що не так.** 76 зі 153 зображень мають більш як 2000 px по одній зі сторін. Портрет на головній (`ferat/home.webp`) має 3024×4032, а показується шириною 400 px.

**Як виправити.** Якщо зроблено пункт 3.1 рекомендованим шляхом, для сторінок розміри вже підбираються автоматично. Оригінали все одно варто зменшити до 2560 px, щоб репозиторій не ріс. Одноразовий скрипт:

```js
// scripts/resize-images.mjs — запуск: node scripts/resize-images.mjs public/assets/img
import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.argv[2];
const MAX = 2560;

for (const name of await readdir(root, { recursive: true })) {
  if (!/\.(webp|jpe?g|png)$/i.test(name)) continue;
  const file = join(root, name);
  const { width, height } = await sharp(file).metadata();
  if (Math.max(width, height) <= MAX) continue;

  const out = await sharp(file)
    .rotate()                                        // врахувати орієнтацію з EXIF
    .resize({ width: MAX, height: MAX, fit: 'inside' })
    .toBuffer();
  await writeFile(file, out);
  console.log(`${name}: ${width}×${height} → не більше ${MAX}`);
}
```

Перед запуском закомітьте поточний стан, щоб було куди повернутися.

Для портрета на головній і фото на сторінці «Обо мне» використайте компонент `<Image>` з `astro:assets`: він сам зробить потрібний розмір і пропише `width` та `height`.

### 3.3. Font Awesome заради однієї іконки (P2)

**Що не так.** На всіх семи сторінках турів підключається повна бібліотека Font Awesome з CDN (стилі плюс файли шрифтів). З неї використовується одна іконка лупи в підказці над головним фото.

**Де.** Рядок `<link … font-awesome/6.5.0/css/all.min.css>` у шести файлах `src/pages/excursions/personalised/*.astro` і в `copyright/cappadocia.astro`; використання — `public/assets/css/layout/galleria.css`, рядки 66–69.

**Як виправити.**

1. У `galleria.css` замінити іконку на емодзі й прибрати шрифт:

```css
.main-photo-display::after {
  content: '🔍 Нажмите для полноэкранного просмотра';
  /* рядки font-family: 'Font Awesome 6 Free' і font-weight: 900 видалити */
```

2. Видалити рядок `<link>` із Font Awesome з усіх семи сторінок.

**Як перевірити.** Навести курсор на головне фото галереї: підказка з лупою на місці, у Network немає запитів до `cdnjs.cloudflare.com`.

### 3.4. Ліниве завантаження і розміри зображень (P2)

**Що не так.** Атрибут `loading="lazy"` є лише в одного `<img>` на весь сайт. Багато зображень мають `width` без `height`, тому сторінка «стрибає» під час завантаження. Фони карток задані через `background-image`, а такі картинки браузер не вміє вантажити ліниво.

**Як виправити.**

- **Усі `<img>` нижче першого екрана:** `loading="lazy" decoding="async"`.
- **Головне фото першого екрана (портрет на головній):** навпаки, `loading="eager" fetchpriority="high"`.
- **Усім `<img>`:** і `width`, і `height`. Компонент `<Image>` робить це сам.
- **Картки турів і категорій:** замінити `background-image` на звичайний `<img loading="lazy">` усередині картки зі стилем `object-fit: cover; position: absolute; inset: 0;`. Розмір картинки для картки — близько 800 px завширшки.

### 3.5. Кілька запитів до Firestore там, де досить одного (P2)

**Що не так.** Кожен перегляд сторінки завантажує всю колекцію відгуків. На сторінках списків `cards-rating.js` ще й робить окремий запит на кожну картку, по черзі. На головній колекція читається двічі: для блоку відгуків і для рейтингів карток.

**Де.** `cards-rating.js`, рядки 7–16; `home-reviews.js`, рядок 24; `reviews.js`, метод `loadReviews`.

**Чому важливо.** Firestore рахує кожен прочитаний документ. Що більше відгуків і відвідувачів, то повільніше сайт і ближче платний тариф.

**Як виправити.** Один спільний модуль, який читає схвалені відгуки один раз і кілька хвилин тримає їх у пам'яті вкладки:

```js
// public/assets/js/pages/reviews-data.js
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../firebase-init.js';
import { normalizeReview } from './review-utils.js';

const KEY = 'reviewsCache:v1';
const TTL = 5 * 60 * 1000;
let pending = null;

export function getVerifiedReviews() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY));
    if (cached && Date.now() - cached.at < TTL) return Promise.resolve(cached.items);
  } catch { /* кеш недоступний — просто читаємо з бази */ }

  if (!pending) {
    pending = getDocs(query(collection(db, 'reviews'), where('verified', '==', true)))
      .then((snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...normalizeReview(d.data()) }));
        try { sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), items })); } catch {}
        return items;
      });
  }
  return pending;
}
```

`cards-rating.js`, `home-reviews.js` і `reviews.js` викликають `getVerifiedReviews()` і самі групують результат за `category`. Запитів стає один на сторінку, а при переході між сторінками протягом п'яти хвилин — жодного.

Коли відгуків стане кілька сотень, наступний крок — рахувати середні оцінки під час збирання сайту, щоб вони були в готовому HTML.

### 3.6. Відео на 6,8 МБ (P3)

**Де.** `public/assets/img/cappadocia/balloons.mp4`.

Вантажиться воно лише після відкриття слайда, тож це не критично. Стиснути можна так:

```
ffmpeg -i balloons.mp4 -vf "scale=-2:720" -c:v libx264 -crf 28 -preset slow \
       -c:a aac -b:a 96k -movflags +faststart balloons-720.mp4
```

### 3.7. Шрифт Poppins не має кирилиці (P3, нове спостереження)

**Що не так.** Підключено п'ять накреслень Poppins з Google Fonts, але в цього шрифту немає кириличних літер. Увесь російський текст показується запасним системним шрифтом, а Poppins застосовується лише до латиниці й цифр (логотип, ціни). Виходить різний вигляд тексту на різних пристроях і зайве завантаження.

**Де.** `src/layouts/BaseLayout.astro`, рядок із `fonts.googleapis.com`.

**Як виправити.** Обрати шрифт із кирилицею (наприклад Montserrat, Manrope або Inter), підключити два-три накреслення замість п'яти й замінити назву в `style.css` (рядок 34) та `filter.css` (рядок 21).

---

## Етап 4. Контент і мова

### 4.1. Українські фрази на російськомовному сайті (P2)

Сайт позначений як `lang="ru"`, але частина інтерфейсу українською. Повний список:

| Файл і рядок | Зараз | Замінити на |
|---|---|---|
| `src/components/Footer.astro:14` | Усі права захищені. | Все права защищены. |
| `src/components/Header.astro:5` | alt="Іконка сайту" | alt="Логотип" |
| `src/components/TourCard.astro:29` | Завантаження… | Загрузка… |
| `src/pages/reviews.astro:13` | Загальні відгуки | Общие отзывы |
| `src/pages/excursions/copyright.astro:48` | Тип туру | Тип тура |
| `src/pages/excursions/personalised.astro:52` | Мистецька | Искусство |
| `src/pages/excursions/copyright/cappadocia.astro:31` | Політ на кулях | Полёт на воздушных шарах |
| `public/assets/js/pages/galleria.js:162, 194, 388` | Завантаження… / Завантаження зображення… | Загрузка… / Загрузка изображения… |
| `galleria.js:139, 200, 394` | Зображення N | Изображение N |
| `galleria.js:151` | Помилка | Ошибка |
| `galleria.js:229` | Не вдалося завантажити зображення | Не удалось загрузить изображение |
| `galleria.js:349` | Завантаження відео… | Загрузка видео… |
| `galleria.js:379, 382` | Не вдалося завантажити відео | Не удалось загрузить видео |
| `galleria.js:573–590` | довідка з клавішами, яка показується через `alert()` | перекласти або видалити функцію `showHelp` разом із клавішею H |

Щоб менше пропускати надалі, шукайте українські літери командою:

```
grep -rnP "[іїєґІЇЄҐ]" src public/assets/js
```

Ця команда ловить лише слова з літерами і, ї, є, ґ. Слова на кшталт «Помилка» чи «Зображення» вона не знайде, тому тексти в `galleria.js` перегляньте очима. Коментарі в коді українською — це нормально, відвідувач їх не бачить.

### 4.2. Три назви бренду (P2)

**Що не так.** У шапці «TravelsTurkey», у футері «Türkiye Travellings», в Instagram `tourkey_travels`, у заголовку вкладки «Гид по Турции», а репозиторій називається `yourturkiyeguide`.

**Як виправити.** Обрати з гідом одну назву й записати її в одному місці (пункт 6.3), звідки її беруть шапка, футер, заголовки сторінок і прев'ю для месенджерів. Адресу Instagram змінювати не обов'язково.

### 4.3. Порожні розділи (P2)

**Що не так.** «Групповые экскурсии», «Медицинский туризм» і «Шопинг» є в меню й у картках на головній, але на сторінках лише «Раздел в разработке».

**Де.** `src/pages/excursions/group.astro`, `src/pages/services/medical.astro`, `src/pages/services/shopping.astro`.

**Як виправити.** Один із двох шляхів:

- **Наповнити мінімально.** Два-три абзаци про послугу і блок `<TourCTA>` з кнопками Telegram та WhatsApp. Тоді сторінка вже приводить клієнта, навіть без детального опису. Для медтуризму й шопінгу короткі описи вже є в картках і в `ServicesFAQ.astro`.
- **Тимчасово сховати.** Прибрати пункти з `Header.astro`, картки з `index.astro`, `excursions.astro` і `services.astro`, а на самі сторінки додати `<meta name="robots" content="noindex">`.

Я б радив перший шлях: порожня сторінка в меню створює враження закинутого сайту.

### 4.4. Вичитка текстів (P3)

Кілька одруківок, які я помітив:

- `src/pages/about.astro:17` — «восточной странны» → «страны»;
- `src/pages/about.astro:18` — «за специальностью» → «по специальности»;
- `src/components/tour/TourAccordion.astro:8` — «в не очереди» → «вне очереди».

Варто дати всі тексти на вичитку носієві російської.

---

## Етап 5. SEO і розмітка

### 5.1. `site`, sitemap, robots.txt, canonical (P2)

**Що не так.** У конфігурації не вказано адресу сайту, немає карти сайту, `robots.txt` і канонічних адрес. Пошуковикам складніше знайти всі сторінки, а одна сторінка може індексуватися під кількома адресами.

**Як виправити.**

1. `astro.config.mjs` (підставте справжній домен):

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ВАШ-ДОМЕН',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

Інтеграцію встановлює команда `npx astro add sitemap`.

2. `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://ВАШ-ДОМЕН/sitemap-index.xml
```

3. У `src/layouts/BaseLayout.astro`:

```astro
---
const SITE_NAME = 'Назва бренду';                       // з пункту 4.2
const canonical = new URL(Astro.url.pathname, Astro.site);
const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
---
<title>{fullTitle}</title>
<link rel="canonical" href={canonical}>
<meta property="og:url" content={canonical}>
<meta property="og:site_name" content={SITE_NAME}>
<meta property="og:locale" content="ru_RU">
```

**Як перевірити.** Після збирання в `dist/` є `sitemap-index.xml`, а в коді кожної сторінки — `<link rel="canonical">` з повною адресою.

### 5.2. Картинка для прев'ю в месенджерах (P2)

**Що не так.** `og:image` вказано відносним шляхом `/assets/img/ferat/home.webp`. Месенджери й соцмережі вимагають повну адресу, тож прев'ю посилання може бути без картинки. Сам файл — вертикальний портрет 3024×4032, який у прев'ю обріжеться.

**Де.** `BaseLayout.astro`, рядок із `og:image`.

**Як виправити.**

1. Підготувати окрему горизонтальну картинку 1200×630 у форматі JPG і покласти як `public/og-cover.jpg`.
2. У `BaseLayout.astro`:

```astro
---
const { ogImage = '/og-cover.jpg' } = Astro.props;
const ogImageUrl = new URL(ogImage, Astro.site);
---
<meta property="og:image" content={ogImageUrl}>
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```

Сторінки турів можуть передавати власну картинку через `ogImage`.

**Як перевірити.** Надіслати посилання собі в Telegram і WhatsApp.

### 5.3. Кілька `<h1>` на сторінці (P2)

**Що не так.** Головний заголовок має бути один на сторінку. Зараз `<h1>` — це кожна картка туру й категорії, заголовок «Условия бронирования» і заголовок віджета бронювання. На сторінці туру їх три, на сторінці списку — сім.

**Де і на що замінити.**

| Файл | Зараз | Має бути |
|---|---|---|
| `src/components/TourCard.astro:33` | `<h1>` | `<h3>` |
| `src/components/CategoryCard.astro:15` | `<h1>` | `<h3>` |
| `src/components/tour/BookingWidget.astro:16` | `<h1 class="tour-type">` | `<h2 class="tour-type">` |
| сім сторінок турів, «Условия бронирования» | `<h1 class="title">` | `<h2 class="title">` |

`<h1>` у `TourHero.astro` і заголовки сторінок списків лишаються.

Після заміни оновіть селектори в стилях: `.card h1` у `public/assets/css/pages/excursions.css` (рядки 66, 75, 174, 211) і `.card-content h1` у блоці `<style>` файлу `TourCard.astro`.

**Як перевірити.** У консолі браузера `document.querySelectorAll('h1').length` на кожному типі сторінки має повертати 1.

### 5.4. `<button>` всередині `<a>` (P3)

**Що не так.** У картці категорії кнопка зі стрілкою вкладена в посилання. Це невалідний HTML, і програми читання з екрана озвучують такий елемент двічі.

**Де.** `src/components/CategoryCard.astro`, рядок 16.

**Як виправити.**

```astro
<span class="arrow-button" aria-hidden="true"><span class="arrow">→</span></span>
```

Якщо стилі прив'язані до `button.arrow-button`, замініть селектор на `.arrow-button`.

### 5.5. Немає сторінки 404 (P3)

**Як виправити.** Створити `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TourCTA from '../components/tour/TourCTA.astro';
---
<BaseLayout title="Страница не найдена" description="Такой страницы нет.">
  <section>
    <div class="container">
      <article>
        <h1>Страница не найдена</h1>
        <p>Возможно, ссылка устарела. Посмотрите <a href="/excursions/excursions">все экскурсии</a> или вернитесь <a href="/">на главную</a>.</p>
        <TourCTA title="Не нашли нужное?" subtitle="Напишите мне — помогу подобрать экскурсию." />
      </article>
    </div>
  </section>
</BaseLayout>
```

Більшість статичних хостингів (Netlify, GitHub Pages, Cloudflare Pages) самі підхоплюють `404.html` зі збирання.

---

## Етап 6. Структура коду

Цей етап не змінює сайт для відвідувача, але кожна наступна правка після нього займатиме менше часу.

### 6.1. Шість майже однакових сторінок турів (P3)

**Що не так.** Файли в `src/pages/excursions/personalised/` і `copyright/cappadocia.astro` мають по 120–170 рядків і відрізняються лише текстом, цінами й кількістю фото. Будь-яку зміну структури (як заголовки в 5.3 чи Font Awesome в 3.3) доводиться повторювати сім разів.

**Як виправити.** Один шаблон сторінки і по одному файлу з даними на тур.

1. Текст кожного туру — в Markdown із даними в шапці:

```md
---
# src/content/tours/bosphorus.md
section: personalised
title: По волнам Босфора
subtitle: Прогулка на роскошной яхте вдоль Босфора…
description: Роскошная прогулка на яхте по Босфору с панорамами дворцов, мостов и берегов Стамбула
hero: bosphorus/2.webp
card: bosphorus/1.webp
gallery: bosphorus
durationHours: 2
durationLabel: 2 часа
price: 280
priceLabel: от €280
priceNote: стоимость зависит от типа и размера яхты
category: морская прогулка
ratingCategory: bosphorus
format: Количество людей уточните перед заказом
method: Морская прогулка на яхте
whatsappText: |
  Здравствуйте! Хочу забронировать морскую прогулку по Босфору.

  📅 Дата: [введите дату]
  👥 Количество человек: [укажите]
conditions:
  - icon: 🛥️
    title: Приватная яхта
    text: Только для вас и вашей компании
---

Влюбиться в Стамбул окончательно и бесповоротно — проще простого!

## Что вас ожидает

### Босфор — душа Стамбула!
…
```

2. Опис колекції:

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const tours = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/tours' }),
  schema: z.object({
    section: z.enum(['personalised', 'copyright']),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    hero: z.string(),
    card: z.string(),
    gallery: z.string(),
    durationHours: z.number(),
    durationLabel: z.string(),
    price: z.number(),
    priceLabel: z.string(),
    priceNote: z.string(),
    category: z.string(),
    ratingCategory: z.string(),
    format: z.string(),
    method: z.string(),
    whatsappText: z.string(),
    conditions: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string() })),
  }),
});

export const collections = { tours };
```

Схема одразу ловить помилки: якщо в турі забули ціну, збирання впаде з чітким повідомленням.

3. Один шаблон `src/pages/excursions/[section]/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import { galleryFor } from '../../../lib/gallery';
// + імпорти BaseLayout і компонентів туру

export async function getStaticPaths() {
  const tours = await getCollection('tours');
  return tours.map((tour) => ({
    params: { section: tour.data.section, slug: tour.id },
    props: { tour },
  }));
}

const { tour } = Astro.props;
const t = tour.data;
const { Content } = await render(tour);
const photos = await galleryFor(t.gallery);
const whatsappMessage = encodeURIComponent(t.whatsappText);
---
<BaseLayout title={t.title} description={t.description}>
  <TourHero image={…} title={t.title} subtitle={t.subtitle} />
  <div class="excursion-text"><Content /></div>
  <!-- conditions, BookingWidget, PhotoGallerySecondary, TourAccordion, TourCTA, TourReviews -->
</BaseLayout>
```

Зверніть увагу на `encodeURIComponent`: текст для WhatsApp тепер пишеться звичайними словами, а не вручну через `%20` і `%0A`, як зараз.

4. Сторінки списків і головна беруть тури через `getCollection('tours')`, а `personalised.json`, `copyright.json` і модуль із пункту 2.7 стають непотрібними.

Після цього новий тур — це один файл `.md` і папка з фото.

API колекцій звірте з документацією Astro 7 (розділ Content collections). Адреси сторінок лишаються тими самими, тож посилання й відгуки не постраждають.

### 6.2. Розмітка фільтра продубльована (P3)

**Де.** `src/pages/excursions/personalised.astro` і `copyright.astro`, блок `<div class="search-filter">` (рядки 24–88 в обох).

**Як виправити.** Винести в `src/components/TourFilter.astro` з параметром `tours` (з нього будуються варіанти тем, пункт 2.5) і підключати на обох сторінках.

### 6.3. Контакти розкидані по файлах (P3)

**Що не так.** Номер телефону гіда вписаний вручну дев'ять разів у чотирьох файлах: `Footer.astro`, `BookingWidget.astro`, `TourCTA.astro`, `index.astro`. Зміниться номер — доведеться шукати всі входження.

**Як виправити.**

```ts
// src/config/site.ts
export const SITE = {
  name: 'Назва бренду',
  guide: 'Фырат Динлер',
  phone: '+905443266871',
  phoneDisplay: '+90 544 326 6871',
  email: 'firatdicle_47@hotmail.com',
  telegram: 'https://t.me/+905443266871',
  whatsapp: 'https://wa.me/905443266871',
  viber: 'viber://chat?number=%2B905443266871',
  instagram: 'https://www.instagram.com/tourkey_travels',
  facebook: 'https://www.facebook.com/firat.n.dinler',
};
```

Дві дрібниці, враховані в цьому прикладі: офіційний формат посилань WhatsApp — без плюса перед номером, а у Viber плюс треба кодувати як `%2B`.

### 6.4. CSS і JS лежать у `public/` (P3)

**Що не так.** Усе з `public/` Astro копіює як є: без мініфікації, без об'єднання, без хешів у назвах. Через відсутність хешів браузер відвідувача може після оновлення сайту показувати старі стилі з кешу. Сторінка туру підключає дев'ять окремих CSS-файлів.

**Як виправити.** Робити поступово, по одному файлу:

1. **CSS.** Перенести в `src/styles/` і підключати імпортом у компоненті, якому стилі належать: `import '../../styles/galleria.css';` у шапці `PhotoGallerySecondary.astro`. Тоді стилі галереї приходять лише туди, де є галерея, і ручні `<link>` на сторінках зникають.
2. **JS.** Перенести в `src/scripts/` і підключати з компонента:

```astro
<script>
  import '../../scripts/galleria';
</script>
```

Такі скрипти Astro збирає, мініфікує і вантажить як модулі.

3. **Обробники `onclick="…"` у розмітці** (`PhotoFullscreenOverlay.astro`, `TourGalleryCarousel.astro`) потребують глобальних функцій. Замініть їх на `addEventListener` усередині скрипта, тоді нічого не доведеться виставляти у `window`.
4. **Firebase.** Замість імпортів із `gstatic.com` поставити пакет `npm install firebase` і імпортувати з `firebase/app`, `firebase/firestore`. У збирання потрапить лише використаний код, а версія фіксується в `package.json` (зараз у коді зашита 10.7.1 кінця 2023 року).

Заодно в `galleria.css` 33 правила з `!important`, а `fix.css` складається з них цілком. Це ознака того, що стилі перебивають один одного. Під час перенесення варто знайти, які правила конфліктують, і прибрати причину.

### 6.5. React і Tailwind підключені, але не використовуються (P3)

**Що не так.** React не використовується жодного разу. Класи Tailwind є в одному місці: `text-gray-700 text-base leading-7` у `TourCard.astro`, рядок 29.

**Як виправити.**

```
npm uninstall @astrojs/react react react-dom @types/react @types/react-dom
```

Потім прибрати `react()` з `astro.config.mjs` і рядки `jsx` та `jsxImportSource` з `tsconfig.json`.

Щодо Tailwind варто визначитися: або переходити на нього всюди, або прибрати. Оскільки весь сайт написано власним CSS, простіше прибрати: `npm uninstall tailwindcss @tailwindcss/vite`, видалити плагін із конфігурації, імпорти з `src/styles/global.css`, а три класи в `TourCard.astro` замінити звичайним стилем.

### 6.6. Адреси з повтором (P3)

**Що не так.** Розділи відкриваються за адресами `/excursions/excursions` і `/services/services`.

**Як виправити.** Перейменувати `src/pages/excursions/excursions.astro` на `src/pages/excursions/index.astro` (і так само для послуг), оновити посилання в `Header.astro`, `Footer.astro`, `index.astro` і додати перенаправлення зі старих адрес:

```js
// astro.config.mjs
redirects: {
  '/excursions/excursions': '/excursions',
  '/services/services': '/services',
},
```

Другорядне: папка `copyright` означає «авторське право», а не «авторський тур». Якщо колись будете міняти адреси, краще `signature` або `author-tours`. Заради самої назви чіпати не варто.

---

## Етап 7. Прибирання і документація

### 7.1. Зайві файли (P3)

Ці файли ніде не використовуються, їх можна видалити:

- `public/assets/img/inon_rez/` — уся папка, 5 файлів;
- `public/assets/img/yahta.webp`;
- `public/assets/img/medipol-1024x512.avif`;
- `public/assets/img/beautiful-female-girl-1002530.jpg` (1 МБ);
- `public/assets/img/cappadocia/hotel.jpg`;
- `public/assets/img/ferat/obzor.jpg` (використовується версія `.webp`);
- `public/assets/img/.gitkeep`, `public/assets/js/vendor/.gitkeep`.

Окремо про іконку сайту: `public/favicon.ico` і `public/favicon.svg` — це стандартні іконки з шаблону Astro. Сторінки посилаються на `icon.webp`, але частина браузерів сама запитує `/favicon.ico` і покаже логотип Astro. Замініть обидва файли на власний логотип.

Перед видаленням перевірте кожну назву: `grep -rn "назва-файлу" src public`.

### 7.2. Мертвий код (P3)

| Що | Де |
|---|---|
| Закоментований фон з Unsplash | `public/assets/css/layout/tourMapSelected.css`, рядки 5–7 |
| Об'єкт `FilterUtils`, який ніде не викликається | `public/assets/js/pages/search.js`, рядки 365–396 |
| Автозапуск через `window.reviewsConfig`, який ніде не задається | `reviews.js`, рядки 631–636 |
| Запасне завантаження всіх відгуків (його відхилять правила з 1.3) | `reviews.js`, блок `catch` у `loadReviews`, приблизно рядки 444–481 |
| Невикористана змінна `activeCount` | `public/assets/js/script.js`, рядок 46 |
| Порожній обробник `visibilitychange` | `galleria.js`, рядки 709–713 |
| Застарілі коментарі «TODO: замінити 10…» і «46-й слайд» (слайд насправді 35-й) | `cappadocia.astro`, рядки 20 і 27 |

### 7.3. README і CLAUDE.md (P3)

**Що не так.** `README.md` — стандартний текст шаблону Astro. `CLAUDE.md` містить один рядок із посиланням на самого себе, а `AGENTS.md` посилається на нього ж. Жоден із трьох файлів не розповідає про проєкт.

**Як виправити.** У `README.md` написати:

- що це за сайт і для кого;
- як запустити локально (`npm install`, `npm run dev`) і яка версія Node потрібна;
- як улаштовані папки;
- як додати новий тур (після пункту 6.1 це один файл і папка з фото);
- як додати категорію відгуків (JSON плюс список у `firestore.rules`);
- як схвалювати відгуки;
- де й як розгортається сайт і правила Firestore.

У `CLAUDE.md` або записати справжні домовленості для ШІ-помічників (мова інтерфейсу російська, коментарі українською, стилі не в `public/`, перед комітом `npm run build`), або видалити його разом з `AGENTS.md`.

---

## Що ще варто зробити, коли буде час

Це дрібниці, яких не було в моїх попередніх зауваженнях, але які я помітив під час підготовки плану:

- **Зірочки рейтингу у формі відгуку — це `<span>`.** З клавіатури оцінку поставити неможливо. Краще п'ять `<button type="button">` або радіокнопки.
- **Повідомлення через `alert()`** у формі відгуку (шість місць у `reviews.js`). Краще показувати текст помилки поруч із полем.
- **У нижньому мобільному меню** посилання на «Другие услуги» має підпис `alt="Яхты"` (`Footer.astro`, рядок 29).
- **Зовнішнім посиланням із `target="_blank"`** у футері додати `rel="noopener noreferrer"`, як уже зроблено в `BookingWidget.astro`.
- **Якщо email у формі відгуку лишається** (варіант Б у 1.1), додайте поруч одне речення про те, навіщо він і хто його бачить.

---

## Підсумкова перевірка

Після всіх етапів пройдіться по цьому списку:

- [ ] У відповідях Firestore в Network немає поля `email`.
- [ ] Новий відгук не з'являється на сайті до схвалення.
- [ ] Rules Playground відхиляє відгук із `rating: 100` і з `verified: true`.
- [ ] Після відправлення відгуку й перезавантаження сторінки форма заблокована на 15 хвилин.
- [ ] На сторінці туру стрілки гортають сторінку, Enter на кнопці WhatsApp відкриває WhatsApp.
- [ ] На телефоні сторінка туру масштабується двома пальцями.
- [ ] Картки на `/excursions/personalised/` (зі слешем) ведуть на правильні сторінки.
- [ ] Кожен варіант у фільтрах знаходить хоча б один тур.
- [ ] На сторінці Каппадокії до відкриття галереї завантажується менше 1 МБ зображень.
- [ ] У Network немає запитів до `cdnjs.cloudflare.com`.
- [ ] На сторінку йде один запит по відгуки.
- [ ] `grep -rnP "[іїєґІЇЄҐ]" src public/assets/js` знаходить лише коментарі, а тексти галереї переглянуті вручну.
- [ ] Назва бренду однакова в шапці, футері й заголовку вкладки.
- [ ] `document.querySelectorAll('h1').length` дорівнює 1 на кожній сторінці.
- [ ] У `dist/` є `sitemap-index.xml` і `404.html`.
- [ ] Посилання, надіслане в Telegram, показує картинку.
- [ ] Lighthouse для головної та сторінки Каппадокії кращий, ніж у замірі з етапу 0.
- [ ] `npm run build` проходить без помилок і попереджень.
