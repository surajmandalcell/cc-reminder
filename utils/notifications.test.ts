import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { makeCard } from "@/test/factories";
import { requestNotificationPermission, syncReminderNotifications } from "@/utils/notifications";

const mockDeriveReminders = jest.fn();

jest.mock("@/utils/reminders", () => ({
	deriveReminders: (...args: unknown[]) => mockDeriveReminders(...args),
}));

describe("notifications utils", () => {
	function setPlatform(os: "ios" | "web") {
		Object.defineProperty(Platform, "OS", {
			configurable: true,
			value: os,
		});
	}

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("requests notification permission on native when not already granted", async () => {
		setPlatform("ios");
		jest.spyOn(Notifications, "getPermissionsAsync").mockResolvedValue({ status: "denied" } as any);

		await requestNotificationPermission();

		expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
	});

	it("schedules future and repeating overdue reminders when permissions are granted", async () => {
		setPlatform("ios");
		jest.spyOn(Notifications, "getPermissionsAsync").mockResolvedValue({ status: "granted" } as any);
		mockDeriveReminders.mockReturnValue([
			{
				stage: "due-soon-3",
				title: "Future reminder",
				subtitle: "Soon",
				scheduledFor: "2099-04-22T00:00:00.000Z",
				isSettled: false,
			},
			{
				stage: "overdue",
				title: "Overdue reminder",
				subtitle: "Daily",
				scheduledFor: "2026-04-20T00:00:00.000Z",
				isSettled: false,
			},
		]);

		await syncReminderNotifications([makeCard()]);

		expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
		expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(2);
		expect(Notifications.scheduleNotificationAsync).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				trigger: expect.objectContaining({ type: "date" }),
			}),
		);
		expect(Notifications.scheduleNotificationAsync).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				trigger: expect.objectContaining({ type: "timeInterval", repeats: true }),
			}),
		);
	});
});