# 💬 Webchat

**Webchat** — это учебный проект мессенджера.  
Приложение реализовано как SPA без серверного рендеринга и развёрнуто на [Netlify](https://keen-semifreddo-025019.netlify.app/).

---

## 🚀 Демо

👉 [https://messengerwebchatnow.netlify.app/](https://messengerwebchatnow.netlify.app/)

---

## 📄 Страницы проекта

| Страница | Ссылка |
|-----------|--------|
| Вход | [/src/pages/login/login.html](https://messengerwebchatnow.netlify.app/src/pages/login/login) |
| Регистрация | [/src/pages/registration/registration.html](https://messengerwebchatnow.netlify.app/src/pages/registration/registration) |
| Список чатов | [/src/pages/chats/chats.html](https://messengerwebchatnow.netlify.app/src/pages/chats/chats) |
| Профиль | [/src/pages/profile/profile.html](https://messengerwebchatnow.netlify.app/src/pages/profile/profile) |
| Ошибка 404 | [/src/pages/error404/error404.html](https://messengerwebchatnow.netlify.app/src/pages/error404/error404) |
| Ошибка 500 | [/src/pages/error500/error500.html](https://messengerwebchatnow.netlify.app/src/pages/error500/error500) |

---

## ⚙️ Используемые технологии

- **Vite** — сборка проекта  
- **TypeScript**  
- **Handlebars** — шаблонизатор  
- **PostCSS** — обработка CSS  
- **ESLint**, **Stylelint**, **EditorConfig** — единый стиль кода  
- **Netlify** — деплой и автодеплой из ветки `deploy`

---

## 💻 Команды проекта

| Команда | Назначение |
|----------|-------------|
| `npm run dev` | Запуск проекта в режиме разработки (порт 3000) |
| `npm run build` | Сборка проекта в папку `dist` |
| `npm run start` | Запуск собранного проекта для предпросмотра |
| `npm run deploy` | Пуш в ветку `deploy` для автодеплоя на Netlify |

---

## 📂 Структура проекта

```src/
├── pages/ # Все страницы проекта
│ ├── login/
│ ├── registration/
│ ├── chats/
│ ├── profile/
│ ├── error404/
│ └── error500/
├── styles/ # Общие стили и переменные
├── utils/ # Вспомогательные модули
└── main.ts # Точка входа приложения
```

---

## 🧩 О проекте

Первая версия Webchat реализует:
- базовую структуру интерфейса мессенджера (прототип);
- многостраничную архитектуру на Handlebars;
- раздельные HTML-файлы для каждой страницы;
- валидацию и заготовки форм;
- деплой и автодеплой на Netlify.
