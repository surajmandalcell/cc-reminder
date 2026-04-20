import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { TextField } from "@/components/ui/TextField";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, spacing } from "@/constants/Tokens";
import { providerTemplates } from "@/data/providerTemplates";
import type { CardDraft } from "@/types/domain";

const EXTENDED_TRACKING_WARNING =
	"Grace periods, extension windows, minimum-payment effects, late fees, and credit-reporting outcomes depend on your specific card agreement and may change without notice. CC Reminder cannot monitor your issuer's policies.";

const EXTENDED_TRACKING_RESPONSIBILITY =
	"By enabling extended payment tracking, you acknowledge that any extended date shown here is only a memory aid. It is not a guarantee, not legal advice, not financial advice, and may still be wrong for your card. You are responsible for verifying the actual terms directly with your issuer.";

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
				<Text style={[styles.helper, { color: palette.muted }]}>
					Keep this off unless you want to manage a manual follow-up window
					yourself.
				</Text>
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
						hint="Use a real calendar date in YYYY-MM-DD format. The app creates a 1-day-before reminder and an on-date reminder."
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
					<Text style={[styles.warning, { color: palette.text }]}>
						{EXTENDED_TRACKING_WARNING}
					</Text>
					<Text style={[styles.helper, { color: palette.muted }]}>
						{EXTENDED_TRACKING_RESPONSIBILITY}
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
		fontFamily: "SpaceMono",
		fontSize: 20,
		lineHeight: 28,
		textTransform: "uppercase",
	},
	sectionTitle: {
		fontFamily: "SpaceMono",
		fontSize: 16,
		lineHeight: 22,
		textTransform: "uppercase",
	},
	helper: {
		fontFamily: "SpaceMono",
		fontSize: 13,
		lineHeight: 21,
	},
	warning: {
		fontFamily: "SpaceMono",
		fontSize: 13,
		lineHeight: 21,
	},
	button: {
		borderWidth: 2,
		borderRadius: radius.sm,
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
	buttonLabel: {
		fontFamily: "SpaceMono",
		fontSize: 14,
		lineHeight: 20,
		textTransform: "uppercase",
	},
	error: {
		fontFamily: "SpaceMono",
		fontSize: 14,
		lineHeight: 22,
	},
});
