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
  const base = 'max-h-24 text-base leading-5 bg-transparent';
  const errorBg = isOverLimit
    ? 'bg-red-50 rounded-lg px-2 py-1 dark:bg-red-900/20'
    : 'bg-transparent';
  const text = isDark ? 'text-gray-100' : 'text-black';
  return `${base} ${errorBg} ${text}`;
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
    <View className="px-4 pb-4">
      <View className="relative rounded-2xl bg-white p-4 dark:bg-gray-800">
        <View className="flex-row items-end">
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

          <View className="ml-3 h-8 w-8 items-center justify-center">
            <TouchableOpacity
              onPress={handleSend}
              disabled={!canSend}
              className={`rounded-full bg-primary-500 p-1.5 dark:bg-primary-600 ${
                canSend ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Text className="text-sm font-semibold text-white">
                ↑
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
