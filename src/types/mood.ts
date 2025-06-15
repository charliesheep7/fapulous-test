export type MoodType =
  | 'stressed'
  | 'guilty'
  | 'relieved'
  | 'zen'
  | 'anxious'
  | 'ashamed'
  | 'confused'
  | 'peaceful'
  | 'frustrated'
  | 'neutral';

export type MoodOption = {
  id: MoodType;
  label: string;
  emoji: string;
  description: string;
};

export type SelectedMoods = MoodType[];

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'stressed',
    label: 'Stressed',
    emoji: '😰',
    description: 'Feeling overwhelmed or under pressure',
  },
  {
    id: 'guilty',
    label: 'Guilty',
    emoji: '😔',
    description: 'Feeling remorse or responsibility for something',
  },
  {
    id: 'relieved',
    label: 'Relieved',
    emoji: '😌',
    description: 'Feeling free from anxiety or distress',
  },
  {
    id: 'zen',
    label: 'Zen',
    emoji: '🧘',
    description: 'Feeling calm and at peace',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    emoji: '😟',
    description: 'Feeling worried or uneasy',
  },
  {
    id: 'ashamed',
    label: 'Ashamed',
    emoji: '😳',
    description: 'Feeling embarrassed or guilty about something',
  },
  {
    id: 'confused',
    label: 'Confused',
    emoji: '😵',
    description: 'Feeling uncertain or unclear about something',
  },
  {
    id: 'peaceful',
    label: 'Peaceful',
    emoji: '😇',
    description: 'Feeling tranquil and serene',
  },
  {
    id: 'frustrated',
    label: 'Frustrated',
    emoji: '😤',
    description: 'Feeling annoyed or impatient',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    emoji: '😐',
    description: 'Feeling neither positive nor negative',
  },
];
