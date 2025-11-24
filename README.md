# 💬 Webchat

**Webchat** — это учебный проект мессенджера, реализованный как **SPA** без серверного рендеринга.
Отрисовка интерфейса выполнена через собственный компонентный подход на базе класса `Block` и событийного ядра `EventBus`.
Проект написан на **TypeScript**, собирается Vite и развёрнут на Netlify.

---

## 🚀 Демо

👉 [https://messengerwebchatnow.netlify.app/](https://messengerwebchatnow.netlify.app/)

---

## 📄 Страницы и маршруты

Все страницы рендерятся на клиенте через простой роутер, который определяет компонент по `window.location.pathname`.

| Страница        | Маршрут                      |
| --------------- | ---------------------------- |
| Вход            | `/` или `/login`             |
| Регистрация     | `/registration`              |
| Список чатов    | `/chats`                     |
| Профиль         | `/profile`                   |
| Изменить данные | `/profile/edit`              |
| Изменить пароль | `/profile/password`          |
| Ошибка 404      | любой несуществующий маршрут |
| Ошибка 500      | `/500`                       |

---

## 🔧 Используемые технологии

### Основное

* **TypeScript**
* **Vite** (сборка и dev-сервер)
* **Handlebars** — шаблонизатор
* **PostCSS**

  * `postcss-nested`
  * `postcss-preset-env`
* **EditorConfig**

### Линтинг и качество кода

* **ESLint**
* **Stylelint**
* **TypeScript type-checking (`tsc --noEmit`)**

Все проверки объединены в команду `npm run lint`.

### Архитектура

* **Block** — базовый класс для компонентов и страниц
* **EventBus** — система событий (`init`, `render`, `componentDidMount`, `componentDidUpdate`)
* Разделение логики, шаблонов и стилей по страницам
* Простая реализация роутинга

### HTTP

* Собственный класс **HTTPTransport** на базе `XMLHttpRequest`

  * методы `get`, `post`, `put`, `delete`
  * поддержка query-параметров
  * timeout, headers, FormData/JSON

### Деплой

* **Netlify** через автодеплой ветки `deploy`

---

## 💻 Команды проекта

| Команда              | Описание                                      |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Запуск dev-сервера (Vite)                     |
| `npm run build`      | Сборка проекта в `dist`                       |
| `npm run start`      | Просмотр собранного проекта                   |
| `npm run deploy`     | Публикация в ветку `deploy` для Netlify       |
| `npm run lint`       | Запуск всех проверок: ESLint + Stylelint + TS |
| `npm run lint:ts`    | Проверка TypeScript                           |
| `npm run lint:css`   | Проверка Stylelint                            |
| `npm run lint:types` | `tsc --noEmit`                                |

---

## 📂 Структура проекта

```bash
src/
├── core/               # Block, EventBus
├── api/                # HTTPTransport
├── pages/              # Каждая страница как компонент
│   ├── login/
│   ├── registration/
│   ├── chats/
│   ├── profile/
│   ├── editProfile/
│   ├── editPassword/
│   ├── error404/
│   └── error500/
├── styles/             # Общие стили, шрифты, переменные
├── utils/              # Валидация, утилиты
└── main.ts             # Точка входа + роутинг
```

---

## 🧩 О проекте

Текущая версия Webchat включает:

* компонентную архитектуру на TypeScript;
* собственный EventBus и жизненный цикл компонента;
* рендеринг страниц через Handlebars;
* валидацию форм (`blur` + `submit`);
* обработку ошибок и базовые страницы ошибок;
* простейший роутинг по URL;
* класс HTTP-запросов для дальнейшей интеграции API;
* настроенный линтинг CSS/TS и проверку типов;
* деплой на Netlify.

Это базовая версия интерфейса будущего мессенджера.
В следующих спринтах будут добавлены API, авторизация, WebSocket и полноценное общение.
