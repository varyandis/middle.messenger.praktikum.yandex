import type { Block } from './Block';

export function render(query: string, block: Block): HTMLElement | null {
  const root = document.querySelector<HTMLElement>(query);

  if (!root) return null;

  root.innerHTML = '';

  const content = block.getContent();

  if (content) {
    root.append(content);
    block.dispatchComponentDidMount();
  }

  return root;
}
