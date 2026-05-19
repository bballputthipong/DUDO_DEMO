import type { ActivityCategory, ActivitySlot, Booking, WalletSnapshot, WellnessActivity } from "@/src/types/domain";

const now = new Date();

function isoAt(dayOffset: number, hour: number, minute = 0): string {
  const date = new Date(now);
  date.setDate(now.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function dateLabel(dayOffset: number): string {
  const date = new Date(now);
  date.setDate(now.getDate() + dayOffset);
  return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short" }).format(date);
}

function slot(id: string, dayOffset: number, startHour: number, availableSpots: number): ActivitySlot {
  return {
    id,
    startsAt: isoAt(dayOffset, startHour),
    endsAt: isoAt(dayOffset, startHour + 1),
    dateLabel: dateLabel(dayOffset),
    timeLabel: `${String(startHour).padStart(2, "0")}:00-${String(startHour + 1).padStart(2, "0")}:00`,
    availableSpots,
    isAvailable: availableSpots > 0,
  };
}

export const categories: ActivityCategory[] = ["Yoga", "Pilates", "Fitness", "Spa", "Mindfulness"];

export const activities: WellnessActivity[] = [
  {
    id: "act-yoga-flow",
    partnerId: "partner-blue-room",
    partnerName: "Blue Room Studio",
    title: "Morning Yoga Flow",
    category: "Yoga",
    location: "Thonglor",
    distanceKm: 1.8,
    durationMinutes: 60,
    tokenPrice: 12,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    description: "ClassYogaMorningAtเน้นการหายMind การยืดตัว And flow เบา ๆ forเริ่มdayให้สดชื่น",
    benefits: ["ลดความตึงOfmusclesmeat", "AddMeditation", "suitableกับEveryระดับ"],
    slots: [slot("slot-yoga-1", 1, 9, 5), slot("slot-yoga-2", 1, 11, 0), slot("slot-yoga-3", 2, 18, 3)],
  },
  {
    id: "act-pilates-core",
    partnerId: "partner-core-house",
    partnerName: "Core House",
    title: "Pilates Core Reset",
    category: "Pilates",
    location: "Ari",
    distanceKm: 3.2,
    durationMinutes: 50,
    tokenPrice: 14,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80",
    description: "รีเซ็ต core And posture ด้วย reformer-inspired sequence Inกลุ่มเล็ก",
    benefits: ["StrengthenแกนMediumลำตัว", "ปรับ posture", "กลุ่มเล็ก Careทั่วTo"],
    slots: [slot("slot-pilates-1", 1, 13, 2), slot("slot-pilates-2", 2, 10, 4), slot("slot-pilates-3", 3, 17, 0)],
  },
  {
    id: "act-hiit-breath",
    partnerId: "partner-move-lab",
    partnerName: "Move Lab",
    title: "Low Impact HIIT",
    category: "Fitness",
    location: "Silom",
    distanceKm: 4.1,
    durationMinutes: 45,
    tokenPrice: 10,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
    description: "คาร์ดิโอเข้มข้นแบบ low impact suitableกับpplอยากขยับโดยNotหนักข้อเข่า",
    benefits: ["Add heart rate", "เผาผลาญGood", "NotHasท่ากระโดดหนัก"],
    slots: [slot("slot-hiit-1", 1, 19, 7), slot("slot-hiit-2", 2, 7, 6), slot("slot-hiit-3", 3, 19, 1)],
  },
  {
    id: "act-spa-recovery",
    partnerId: "partner-sabai",
    partnerName: "Sabai Recovery",
    title: "Recovery Massage",
    category: "Spa",
    location: "Sathorn",
    distanceKm: 2.7,
    durationMinutes: 75,
    tokenPrice: 18,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
    description: "Massage recovery forคลายmusclesmeatAfterออกกำลังOrทำงานนั่งนาน",
    benefits: ["ลดอาการล้า", "ช่วยการฟื้นตัว", "ห้องส่วนตัว"],
    slots: [slot("slot-spa-1", 1, 15, 1), slot("slot-spa-2", 2, 16, 2), slot("slot-spa-3", 4, 14, 2)],
  },
  {
    id: "act-mindful-lunch",
    partnerId: "partner-calm",
    partnerName: "Calm Collective",
    title: "Mindful Lunch Break",
    category: "Mindfulness",
    location: "Phrom Phong",
    distanceKm: 2.1,
    durationMinutes: 30,
    tokenPrice: 6,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
    description: "พักMediumdayสั้น ๆ ด้วย guided breathing And reset attention BeforeBackไปทำงาน",
    benefits: ["UseTimeน้อย", "ลดความเครียด", "suitableกับช่วงพักงาน"],
    slots: [slot("slot-mind-1", 1, 12, 8), slot("slot-mind-2", 2, 12, 8), slot("slot-mind-3", 3, 12, 4)],
  },
];

export const walletSnapshot: WalletSnapshot = {
  balance: {
    personal: 24,
    corporate: 36,
    bonus: 8,
    total: 68,
  },
  transactions: [
    { id: "tx-1", label: "Monthly company allocation", source: "corporate", amount: 36, createdAt: isoAt(-2, 9) },
    { id: "tx-2", label: "Morning Yoga Flow", source: "bonus", amount: -12, createdAt: isoAt(-1, 10) },
    { id: "tx-3", label: "Welcome bonus", source: "bonus", amount: 20, createdAt: isoAt(-7, 8) },
  ],
};

export const bookings: Booking[] = [
  {
    id: "booking-1",
    activityId: "act-yoga-flow",
    activityTitle: "Morning Yoga Flow",
    partnerName: "Blue Room Studio",
    imageUrl: activities.find((activity) => activity.id === "act-yoga-flow")?.imageUrl ?? "",
    status: "confirmed",
    startsAt: isoAt(1, 9),
    timeLabel: "09:00-10:00",
    tokenUsed: 12,
    checkInCode: "DUDO-4281",
  },
  {
    id: "booking-2",
    activityId: "act-mindful-lunch",
    activityTitle: "Mindful Lunch Break",
    partnerName: "Calm Collective",
    imageUrl: activities.find((activity) => activity.id === "act-mindful-lunch")?.imageUrl ?? "",
    status: "completed",
    startsAt: isoAt(-4, 12),
    timeLabel: "12:00-12:30",
    tokenUsed: 6,
    checkInCode: "DUDO-2715",
  },
];
