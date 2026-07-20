import type { enhance } from '$app/forms';
import type {
    DivElement,
    FormControlSize,
    FormElement,
    FormInputGroupSize,
    InputElement,
    LabelElement,
    SelectElement,
    SpanElement,
    TextAreaElement
} from '$lib/common/types.js';

type FixedInputType<Type extends string> = {
    /** The matching literal remains accepted; mismatched input types are rejected because specialized inputs own this attribute. */
    type?: Type;
};

export type FormCheckInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'checkbox'> & {
        isIndeterminate?: boolean;
        isInvalid?: boolean;
        isValid?: boolean;
    };
export type FormCheckLabelProps = (SpanElement | LabelElement) & {
    elementType?: 'label' | 'span';
};
export type FormCheckProps = DivElement & {
    isInline?: boolean;
    isSwitch?: boolean;
};
export type FormColorInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'color'> & {
        isInvalid?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormDateInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'date'> & {
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormDatetimeLocalInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'datetime-local'> & {
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormEmailInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'email'> & {
        'data-form-type'?: string;
        'data-lpignore'?: string;
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormFeedbackProps = DivElement & {
    isInvalid?: boolean;
    isTooltip?: boolean;
    isValid?: boolean;
};
export type FormFileInputProps = Omit<InputElement, 'files' | 'type'> &
    FixedInputType<'file'> & {
        files?: FileList | null;
        isInvalid?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormFloatingProps = DivElement;
export type FormHelperTextProps = DivElement;
export type FormHiddenInputProps = Omit<InputElement, 'type'> & FixedInputType<'hidden'>;
export type FormImageInputProps = Omit<InputElement, 'type'> & FixedInputType<'image'>;
export type FormInputGroupProps = DivElement & {
    hasValidation?: boolean;
    noWrap?: boolean;
    sizing?: FormInputGroupSize;
};
export type FormInputGroupTextProps = (SpanElement | LabelElement) & {
    elementType?: 'span' | 'label';
};
export type FormInputLabelProps = LabelElement & {
    isFloating?: boolean;
};
export type FormMonthInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'month'> & {
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormNumberInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'number'> & {
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormPasswordInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'password'> & {
        autocomplete?: 'current-password' | 'new-password' | 'off' | 'on';
        'data-form-type'?: string;
        'data-lpignore'?: string;
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
        showPassword?: boolean;
    };
export type FormRadioInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'radio'> & {
        isInvalid?: boolean;
        isValid?: boolean;
    };
export type FormRangeInputProps = Omit<InputElement, 'type'> & FixedInputType<'range'>;
export type FormRadioLabelProps = LabelElement;
export type FormRootProps = FormElement & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enhance?: typeof enhance | ((el: HTMLFormElement, events?: any) => ReturnType<typeof enhance>); // Accepts a custom enhance function (e.g., SuperForm's enhance)
    needsValidation?: boolean;
    wasValidated?: boolean;
};
export type FormSearchInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'search'> & {
        'data-form-type'?: string;
        'data-lpignore'?: string;
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormSelectProps = SelectElement & {
    isInvalid?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormSwitchInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'checkbox'> & {
        isInvalid?: boolean;
        isValid?: boolean;
    };
export type FormSwitchLabelProps = LabelElement;
export type FormTelephoneInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'tel'> & {
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        /**
         * Optional input mask template (or list of templates) applied as the user types.
         * Use `#` as the digit placeholder; any other character (`(`, `)`, `-`, `.`,
         * space, `+`, etc.) is treated as a literal and inserted automatically. When
         * provided as an array, the mask whose digit-slot count fits the typed digit
         * count is chosen; the last mask in the array is used as the fallback when
         * the user types more digits than any mask can hold.
         *
         * `mask` is independent of `pattern` — `pattern` is left untouched and
         * continues to drive native browser validation only.
         *
         * @example "(###) ###-####"
         * @example ["###-###-####", "(###) ###-####"]
         */
        mask?: string | string[];
        sizing?: FormControlSize;
    };
export type FormTextAreaProps = TextAreaElement & {
    isInvalid?: boolean;
    isResizable?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormTextInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'text'> & {
        'data-form-type'?: string;
        'data-lpignore'?: string;
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormTimeInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'time'> & {
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormUrlInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'url'> & {
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
export type FormWeekInputProps = Omit<InputElement, 'type'> &
    FixedInputType<'week'> & {
        isInvalid?: boolean;
        isPlaintext?: boolean;
        isValid?: boolean;
        sizing?: FormControlSize;
    };
