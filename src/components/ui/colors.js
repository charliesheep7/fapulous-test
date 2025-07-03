export default {
  white: '#ffffff',
  black: '#000000',

  // Discord-inspired dark theme colors
  discord: {
    // Background hierarchy (darkest to lightest) - Updated to match real Discord mobile
    background: '#131317', // rgb(19,19,23) - Main background (actual Discord mobile)
    surface: '#1C1D23', // rgb(28,29,35) - Chat background, lighter background areas
    elevated: '#383A43', // rgb(56,58,67) - Button fill, cards, interactive elements
    input: '#24272D', // rgb(36,39,45) - Input fields, text areas (more accurate)
    hover: '#404248', // Slightly lighter than elevated for hover states

    // Text hierarchy - Updated with precise Discord mobile values
    text: '#CBCCD1', // rgb(203,204,209) - Chat text, main content text
    textPrimary: '#F5F5F5', // rgb(245,245,245) - Chat username, primary headers
    textSecondary: '#818491', // rgb(129,132,145) - Date/time, tips, secondary info
    textMuted: '#6B7280', // Even more muted text

    // Brand colors
    blurple: '#5965F2', // rgb(89,101,242) - Action buttons (continue, etc.)
    accent: '#7A8EF9', // rgb(122,142,249) - Selected text, links

    // Status colors
    green: '#23A55A', // Discord green
    red: '#ED4245', // Discord red
    yellow: '#FEE75C', // Discord yellow

    // Borders and dividers
    border: '#2E2F35', // Subtle borders between surface and elevated
    borderLight: '#383A43', // Same as elevated for consistency

    // Additional utility colors for migration
    cardBorder: '#2E2F35', // For card outlines
    inputBorder: '#383A43', // For input field borders
    success: '#23A55A', // Maps to discord.green
    error: '#ED4245', // Maps to discord.red
    warning: '#FEE75C', // Maps to discord.yellow
  },

  // Keep existing color scales for compatibility, but update primary
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#5965F2', // rgb(89,101,242) - Discord blurple for action buttons
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Update charcoal to match Discord backgrounds
  charcoal: {
    50: '#F8FAFC',
    100: '#F5F5F5', // Discord username/primary headers
    200: '#E2E8F0',
    300: '#CBCCD1', // Discord chat text
    400: '#818491', // Discord secondary info (date/tips)
    500: '#6B7280',
    600: '#404248', // Discord hover states
    700: '#2E2F35', // Discord borders
    800: '#24272D', // Discord input fields (more accurate)
    850: '#1C1D23', // Discord surface areas (chat background)
    900: '#131317', // Discord main background (darkest)
    950: '#131317', // Same as 900 for Discord theme
  },

  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  secondary: {
    50: '#FAF9FA',
    100: '#F3F1F3',
    200: '#E7E3E7',
    300: '#DBD5DB',
    400: '#C9C2C5',
    500: '#B7AFB2',
    600: '#9A9196',
    700: '#7D737A',
    800: '#60555E',
    900: '#433742',
  },

  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#23A55A', // Discord green
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#FEE75C', // Discord yellow
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#ED4245', // Discord red
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Keep other color scales unchanged
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
  },

  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },

  // Update text and background colors for Discord theme
  text: {
    primary: '#F5F5F5', // Discord username/primary headers (brightest - for nav/headers)
    secondary: '#CBCCD1', // Discord chat text (main content)
    muted: '#818491', // Discord date/tips/secondary info
  },

  background: {
    primary: '#131317', // Discord main background (actual mobile colors)
    secondary: '#1C1D23', // Discord surface areas (chat background)
    accent: '#383A43', // Discord elevated areas (button fill)
  },
};
