import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { TextField } from "@/components/ui/TextField";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, spacing } from "@/constants/Tokens";
import { providerTemplates } from "@/data/providerTemplates";
import type { CardDraft } from "@/types/domain";

type Props = {
	title: string;
	subtitle: string;
	initialDraft: CardDraft;
	submitLabel: string;
	onSubmit: (draft: CardDraft) => Promise<string | null>;
	onDelete?: () => Promise<void>;
};

export function CardForm({
	title,
	subtitle,
	initialDraft,
	submitLabel,
	onSubmit,
	onDelete,
}: Props) {
	const colorScheme = useColorScheme() ?? "light";
	const palette = Colors[colorScheme];
	const [draft, setDraft] = useState<CardDraft>(initialDraft);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const template = useMemo(
		() =>
			providerTemplates.find((item) => item.id === draft.providerTemplateId),
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
		<ScrollView
			style={{ backgroundColor: palette.background }}
			contentContainerStyle={styles.content}
		>
			<View
				style={[
					styles.section,
					{ backgroundColor: palette.card, borderColor: palette.border },
				]}
			>
				<Text style={[styles.title, { color: palette.text }]}>{title}</Text>
				<Text style={[styles.helper, { color: palette.muted }]}>
					{subtitle}
				</Text>
			</View>

			<View
				style={[
					styles.section,
					{ backgroundColor: palette.card, borderColor: palette.border },
				]}
			>
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
					onChangeText={(value) =>
						update({ last4: value.replace(/[^0-9]/g, "").slice(0, 4) })
					}
					placeholder="0123"
					keyboardType="number-pad"
				/>
				<TextField
					label="Billing day"
					value={draft.billingDay}
					onChangeText={(value) =>
						update({ billingDay: value.replace(/[^0-9]/g, "").slice(0, 2) })
					}
					placeholder="1-31"
					hint="Optional. Supports 1-31. Short months clamp to the nearest valid date."
					keyboardType="number-pad"
				/>
				<TextField
					label="Due day"
					value={draft.dueDay}
					onChangeText={(value) =>
						update({ dueDay: value.replace(/[^0-9]/g, "").slice(0, 2) })
					}
					placeholder="1-31"
					hint="Required. Supports 1-31 with nearest-valid-date handling."
					keyboardType="number-pad"
				/>
				<TextField
					label="Tags"
					value={draft.tags}
					onChangeText={(value) => update({ tags: value })}
					placeholder="travel, backup, monthly"
					hint="Comma-separated card tags used for filtering."
				/>
			</View>

			<View
				style={[
					styles.section,
					{ backgroundColor: palette.card, borderColor: palette.border },
				]}
			>
				<Text style={[styles.sectionTitle, { color: palette.text }]}>
					Preferences
				</Text>
				<PressableScale
					onPress={() =>
						update({ notificationsEnabled: !draft.notificationsEnabled })
					}
					contentStyle={[
						styles.button,
						{ backgroundColor: palette.cardAlt, borderColor: palette.border },
					]}
				>
					<Text style={[styles.buttonLabel, { color: palette.text }]}>
						Notifications: {draft.notificationsEnabled ? "on" : "off"}
					</Text>
				</PressableScale>
				<Text style={[styles.helper, { color: palette.muted }]}>
					If device permission is denied, reminders still appear in-app.
				</Text>
				<PressableScale
					onPress={() =>
						update({ extendedTrackingEnabled: !draft.extendedTrackingEnabled })
					}
					contentStyle={[
						styles.button,
						{ backgroundColor: palette.cardAlt, borderColor: palette.border },
					]}
				>
					<Text style={[styles.buttonLabel, { color: palette.text }]}>
						Extended tracking: {draft.extendedTrackingEnabled ? "on" : "off"}
					</Text>
				</PressableScale>
			</View>

			<View
				style={[
					styles.section,
					{ backgroundColor: palette.card, borderColor: palette.border },
				]}
			>
				<Text style={[styles.sectionTitle, { color: palette.text }]}>
					Provider template
				</Text>
				<Text style={[styles.helper, { color: palette.muted }]}>
					Only Amex is included in v1. It is advisory only.
				</Text>
				{providerTemplates.map((item) => (
					<PressableScale
						key={item.id}
						onPress={() =>
							update({
								provider: item.provider,
								providerTemplateId:
									draft.providerTemplateId === item.id ? undefined : item.id,
								paidAmountNote: item.hint,
							})
						}
						contentStyle={[
							styles.button,
							{ backgroundColor: palette.cardAlt, borderColor: palette.border },
						]}
					>
						<Text style={[styles.buttonLabel, { color: palette.text }]}>
							{draft.providerTemplateId === item.id ? "Using" : "Use"}{" "}
							{item.provider} template
						</Text>
					</PressableScale>
				))}
				{template ? (
					<View
						style={[
							styles.subSection,
							{ backgroundColor: palette.cardAlt, borderColor: palette.border },
						]}
					>
						<Text style={[styles.helper, { color: palette.text }]}>
							{template.title}
						</Text>
						<Text style={[styles.helper, { color: palette.muted }]}>
							{template.hint}
						</Text>
						<Text style={[styles.helper, { color: palette.warning }]}>
							{template.disclaimer}
						</Text>
					</View>
				) : null}
			</View>

			{draft.extendedTrackingEnabled ? (
				<View
					style={[
						styles.section,
						{ backgroundColor: palette.card, borderColor: palette.border },
					]}
				>
					<Text style={[styles.sectionTitle, { color: palette.text }]}>
						Extended tracking
					</Text>
					<TextField
						label="Manual extended date"
						value={draft.extendedDate}
						onChangeText={(value) => update({ extendedDate: value })}
						placeholder="2026-05-28"
						hint="A 1-day-before reminder and an on-date reminder will be created."
					/>
					<TextField
						label="Paid amount or support note"
						value={draft.paidAmountNote}
						onChangeText={(value) => update({ paidAmountNote: value })}
						placeholder="Manual note about minimum payment or support guidance"
						multiline
						minHeight={96}
					/>
					<PressableScale
						onPress={() =>
							update({ acknowledgmentAccepted: !draft.acknowledgmentAccepted })
						}
						contentStyle={[
							styles.button,
							{ backgroundColor: palette.cardAlt, borderColor: palette.border },
						]}
					>
						<Text style={[styles.buttonLabel, { color: palette.text }]}>
							Extended tracking acknowledgment:{" "}
							{draft.acknowledgmentAccepted ? "accepted" : "not accepted"}
						</Text>
					</PressableScale>
					<Text style={[styles.helper, { color: palette.muted }]}>
						Extended dates are manual memory aids only. They are not guarantees
						and do not verify issuer policy.
					</Text>
				</View>
			) : null}

			{error ? (
				<Text style={[styles.error, { color: palette.danger }]}>{error}</Text>
			) : null}

			<PressableScale
				onPress={() => void handleSubmit()}
				disabled={isSaving}
				contentStyle={[
					styles.button,
					{ backgroundColor: palette.cardAlt, borderColor: palette.border },
				]}
			>
				<Text style={[styles.buttonLabel, { color: palette.text }]}>
					{isSaving ? "Saving..." : submitLabel}
				</Text>
			</PressableScale>

			{onDelete ? (
				<PressableScale
					onPress={() => void onDelete()}
					contentStyle={[
						styles.button,
						{ backgroundColor: palette.cardAlt, borderColor: palette.border },
					]}
				>
					<Text style={[styles.buttonLabel, { color: palette.danger }]}>
						Delete card
					</Text>
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
	section: {
		borderWidth: 1,
		borderRadius: radius.sm,
		padding: spacing.md,
		gap: 8,
	},
	subSection: {
		borderWidth: 1,
		borderRadius: radius.sm,
		padding: spacing.md,
		gap: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
	},
	helper: {
		fontSize: 13,
		lineHeight: 19,
	},
	button: {
		borderWidth: 1,
		borderRadius: radius.sm,
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
	buttonLabel: {
		fontSize: 14,
		fontWeight: "600",
	},
	error: {
		fontSize: 14,
		lineHeight: 20,
		fontWeight: "600",
	},
});
