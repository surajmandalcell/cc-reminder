import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Card } from '@/types/domain';
import { deriveReminders } from '@/utils/reminders';

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') {
    return;
  }

  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

export async function syncReminderNotifications(cards: Card[]) {
  if (Platform.OS === 'web') {
    return;
  }

  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== 'granted') {
    return;
  }

  const upcoming = deriveReminders(cards).filter((reminder) => {
    const scheduleTime = new Date(reminder.scheduledFor).getTime();
    return scheduleTime > Date.now();
  });

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Promise.all(
    upcoming.slice(0, 24).map((reminder) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.subtitle,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(reminder.scheduledFor),
        },
      })
    )
  );
}