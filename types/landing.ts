export type Payload = {
  image?: string;
  images?: string[];
  link?: string;
  mode?: 'query' | 'refs';
  name?: string;
  refKey?: string;
  params?: Record<string, unknown>;
};

export type Block = {
  id: string;
  type: string;
  payload: Payload;
};

export function uid(prefix = '') {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}
