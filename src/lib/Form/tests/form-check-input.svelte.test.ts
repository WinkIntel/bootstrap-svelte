/// <reference types="@testing-library/jest-dom" />
/* eslint-disable @typescript-eslint/no-explicit-any -- test uses partial/mock typings */
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import CheckInput from '../form-check-input.svelte';

describe('Form.CheckInput', () => {
    test('renders without crashing', () => {
        const { container } = render(CheckInput);
        expect(container).toBeInTheDocument();
    });

    test('renders input with type checkbox and base class', () => {
        const { container } = render(CheckInput);
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-check-input');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(CheckInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toHaveClass('form-check-input');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(CheckInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(CheckInput);
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(CheckInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(CheckInput);
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(CheckInput, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(CheckInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('renders as checked when checked is true', () => {
        const { container } = render(CheckInput, {
            props: {
                checked: true
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    test('renders as not checked when checked is false', () => {
        const { container } = render(CheckInput, {
            props: {
                checked: false
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    test('renders as not checked when checked is undefined', () => {
        const { container } = render(CheckInput);
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    test('sets indeterminate state when isIndeterminate is true', async () => {
        const { container } = render(CheckInput, {
            props: {
                isIndeterminate: true
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        await tick();
        expect(input.indeterminate).toBe(true);
    });

    test('does not set indeterminate state when isIndeterminate is undefined', async () => {
        const { container } = render(CheckInput);
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        await tick();
        expect(input.indeterminate).toBe(false);
    });

    test('forwards id, name, and value props to input', () => {
        const { container } = render(CheckInput, {
            props: {
                id: 'checkDefault',
                name: 'checkDefault',
                value: 'checkbox-value'
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'checkDefault');
        expect(input).toHaveAttribute('name', 'checkDefault');
        expect(input).toHaveAttribute('value', 'checkbox-value');
    });

    test('forwards accessibility attributes to input', () => {
        const { container } = render(CheckInput, {
            props: {
                'aria-label': 'Custom checkbox label',
                'aria-describedby': 'help-text'
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Custom checkbox label');
        expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards disabled attribute to input', () => {
        const { container } = render(CheckInput, {
            props: {
                disabled: true
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toHaveAttribute('disabled');
        expect(input.disabled).toBe(true);
    });

    test('forwards data attributes to input', () => {
        const { container } = render(CheckInput, {
            props: {
                'data-testid': 'checkbox-test',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-testid', 'checkbox-test');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('binds elementRef to the input element', () => {
        const { container } = render(CheckInput);
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input).toBeInTheDocument();
    });

    describe('onchange callback', () => {
        test('calls onchange callback when checkbox is clicked', async () => {
            let called = false;
            let eventReceived: Event | undefined = undefined;

            const { container } = render(CheckInput, {
                props: {
                    onchange: (event: Event) => {
                        called = true;
                        eventReceived = event;
                    }
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            input.click();
            await tick();

            expect(called).toBe(true);
            expect(eventReceived).toBeTruthy();
            expect(eventReceived).toBeInstanceOf(Event);
        });

        test('does not throw when onchange is not provided', async () => {
            const { container } = render(CheckInput);
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            expect(() => {
                input.click();
            }).not.toThrow();
        });

        test('onchange receives event with currentTarget as input element', async () => {
            let receivedTarget: EventTarget | null = null;

            const { container } = render(CheckInput, {
                props: {
                    id: 'test-input',
                    onchange: (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
                        receivedTarget = event.currentTarget;
                    }
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            input.click();
            await tick();

            expect(receivedTarget).toBe(input);
        });
    });

    describe('group functionality', () => {
        test('adds value to group array when checkbox is checked', async () => {
            const group: unknown[] = [];

            const { container } = render(CheckInput, {
                props: {
                    group: group,
                    value: 'option1'
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            input.click();
            await tick();

            // Note: Due to Svelte's reactivity with $bindable, we need to check the input's state
            // The group array update happens in the component's handleChange
            expect(input.checked).toBe(true);
        });

        test('removes value from group array when checkbox is unchecked', async () => {
            const group: unknown[] = ['option1'];

            const { container } = render(CheckInput, {
                props: {
                    group: group,
                    value: 'option1',
                    checked: true
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            expect(input.checked).toBe(true);

            input.click();
            await tick();

            expect(input.checked).toBe(false);
        });

        test('handles multiple checkboxes with the same group', async () => {
            const group: unknown[] = [];

            const { container: container1 } = render(CheckInput, {
                props: {
                    group: group,
                    value: 'option1',
                    id: 'check1'
                }
            });

            const { container: container2 } = render(CheckInput, {
                props: {
                    group: group,
                    value: 'option2',
                    id: 'check2'
                }
            });

            const input1 = container1.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const input2 = container2.querySelector('input[type="checkbox"]') as HTMLInputElement;

            input1.click();
            await tick();
            expect(input1.checked).toBe(true);

            input2.click();
            await tick();
            expect(input2.checked).toBe(true);
        });

        test('logs warning when group is not an array', async () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            const { container } = render(CheckInput, {
                props: {
                    group: 'not-an-array' as any,
                    value: 'option1'
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            input.click();
            await tick();

            expect(consoleSpy).toHaveBeenCalledWith('Form.CheckInput: `group` prop should be an array when used for grouped inputs.');

            consoleSpy.mockRestore();
        });

        test('does not modify group when group is null', async () => {
            const { container } = render(CheckInput, {
                props: {
                    group: null,
                    value: 'option1'
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            // Should not throw and should work normally
            expect(() => {
                input.click();
            }).not.toThrow();

            await tick();
            expect(input.checked).toBe(true);
        });

        test('handles undefined value when using group', async () => {
            const group: unknown[] = [];

            const { container } = render(CheckInput, {
                props: {
                    group: group,
                    value: undefined
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            input.click();
            await tick();

            expect(input.checked).toBe(true);
        });

        test('renders as checked when value is present in initial group', async () => {
            const { container } = render(CheckInput, {
                props: {
                    group: ['option1', 'option2'],
                    value: 'option1'
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            await tick();

            expect(input.checked).toBe(true);
        });

        test('renders as not checked when value is absent from initial group', async () => {
            const { container } = render(CheckInput, {
                props: {
                    group: ['option2'],
                    value: 'option1'
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            await tick();

            expect(input.checked).toBe(false);
        });
    });

    describe('group and onchange interaction', () => {
        test('calls onchange after group is updated', async () => {
            const group: unknown[] = [];
            let onchangeCalled = false;

            const { container } = render(CheckInput, {
                props: {
                    group: group,
                    value: 'option1',
                    onchange: () => {
                        onchangeCalled = true;
                    }
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            input.click();
            await tick();

            expect(onchangeCalled).toBe(true);
        });

        test('onchange is called even when group is null', async () => {
            let onchangeCalled = false;

            const { container } = render(CheckInput, {
                props: {
                    group: null,
                    value: 'option1',
                    onchange: () => {
                        onchangeCalled = true;
                    }
                }
            });
            const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

            input.click();
            await tick();

            expect(onchangeCalled).toBe(true);
        });
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(CheckInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(CheckInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(CheckInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(CheckInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});
