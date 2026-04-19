import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { TextField } from '@/components/ui/TextField';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radius, shadow, spacing } from '@/constants/Tokens';
import { providerTemplates } from '@/data/providerTemplates';
import type { CardDraft } from '@/types/domain';

type Props = {
  title: string;
  subtitle: string;
  initialDraft: CardDraft;
  submitLabel: string;
  onSubmit: (draft: CardDraft) => Promise<string | null>;
  onDelete?: () => Promise<void>;
};

export function CardForm({ title, subtitle, initialDraft, submitLabel, onSubmit, onDelete }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const [draft, setDraft] = useState<CardDraft>(initialDraft);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const template = useMemo(
    () => providerTemplates.find((item) => item.id === draft.providerTemplateId),
    [draft.providerTemplateId],
  );

  function update(next: Partial<CardDraft>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  async function handleSubmit() {
    setIsSaving(true);
    const nextError = await onSubmit(draft);
    setError(nextError);
    setIsSaving(false);
  }

  return (
    <ScrollView style={{ backgroundColor: palette.background }} contentContainerStyle={styles.content}>
      <View
        style={[
          styles.hero,
          shadow.medium,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
            shadowColor: palette.glow,
          },
        ]}>
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: palette.muted }]}>{subtitle}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: palette.card, borderColor: palette.border }]}> 
        <TextField
          label="Card label"
          value={draft.name}
          onChangeText={(value) => update({ name: value })}
          placeholder="Example: Everyday Gold"
        />
        <TextField
          label="Provider"
          value={draft.provider}
          onChangeText={(value) => update({ provider: value })}
          placeholder="American Express"
        />
        <TextField
          label="Last 4 digits"
          value={draft.last4}
          onChangeText={(value) => update({ last4: value.replace(/[^0-9]/g, '').slice(0, 4) })}
          placeholder="0123"
          keyboardType="number-pad"
        />
        <TextField
          label="Billing day"
          value={draft.billingDay}
          onChangeText={(value) => update({ billingDay: value.replace(/[^0-9]/g, '').slice(0, 2) })}
          placeholder="12"
          hint="Optional. Use the day of month when the statement cycle becomes worth acknowledging."
          keyboardType="number-pad"
        />
        <TextField
          label="Due day"
          value={draft.dueDay}
          onChangeText={(value) => update({ dueDay: value.replace(/[^0-9]/g, '').slice(0, 2) })}
          placeholder="24"
          hint="Required. Day of month used to derive due soon, due today, and overdue stages."
          keyboardType="number-pad"
        />
        <TextField
          label="Tags"
          value={draft.tags}
          onChangeText={(value) => update({ tags: value })}
          placeholder="travel, high-balance, flexible"
          hint="Comma-separated. Tags belong to cards, not reminders."
        />
      </View>

      <View style={[styles.section, { backgroundColor: palette.card, borderColor: palette.border }]}> 
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Provider templates</Text>
        <Text style={[styles.sectionBody, { color: palette.muted }]}>Templates are reference-only. They can prefill intent, but your issuer's actual terms always win.</Text>
        <View style={styles.chipWrap}>
          {providerTemplates.map((item) => (
            <PressableScale
              key={item.id}
              onPress={() =>
                update({
                  provider: item.provider,
                  providerTemplateId: draft.providerTemplateId === item.id ? undefined : item.id,
                  paidAmountNote: item.hint,
                })
              }
              contentStyle={[
                styles.templateChip,
                {
                  backgroundColor: draft.providerTemplateId === item.id ? palette.text : palette.cardAlt,
                  borderColor: draft.providerTemplateId === item.id ? palette.text : palette.border,
                },
              ]}>
              <Text style={[styles.templateLabel, { color: draft.providerTemplateId === item.id ? palette.background : palette.text }]}>{item.provider}</Text>
            </PressableScale>
          ))}
        </View>

        {template ? (
          <View style={[styles.templateDetail, { backgroundColor: palette.cardAlt, borderColor: palette.border }]}> 
            <Text style={[styles.templateTitle, { color: palette.text }]}>{template.title}</Text>
            <Text style={[styles.templateBody, { color: palette.muted }]}>{template.hint}</Text>
            <Text style={[styles.templateWarning, { color: palette.warning }]}>{template.disclaimer}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.section, { backgroundColor: palette.card, borderColor: palette.border }]}> 
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Preferences</Text>
        <View style={styles.toggleRow}>
          <PressableScale
            onPress={() => update({ notificationsEnabled: !draft.notificationsEnabled })}
            contentStyle={[
              styles.toggle,
              {
                backgroundColor: draft.notificationsEnabled ? palette.text : palette.cardAlt,
                borderColor: draft.notificationsEnabled ? palette.text : palette.border,
              },
            ]}>
            <Text style={[styles.toggleLabel, { color: draft.notificationsEnabled ? palette.background : palette.text }]}>
              {draft.notificationsEnabled ? 'Notifications on' : 'Notifications off'}
            </Text>
          </PressableScale>
          <PressableScale
            onPress={() => update({ extendedTrackingEnabled: !draft.extendedTrackingEnabled })}
            contentStyle={[
              styles.toggle,
              {
                backgroundColor: draft.extendedTrackingEnabled ? palette.text : palette.cardAlt,
                borderColor: draft.extendedTrackingEnabled ? palette.text : palette.border,
              },
            ]}>
            <Text style={[styles.toggleLabel, { color: draft.extendedTrackingEnabled ? palette.background : palette.text }]}>
              {draft.extendedTrackingEnabled ? 'Extended tracking on' : 'Extended tracking off'}
            </Text>
          </PressableScale>
        </View>

        {draft.extendedTrackingEnabled ? (
          <View style={styles.extendedWrap}>
            <TextField
              label="Manual extended date"
              value={draft.extendedDate}
              onChangeText={(value) => update({ extendedDate: value })}
              placeholder="2026-05-28"
              hint="Use ISO format. This is always user-managed, never guaranteed."
            />
            <TextField
              label="Paid amount or support note"
              value={draft.paidAmountNote}
              onChangeText={(value) => update({ paidAmountNote: value })}
              placeholder="Minimum paid on Apr 15, support said check back after posting."
              multiline
              minHeight={100}
            />
            <PressableScale
              onPress={() => update({ acknowledgmentAccepted: !draft.acknowledgmentAccepted })}
              contentStyle={[
                styles.acknowledgment,
                {
                  backgroundColor: draft.acknowledgmentAccepted ? palette.text : palette.cardAlt,
                  borderColor: draft.acknowledgmentAccepted ? palette.text : palette.border,
                },
              ]}>
              <Text style={[styles.acknowledgmentText, { color: draft.acknowledgmentAccepted ? palette.background : palette.text }]}>
                I understand extended dates are only memory aids and may not match issuer policy.
              </Text>
            </PressableScale>
          </View>
        ) : null}
      </View>

      {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}

      <PressableScale
        onPress={() => void handleSubmit()}
        disabled={isSaving}
        contentStyle={[styles.submit, { backgroundColor: palette.text, opacity: isSaving ? 0.75 : 1 }]}> 
        <Text style={[styles.submitText, { color: palette.background }]}>{isSaving ? 'Saving...' : submitLabel}</Text>
      </PressableScale>

      {onDelete ? (
        <PressableScale
          onPress={() => void onDelete()}
          contentStyle={[styles.delete, { backgroundColor: palette.cardAlt, borderColor: palette.border }]}> 
          <Text style={[styles.deleteLabel, { color: palette.danger }]}>Delete card</Text>
        </PressableScale>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  hero: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  templateChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  templateLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  templateDetail: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 6,
  },
  templateTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  templateBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  templateWarning: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  toggleRow: {
    gap: spacing.sm,
  },
  toggle: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  extendedWrap: {
    gap: spacing.md,
  },
  acknowledgment: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  acknowledgmentText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  error: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  submit: {
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 15,
    fontWeight: '800',
  },
  delete: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
});