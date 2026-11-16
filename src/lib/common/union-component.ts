import type { Component } from 'svelte';

/**
 * Package-private equivalent of Component<Props, {}, Bindings> for the five
 * emitted union-prop components. Evaluating Svelte's `Bindings extends keyof
 * Props` constraint eagerly intersects hundreds of DOM keys across union arms.
 * Keep the original props and binding literals, and derive the call internals,
 * return methods and static metadata from the public Svelte Component type.
 * Only $set depends on Props; its original Partial<Props> signature is retained.
 */
export type ComponentWithUnionProps<Props, Bindings extends string> = Omit<Component, 'z_$$bindings'> & {
    (
        this: void,
        internals: Parameters<Component>[0],
        props: Props
    ): Omit<ReturnType<Component>, '$set'> & {
        $set?(props: Partial<Props>): void;
    };
    z_$$bindings?: Bindings;
};
