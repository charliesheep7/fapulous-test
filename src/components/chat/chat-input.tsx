import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/ui';

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

function getInputStyles(isOverLimit: boolean, isDark: boolean) {
  const base = 'max-h-24 rounded-2xl border px-4 py-3 text-base leading-5';
  const border = isOverLimit
    ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
    : 'border-discord-inputBorder bg-discord-input dark:border-discord-inputBorder dark:bg-discord-input';
  const text = isDark ? 'text-text-primary' : 'text-black';
  return `${base} ${border} ${text}`;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: Props) {
  const [message, setMessage] = useState('');
  const { colorScheme } = useColorScheme();

  const wordCount = countWords(message);
  const isOverLimit = wordCount > 200;
  const canSend = message.trim().length > 0 && !isOverLimit && !disabled;

  const handleSend = () => {
    if (canSend) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View className="border-discord-border dark:border-discord-border dark:bg-discord-background border-t bg-white p-4">
      <View className="flex-row items-end space-x-3">
        <View className="flex-1">
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            placeholderTextColor={
              colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'
            }
            multiline
            editable={!disabled}
            className={getInputStyles(isOverLimit, colorScheme === 'dark')}
            style={{ textAlignVertical: 'top', maxHeight: 100 }}
          />
          {isOverLimit && (
            <Text className="mt-1 text-xs text-red-500 dark:text-red-400">
              Message too long ({wordCount}/200 words)
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          className={`rounded-full p-3 ${
            canSend
              ? 'bg-primary-500 dark:bg-primary-600'
              : 'bg-discord-surface dark:bg-discord-elevated'
          }`}
        >
          <Text
            className={`text-lg font-semibold ${
              canSend
                ? 'text-white'
                : 'text-text-secondary dark:text-text-secondary'
            }`}
          >
            →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
