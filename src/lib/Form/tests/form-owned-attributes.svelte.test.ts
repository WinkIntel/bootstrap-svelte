/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import DateInput from '../form-date-input.svelte';
import DatetimeLocalInput from '../form-datetime-local-input.svelte';
import EmailInput from '../form-email-input.svelte';
import HiddenInput from '../form-hidden-input.svelte';
import ImageInput from '../form-image-input.svelte';
import MonthInput from '../form-month-input.svelte';
import NumberInput from '../form-number-input.svelte';
import PasswordInput from '../form-password-input.svelte';
import RangeInput from '../form-range-input.svelte';
import SearchInput from '../form-search-input.svelte';
import Select from '../form-select.svelte';
import SwitchInput from '../form-switch-input.svelte';
import TelephoneInput from '../form-telephone-input.svelte';
import TextArea from '../form-text-area.svelte';
import TextInput from '../form-text-input.svelte';
import TimeInput from '../form-time-input.svelte';
import UrlInput from '../form-url-input.svelte';
import WeekInput from '../form-week-Input.svelte';

type FixedTypeCase = {
    expectedType: string;
    name: string;
    protectsValidation?: boolean;
    render: () => ReturnType<typeof render>;
};

const fixedTypeCases: FixedTypeCase[] = [
    {
        name: 'DateInput',
        expectedType: 'date',
        render: () => render(DateInput, { props: { id: 'date', name: 'date', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'DatetimeLocalInput',
        expectedType: 'datetime-local',
        render: () =>
            render(DatetimeLocalInput, {
                props: { id: 'datetime', name: 'datetime', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never
            })
    },
    {
        name: 'EmailInput',
        expectedType: 'email',
        render: () => render(EmailInput, { props: { id: 'email', name: 'email', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'HiddenInput',
        expectedType: 'hidden',
        protectsValidation: false,
        render: () => render(HiddenInput, { props: { id: 'hidden', name: 'hidden', type: 'text' } as never })
    },
    {
        name: 'ImageInput',
        expectedType: 'image',
        protectsValidation: false,
        render: () => render(ImageInput, { props: { id: 'image', name: 'image', type: 'text' } as never })
    },
    {
        name: 'MonthInput',
        expectedType: 'month',
        render: () => render(MonthInput, { props: { id: 'month', name: 'month', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'NumberInput',
        expectedType: 'number',
        render: () =>
            render(NumberInput, { props: { id: 'number', name: 'number', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'PasswordInput',
        expectedType: 'text',
        render: () =>
            render(PasswordInput, {
                props: { id: 'password', name: 'password', showPassword: true, type: 'email', 'aria-invalid': 'false', isInvalid: true } as never
            })
    },
    {
        name: 'RangeInput',
        expectedType: 'range',
        protectsValidation: false,
        render: () => render(RangeInput, { props: { id: 'range', name: 'range', type: 'text' } as never })
    },
    {
        name: 'SearchInput',
        expectedType: 'search',
        render: () =>
            render(SearchInput, { props: { id: 'search', name: 'search', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'SwitchInput',
        expectedType: 'checkbox',
        render: () =>
            render(SwitchInput, { props: { id: 'switch', name: 'switch', type: 'radio', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'TelephoneInput',
        expectedType: 'tel',
        render: () =>
            render(TelephoneInput, { props: { id: 'telephone', name: 'telephone', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'TextInput',
        expectedType: 'text',
        render: () => render(TextInput, { props: { id: 'text', name: 'text', type: 'email', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'TimeInput',
        expectedType: 'time',
        render: () => render(TimeInput, { props: { id: 'time', name: 'time', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'UrlInput',
        expectedType: 'url',
        render: () => render(UrlInput, { props: { id: 'url', name: 'url', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never })
    },
    {
        name: 'WeekInput',
        expectedType: 'week',
        render: () => render(WeekInput, { props: { id: 'week', name: 'week', type: 'text', 'aria-invalid': 'false', isInvalid: true } as never })
    }
];

describe('Form owned attributes', () => {
    test.each(fixedTypeCases)(
        '$name protects its owned attributes while forwarding consumer attributes',
        ({ expectedType, protectsValidation = true, render: renderCase }) => {
            const { container } = renderCase();
            const input = container.querySelector('input') as HTMLInputElement;

            expect(input).toHaveAttribute('type', expectedType);
            if (protectsValidation) {
                expect(input).toHaveAttribute('aria-invalid', 'true');
            }
            expect(input).toHaveAttribute('id');
            expect(input).toHaveAttribute('name');
        }
    );

    test.each([
        { multiple: false, name: 'Select single' },
        { multiple: true, name: 'Select multiple' }
    ])('$name protects validation aria-invalid', ({ multiple }) => {
        const { container } = render(Select, { props: { id: 'select', name: 'select', multiple, 'aria-invalid': 'false', isInvalid: true } });
        const select = container.querySelector('select') as HTMLSelectElement;

        expect(select).toHaveAttribute('aria-invalid', 'true');
        expect(select).toHaveAttribute('id', 'select');
        expect(select).toHaveAttribute('name', 'select');
    });

    test('TextArea protects validation aria-invalid while forwarding consumer attributes', () => {
        const { container } = render(TextArea, { props: { id: 'textarea', name: 'textarea', 'aria-invalid': 'false', isInvalid: true } });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;

        expect(textarea).toHaveAttribute('aria-invalid', 'true');
        expect(textarea).toHaveAttribute('id', 'textarea');
        expect(textarea).toHaveAttribute('name', 'textarea');
    });
});
