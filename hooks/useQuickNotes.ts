import { useEffect, useState } from "react";

import type { QuickNote } from "@/types/app";
import { loadJson, saveJson, storageKeys } from "@/utils/storage";

export function useQuickNotes() {
	const [notes, setNotes] = useState<QuickNote[]>([]);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function hydrate() {
			const storedNotes = await loadJson<QuickNote[]>(
				storageKeys.quickNotes,
				[],
			);

			if (!isMounted) {
				return;
			}

			setNotes(storedNotes);
			setIsReady(true);
		}

		hydrate();

		return () => {
			isMounted = false;
		};
	}, []);

	async function addNote(body: string) {
		const trimmed = body.trim();

		if (!trimmed) {
			return false;
		}

		const nextNotes = [
			{
				id: `${Date.now()}`,
				body: trimmed,
				createdAt: new Date().toISOString(),
			},
			...notes,
		];

		setNotes(nextNotes);
		await saveJson(storageKeys.quickNotes, nextNotes);
		return true;
	}

	async function deleteNote(id: string) {
		const nextNotes = notes.filter((note) => note.id !== id);
		setNotes(nextNotes);
		await saveJson(storageKeys.quickNotes, nextNotes);
	}

	return {
		notes,
		isReady,
		addNote,
		deleteNote,
	};
}
