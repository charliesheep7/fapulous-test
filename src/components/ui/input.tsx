import * as React from 'react';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import { I18nManager, StyleSheet, View } from 'react-native';
import { TextInput as NTextInput } from 'react-native';
import { tv } from 'tailwind-variants';

import { Text } from './text';

const inputTv = tv({
  slots: {
    container: 'mb-2',
    label: 'text-gray-300 mb-1 text-lg dark:text-gray-100',
    input:
      'mt-0 rounded-xl border-[0.5px] border-gray-300 bg-gray-100 px-4 py-3 font-inter text-base font-medium leading-5 dark:border-gray-700 dark:bg-gray-800 dark:text-white',
  },

  variants: {
    focused: {
      true: {
        input: 'border-gray-400 dark:border-gray-300',
      },
    },
    error: {
      true: {
        input: 'border-red-600',
        label: 'text-red-600 dark:text-red-600',
      },
    },
    disabled: {
      true: {
        input: 'bg-gray-200',
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
}

type InputProps = NInputProps;

export const Input = React.forwardRef<NTextInput, NInputProps>((props, ref) => {
  const { label, error, testID, ...inputProps } = props;
  const [isFocussed, setIsFocussed] = React.useState(false);
  const onBlur = React.useCallback(() => setIsFocussed(false), []);
  const onFocus = React.useCallback(() => setIsFocussed(true), []);

  const styles = React.useMemo(
    () =>
      inputTv({
        error: Boolean(error),
        focused: isFocussed,
        disabled: Boolean(props.disabled),
      }),
    [error, isFocussed, props.disabled]
  );

  return (
    <View className={styles.container()}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={styles.label()}
        >
          {label}
        </Text>
      )}
      <NTextInput
        testID={testID}
        ref={ref}
        placeholderTextColor="#94A3B8"
        className={styles.input()}
        onBlur={onBlur}
        onFocus={onFocus}
        {...inputProps}
        style={StyleSheet.flatten([
          { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' },
          { textAlign: I18nManager.isRTL ? 'right' : 'left' },
          inputProps.style,
        ])}
      />
      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          className="text-sm text-red-400 dark:text-red-600"
        >
          {error}
        </Text>
      )}
    </View>
  );
});

export type ControlledInputProps<T extends FieldValues> = InputProps & {
  name: Path<T>;
  control: Control<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
};

// we should not forget the forwardRef here as well
export const ControlledInput = <T extends FieldValues>({
  name,
  control,
  rules,
  ...inputProps
}: ControlledInputProps<T>) => {
  const { field, fieldState } = useController({ control, name, rules });
  return (
    <Input
      ref={field.ref}
      onChangeText={field.onChange}
      value={field.value}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
};
