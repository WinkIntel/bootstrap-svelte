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

export type FormCheckInputProps = InputElement & {
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
export type FormColorInputProps = InputElement & {
    isInvalid?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormDateInputProps = InputElement & {
    isInvalid?: boolean;
    isPlaintext?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormDatetimeLocalInputProps = InputElement & {
    isInvalid?: boolean;
    isPlaintext?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormEmailInputProps = InputElement & {
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
export type FormFileInputProps = InputElement & {
    isInvalid?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormFloatingProps = DivElement;
export type FormHelperTextProps = DivElement;
export type FormHiddenInputProps = InputElement;
export type FormImageInputProps = InputElement;
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
export type FormMonthInputProps = InputElement & {
    isInvalid?: boolean;
    isPlaintext?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormNumberInputProps = InputElement & {
    isInvalid?: boolean;
    isPlaintext?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormPasswordInputProps = InputElement & {
    autocomplete?: 'current-password' | 'new-password' | 'off' | 'on';
    'data-form-type'?: string;
    'data-lpignore'?: string;
    isInvalid?: boolean;
    isPlaintext?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
    showPassword?: boolean;
};
export type FormRadioInputProps = InputElement & {
    isInvalid?: boolean;
    isValid?: boolean;
};
export type FormRangeInputProps = InputElement;
export type FormRadioLabelProps = LabelElement;
export type FormRootProps = FormElement & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enhance?: typeof enhance | ((el: HTMLFormElement, events?: any) => ReturnType<typeof enhance>); // Accepts a custom enhance function (e.g., SuperForm's enhance)
    needsValidation?: boolean;
    wasValidated?: boolean;
};
export type FormSearchInputProps = InputElement & {
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
export type FormSwitchInputProps = InputElement & {
    isInvalid?: boolean;
    isValid?: boolean;
};
export type FormSwitchLabelProps = LabelElement;
export type FormTelephoneInputProps = InputElement & {
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
export type FormTextInputProps = InputElement & {
    'data-form-type'?: string;
    'data-lpignore'?: string;
    isInvalid?: boolean;
    isPlaintext?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormTimeInputProps = InputElement & {
    isInvalid?: boolean;
    isPlaintext?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormUrlInputProps = InputElement & {
    isInvalid?: boolean;
    isPlaintext?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
export type FormWeekInputProps = InputElement & {
    isInvalid?: boolean;
    isPlaintext?: boolean;
    isValid?: boolean;
    sizing?: FormControlSize;
};
