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
        container: 'bg-discord-blurple dark:bg-discord-blurple',
        label: 'text-white dark:text-white',
        indicator: 'text-white dark:text-white',
      },
      secondary: {
        container: 'bg-discord-surface dark:bg-discord-elevated',
        label: 'text-text-secondary dark:text-text-secondary',
        indicator: 'text-text-secondary dark:text-text-secondary',
      },
      outline: {
        container: 'border-discord-border dark:border-discord-border border',
        label: 'text-text-primary dark:text-text-primary',
        indicator: 'text-text-primary dark:text-text-primary',
      },
      destructive: {
        container: 'bg-discord-red dark:bg-discord-red',
        label: 'text-white dark:text-white',
        indicator: 'text-white dark:text-white',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-primary dark:text-primary underline',
        indicator: 'text-primary dark:text-primary',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-primary dark:text-primary',
        indicator: 'text-primary dark:text-primary',
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
        container: 'bg-discord-hover dark:bg-discord-hover',
        label: 'text-text-muted dark:text-text-muted',
        indicator: 'text-text-muted dark:text-text-muted',
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
