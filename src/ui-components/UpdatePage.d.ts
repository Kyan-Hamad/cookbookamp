/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { AutocompleteProps, GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UpdatePageInputValues = {
    bookId?: string;
    bookTitle?: string;
    pageId?: string;
    recipeStory?: string;
    steps?: string[];
};
export declare type UpdatePageValidationValues = {
    bookId?: ValidationFunction<string>;
    bookTitle?: ValidationFunction<string>;
    pageId?: ValidationFunction<string>;
    recipeStory?: ValidationFunction<string>;
    steps?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UpdatePageOverridesProps = {
    UpdatePageGrid?: PrimitiveOverrideProps<GridProps>;
    bookId?: PrimitiveOverrideProps<AutocompleteProps>;
    bookTitle?: PrimitiveOverrideProps<TextFieldProps>;
    pageId?: PrimitiveOverrideProps<TextFieldProps>;
    recipeStory?: PrimitiveOverrideProps<TextFieldProps>;
    steps?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UpdatePageProps = React.PropsWithChildren<{
    overrides?: UpdatePageOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UpdatePageInputValues) => UpdatePageInputValues;
    onSuccess?: (fields: UpdatePageInputValues) => void;
    onError?: (fields: UpdatePageInputValues, errorMessage: string) => void;
    onChange?: (fields: UpdatePageInputValues) => UpdatePageInputValues;
    onValidate?: UpdatePageValidationValues;
} & React.CSSProperties>;
export default function UpdatePage(props: UpdatePageProps): React.ReactElement;
