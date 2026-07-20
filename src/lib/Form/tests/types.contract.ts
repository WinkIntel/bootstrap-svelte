import type { Navbar } from '$lib/Navbar/index.js';
import type { Form } from '../index.js';

const ownedAttributeCompatibility = {
    check: { type: 'checkbox' } satisfies Form.CheckInputProps,
    color: { type: 'color' } satisfies Form.ColorInputProps,
    date: { type: 'date' } satisfies Form.DateInputProps,
    datetime: { type: 'datetime-local' } satisfies Form.DatetimeLocalInputProps,
    email: { type: 'email' } satisfies Form.EmailInputProps,
    file: { type: 'file', value: '' } satisfies Form.FileInputProps,
    hidden: { type: 'hidden' } satisfies Form.HiddenInputProps,
    image: { type: 'image' } satisfies Form.ImageInputProps,
    month: { type: 'month' } satisfies Form.MonthInputProps,
    number: { type: 'number' } satisfies Form.NumberInputProps,
    password: { type: 'password' } satisfies Form.PasswordInputProps,
    radio: { type: 'radio' } satisfies Form.RadioInputProps,
    range: { type: 'range' } satisfies Form.RangeInputProps,
    search: { type: 'search' } satisfies Form.SearchInputProps,
    switch: { type: 'checkbox' } satisfies Form.SwitchInputProps,
    telephone: { type: 'tel' } satisfies Form.TelephoneInputProps,
    text: { type: 'text' } satisfies Form.TextInputProps,
    time: { type: 'time' } satisfies Form.TimeInputProps,
    url: { type: 'url' } satisfies Form.UrlInputProps,
    week: { type: 'week' } satisfies Form.WeekInputProps,
    toggler: { type: 'button' } satisfies Navbar.TogglerProps
};

const invalidRadioType: Form.RadioInputProps = {
    // @ts-expect-error Specialized inputs retain only their matching literal type.
    type: 'text'
};

void ownedAttributeCompatibility;
void invalidRadioType;
