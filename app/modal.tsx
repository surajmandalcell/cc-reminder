import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const sections = [
  {
    title: 'Trust Boundary',
    body: 'CC Reminder is local-first. It stores card labels, last 4 digits, tags, dates, reminder state, notes, and optional extended tracking data on-device only in v1.',
  },
  {
    title: 'What It Never Stores',
    body: 'No full card number, CVV, expiry date, payment credential, or bank connection lives in this app.',
  },
  {
    title: 'Provider Templates',
    body: 'Issuer templates are memory aids only. They are not legal advice, not official verification, and not a guarantee that a late payment will be treated a certain way.',
  },
  {
    title: 'Reminder Model',
    body: 'Billing, due soon, due today, overdue, and extended-window reminders are stage-derived. The product intentionally avoids arbitrary custom reminder builders in v1.',
  },
];

export default function ModalScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <>
      <ScrollView style={{ backgroundColor: palette.background }} contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: palette.card, borderColor: palette.border }]}> 
          <Text style={[styles.kicker, { color: palette.accent }]}>About CC Reminder</Text>
          <Text style={[styles.title, { color: palette.text }]}>Open source trust, local-first data, and stage-based reminders.</Text>
          <Text style={[styles.subtitle, { color: palette.muted }]}>This app is designed to remember payment timelines without pretending to be a bank integration or financial authority.</Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={[styles.section, { backgroundColor: palette.card, borderColor: palette.border }]}> 
            <Text style={[styles.sectionTitle, { color: palette.text }]}>{section.title}</Text>
            <Text style={[styles.sectionBody, { color: palette.muted }]}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    gap: 10,
  },
  kicker: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 21,
  },
});
