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
export declare type PageUpdateFormInputValues = {
    bookId?: string;
    bookTitle?: string;
    pageId?: string;
    recipeStory?: string;
    steps?: string[];
};
export declare type PageUpdateFormValidationValues = {
    bookId?: ValidationFunction<string>;
    bookTitle?: ValidationFunction<string>;
    pageId?: ValidationFunction<string>;
    recipeStory?: ValidationFunction<string>;
    steps?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PageUpdateFormOverridesProps = {
    PageUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    bookId?: PrimitiveOverrideProps<AutocompleteProps>;
    bookTitle?: PrimitiveOverrideProps<TextFieldProps>;
    pageId?: PrimitiveOverrideProps<TextFieldProps>;
    recipeStory?: PrimitiveOverrideProps<TextFieldProps>;
    steps?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PageUpdateFormProps = React.PropsWithChildren<{
    overrides?: PageUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    page?: any;
    onSubmit?: (fields: PageUpdateFormInputValues) => PageUpdateFormInputValues;
    onSuccess?: (fields: PageUpdateFormInputValues) => void;
    onError?: (fields: PageUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PageUpdateFormInputValues) => PageUpdateFormInputValues;
    onValidate?: PageUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PageUpdateForm(props: PageUpdateFormProps): React.ReactElement;
