import type { Component, ComponentProps } from 'svelte';
import type { ButtonRootProps } from '$lib/Button/types.js';
import type { Dropdown } from '$lib/Dropdown/index.js';
import type { Form } from '$lib/Form/index.js';
import type { ListGroup } from '$lib/ListGroup/index.js';
import type { ComponentWithUnionProps } from '$lib/common/union-component.js';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Assert<T extends true> = T;
type Extends<A, B> = [A] extends [B] ? true : false;

// Compare against the real public Svelte type on concrete props that do not hit
// its union-key expansion limit. Both directions cover complete assignability.
type Props = { required: string; optional?: number; checked?: boolean; value?: string };
type EmptyExports = Record<never, never>;
type Reference = Component<Props, EmptyExports, 'checked' | 'value'>;
type Candidate = ComponentWithUnionProps<Props, 'checked' | 'value'>;
type ReferenceParity = [
    Assert<Extends<Candidate, Reference>>,
    Assert<Extends<Reference, Candidate>>,
    Assert<Equal<Parameters<Candidate>, Parameters<Reference>>>,
    Assert<Equal<ThisParameterType<Candidate>, ThisParameterType<Reference>>>,
    Assert<Extends<ReturnType<Candidate>, ReturnType<Reference>>>,
    Assert<Extends<ReturnType<Reference>, ReturnType<Candidate>>>,
    Assert<Equal<ReturnType<Candidate>['$on'], ReturnType<Reference>['$on']>>,
    Assert<Equal<ReturnType<Candidate>['$set'], ReturnType<Reference>['$set']>>,
    Assert<Equal<Pick<Candidate, keyof Reference>, Pick<Reference, keyof Reference>>>,
    Assert<Equal<keyof Candidate, keyof Reference>>,
    Assert<Equal<ComponentProps<Candidate>, Props>>
];

// Preserve each actual full prop union, its binding literals and $set payload;
// never instantiate Component<UnionProps>, which is the compiler failure itself.
type OriginalProps = {
    Button: ButtonRootProps;
    DropdownToggle: Dropdown.ToggleProps;
    FormCheckLabel: Form.CheckLabelProps;
    FormInputGroupText: Form.InputGroupTextProps;
    ListGroup: ListGroup.RootProps;
};
type Bindings = {
    Button: 'value' | 'elementRef';
    DropdownToggle: 'elementRef';
    FormCheckLabel: 'elementRef';
    FormInputGroupText: 'elementRef';
    ListGroup: 'elementRef';
};
type Components = { [K in keyof OriginalProps]: ComponentWithUnionProps<OriginalProps[K], Bindings[K]> };
type PropsParity = Assert<Equal<{ [K in keyof Components]: ComponentProps<Components[K]> }, OriginalProps>>;
type BindingsParity = Assert<Equal<{ [K in keyof Components]: Components[K]['z_$$bindings'] }, { [K in keyof Bindings]: Bindings[K] | undefined }>>;
type SetParity = Assert<
    Equal<
        { [K in keyof Components]: Parameters<NonNullable<ReturnType<Components[K]>['$set']>> },
        { [K in keyof OriginalProps]: [props: Partial<OriginalProps[K]>] }
    >
>;
// Distribute before computing keyof to validate the bindings on every union arm.
type EachBindingValid<P, B extends string> = P extends object ? (Exclude<B, keyof P> extends never ? true : false) : false;
type ValidBindings = Assert<
    Equal<{ [K in keyof OriginalProps]: EachBindingValid<OriginalProps[K], Bindings[K]> }, { [K in keyof OriginalProps]: true }>
>;

// Distributing first also allows direct equivalence against the real Svelte
// Component for every original union arm, including all native event handlers.
type ArmParity<P, B extends string> = P extends object
    ? Extends<ComponentWithUnionProps<P, Extract<B, keyof P>>, Component<P, EmptyExports, Extract<B, keyof P>>> extends true
        ? Extends<Component<P, EmptyExports, Extract<B, keyof P>>, ComponentWithUnionProps<P, Extract<B, keyof P>>>
        : false
    : false;
type AllArmParity = Assert<Equal<{ [K in keyof OriginalProps]: ArmParity<OriginalProps[K], Bindings[K]> }, { [K in keyof OriginalProps]: true }>>;

// @ts-expect-error Required props must remain required.
const missingRequired: ComponentProps<Candidate> = {};
// @ts-expect-error The original Button href/value union remains discriminated.
const invalidButton: ComponentProps<Components['Button']> = { href: '/', value: 'invalid' };
const labelMember: ComponentProps<Components['FormCheckLabel']> = { for: 'check', elementType: 'label' };
const listMember: ComponentProps<Components['ListGroup']> = { isNumbered: true, horizontalOnBreakpoint: 'md' };
void missingRequired;
void invalidButton;
void labelMember;
void listMember;
export type { ReferenceParity, PropsParity, BindingsParity, SetParity, ValidBindings, AllArmParity };
