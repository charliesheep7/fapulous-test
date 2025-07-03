/* eslint-disable react/react-in-jsx-scope */
import { Env } from '@env';
import { useColorScheme } from 'nativewind';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import {
  FocusAwareStatusBar,
  GradientBackground,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { Discord, LogOut } from '@/components/ui/icons';
import { translate, useAuth } from '@/lib';

export default function User() {
  const signOut = useAuth.use.signOut();
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
  return (
    <GradientBackground>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-16 ">
          <Text className="text-xl font-bold">
            {translate('settings.title')}
          </Text>
          <ItemsContainer title="settings.generale" titleMuted={true}>
            <Item
              text="settings.discord"
              icon={<Discord color={iconColor} />}
              onPress={() => {}}
            />
            <Item text="settings.version" value={Env.VERSION} />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item
                text="settings.logout"
                onPress={signOut}
                icon={<LogOut color="#ED4245" />}
                variant="destructive"
              />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
