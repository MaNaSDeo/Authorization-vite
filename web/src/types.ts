import { ChangeEvent } from "react";

export interface InputFieldObject {
  label: string;
  tag: string;
  type: string;
  placeholder: string;
}

export type InputFields = InputFieldObject[];

export type FormStateKey = InputFields[number]["tag"];

export interface InputProps {
  label: string;
  tag: FormStateKey;
  placeholder: string;
  type: string;
  value: string;
  error: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

type FormField = string;
export type FormState = Record<string, FormField>;
