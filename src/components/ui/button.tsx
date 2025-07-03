import React from 'react';
import type { PressableProps, View } from 'react-native';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const button = tv({
  slots: {
    container:
      'my-2 flex flex-row items-center justify-center rounded-[22px] px-4',
    label: 'font-inter text-base font-semibold',
    indicator: 'h-6 text-white',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-primary-500 dark:bg-primary-500',
        label: 'text-white dark:text-white',
        indicator: 'text-white dark:text-white',
      },
      secondary: {
        container: 'bg-gray-850 dark:bg-gray-700',
        label: 'text-gray-500 dark:text-gray-300',
        indicator: 'text-gray-500 dark:text-gray-300',
      },
      outline: {
        container: 'border-subtle dark:border-interactive border',
        label: 'text-gray-100 dark:text-gray-100',
        indicator: 'text-gray-100 dark:text-gray-100',
      },
      destructive: {
        container: 'bg-red-500 dark:bg-red-500',
        label: 'text-white dark:text-white',
        indicator: 'text-white dark:text-white',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-primary-500 dark:text-primary-500 underline',
        indicator: 'text-primary-500 dark:text-primary-500',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-primary-500 dark:text-primary-500',
        indicator: 'text-primary-500 dark:text-primary-500',
      },
    },
    size: {
      default: {
        container: 'h-10 px-4',
        label: 'text-base',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-xl',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-sm',
        indicator: 'h-2',
      },
      icon: { container: 'size-9' },
    },
    disabled: {
      true: {
        container: 'bg-gray-700 dark:bg-gray-700',
        label: 'text-muted dark:text-muted',
        indicator: 'text-muted dark:text-muted',
      },
    },
    fullWidth: {
      true: {
        container: '',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
  },
});

type ButtonVariants = VariantProps<typeof button>;
interface Props extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      className = '',
      testID,
      textClassName = '',
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size }),
      [variant, disabled, size]
    );

    return (
      <Pressable
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
        ref={ref}
        testID={testID}
      >
        {props.children ? (
          props.children
        ) : (
          <>
            {loading ? (
              <ActivityIndicator
                size="small"
                className={styles.indicator()}
                testID={testID ? `${testID}-activity-indicator` : undefined}
              />
            ) : (
              <Text
                testID={testID ? `${testID}-label` : undefined}
                className={styles.label({ className: textClassName })}
              >
                {text}
              </Text>
            )}
          </>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';
