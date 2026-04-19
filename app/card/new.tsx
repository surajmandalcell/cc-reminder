import { router } from 'expo-router';

import { CardForm } from '@/components/card/CardForm';
import { useCards } from '@/hooks/useCards';

export default function NewCardScreen() {
  const { createCard, defaultDraft } = useCards();

  return (
    <CardForm
      title="Create a card"
      subtitle="Capture only the data that matters for reminders: provider, last 4 digits, tags, dates, alerts, and optional extended tracking."
      initialDraft={defaultDraft()}
      submitLabel="Save card"
      onSubmit={async (draft) => {
        const error = await createCard(draft);
        if (!error) {
          router.back();
        }
        return error;
      }}
    />
  );
}