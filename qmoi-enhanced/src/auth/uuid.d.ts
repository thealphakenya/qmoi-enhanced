declare module "uuid" {
  export function v1(): string;
  export function v3(name: string | ArrayLike<number>, namespace: string | ArrayLike<number>): string;
  export function v4(): string;
  export function v5(name: string | ArrayLike<number>, namespace: string | ArrayLike<number>): string;
}
