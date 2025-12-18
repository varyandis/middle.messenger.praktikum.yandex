import { Block, type Props } from "../../core/Block";
import Handlebars from "handlebars";
import template from "./chats.hbs?raw";
import "./chats.css";
import { validateField } from "../../utils/validation";
import { router } from "../../core/routerInstance";
import { store } from "../../core/storeInstance";
import { chatsController } from "../../controllers/ChatsController";
import type { ChatItem } from "../../api/ChatsAPI";

type ChatItemView = ChatItem & {
  isActive: boolean;
};

type ChatsProps = Props & {
  chats: ChatItemView[];
  selectedChatId: number | null;
  selectedChatTitle: string;
  isChatSelected: boolean;

  messages: Array<{ user_id: number; content: string; time: string }>;
  userId: number | null;
};

const getChatsProps = (): ChatsProps => {
  const state = store.getState();

  const rawChats = (state.chats as ChatItem[] | undefined) ?? [];
  const selectedChatId = (state.selectedChatId as number | null) ?? null;

  const chats: ChatItemView[] = rawChats.map((c) => ({
    ...c,
    isActive: c.id === selectedChatId,
  }));

  const selectedChat = rawChats.find((c) => c.id === selectedChatId) ?? null;

  const user = (state.user as { id: number } | null) ?? null;
  const userId = user?.id ?? null;

  const messagesByChat =
    (state.messagesByChat as
      | Record<
          number,
          Array<{ user_id: number; content: string; time: string }>
        >
      | undefined) ?? {};

  const messages = selectedChatId ? messagesByChat[selectedChatId] ?? [] : [];

  return {
    chats,
    selectedChatId,
    selectedChatTitle: selectedChat?.title ?? "",
    isChatSelected: Boolean(selectedChat),

    messages,
    userId,
  };
};

Handlebars.registerHelper(
  "isMyMessage",
  (msgUserId: number, myId: number | null) => {
    if (!myId) return false;
    return msgUserId === myId;
  }
);

export class ChatsPage extends Block<ChatsProps> {
  private handleStoreUpdate = () => {
    this.setProps(getChatsProps());
  };

  constructor() {
    super("div", {
      ...getChatsProps(),

      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          const profileLink = target.closest(
            ".chats__profile"
          ) as HTMLAnchorElement | null;
          if (profileLink) {
            e.preventDefault();
            router.go("/settings");
            return;
          }

          const createBtn = target.closest(
            ".chats__create"
          ) as HTMLButtonElement | null;
          if (createBtn) {
            e.preventDefault();

            const title = window.prompt("Название чата");
            if (!title) return;

            void chatsController.createChat(title.trim());
            return;
          }

          const chatItem = target.closest(
            ".chats__item"
          ) as HTMLLIElement | null;
          if (chatItem) {
            const id = chatItem.dataset.chatId;
            if (!id) return;

            const chatId = Number(id);
            if (Number.isNaN(chatId)) return;

            store.set("selectedChatId", chatId);
            localStorage.setItem("selectedChatId", String(chatId));

            void chatsController.connectToChat(chatId);
            return;
          }

          const menuItem = target.closest(
            ".chat__menu-item"
          ) as HTMLButtonElement | null;
          if (menuItem) {
            const action = menuItem.dataset.action;
            const chatId =
              (store.getState().selectedChatId as number | null) ?? null;

            if (!chatId) {
              alert("Сначала выберите чат");
              return;
            }

            const menu = this.element?.querySelector(
              ".chat__menu"
            ) as HTMLElement | null;
            menu?.classList.remove("chat__menu--open");

            if (action === "delete-chat") {
              const ok = window.confirm("Удалить чат?");
              if (!ok) return;

              void chatsController.deleteChat(chatId);
              return;
            }

            if (action === "add-user") {
              const login = window.prompt("Логин пользователя");
              if (!login?.trim()) return;

              void chatsController.addUserByLogin(chatId, login.trim());
              return;
            }

            if (action === "remove-user") {
              const login = window.prompt("Логин пользователя");
              if (!login?.trim()) return;

              void chatsController.removeUserByLogin(chatId, login.trim());
              return;
            }
          }

          const menuBtn = this.element?.querySelector(
            ".chat__menu-btn"
          ) as HTMLElement | null;
          const menu = this.element?.querySelector(
            ".chat__menu"
          ) as HTMLElement | null;

          if (menuBtn && menu) {
            if (menuBtn.contains(target)) {
              menu.classList.toggle("chat__menu--open");
              return;
            }

            if (!menu.contains(target) && !menuBtn.contains(target)) {
              menu.classList.remove("chat__menu--open");
            }
          }
        },

        input: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (!target.classList.contains("chat__input")) return;

          const sendBtn = this.element?.querySelector(
            ".chat__send-btn"
          ) as HTMLButtonElement | null;
          if (!sendBtn) return;

          const { isValid } = validateField("message", target.value);
          sendBtn.disabled = !isValid;
        },

        submit: (e: Event) => {
          const form = e.target as HTMLFormElement;
          if (form.name !== "messageForm") return;

          e.preventDefault();
          e.stopPropagation();

          const input = form.querySelector(".chat__input") as HTMLInputElement;
          const sendBtn = form.querySelector(
            ".chat__send-btn"
          ) as HTMLButtonElement;

          const { isValid } = validateField("message", input.value);
          if (!isValid) return;

          const data = new FormData(form);
          const raw = Object.fromEntries(data.entries()) as Record<
            string,
            string
          >;

          const message = String(raw.message ?? "");
          chatsController.sendMessage(message);

          input.value = "";
          sendBtn.disabled = true;
        },
      },
    });

    store.onUpdated(this.handleStoreUpdate);
  }

  protected componentDidMount(): void {
    const sendBtn = this.element?.querySelector(
      ".chat__send-btn"
    ) as HTMLButtonElement | null;
    if (sendBtn) {
      sendBtn.disabled = true;
    }

    void chatsController.fetchChats().then(() => {
      const saved = localStorage.getItem("selectedChatId");
      if (!saved) return;

      const chatId = Number(saved);
      if (Number.isNaN(chatId)) return;

      store.set("selectedChatId", chatId);
      void chatsController.connectToChat(chatId);
    });
  }

  protected componentDidHide(): void {
    chatsController.disconnect();
  }

  render(): string {
    return Handlebars.compile(template)(this.props);
  }
}
