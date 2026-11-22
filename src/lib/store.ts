import fs from "fs";
import path from "path";
import { LangCode } from "./translations";

export interface FeedbackRecord {
  id: string;
  patientName?: string;
  phone?: string;
  ward: string;
  roomNumber?: string;
  language: LangCode;
  overallRating: number;
  doctorRating: number;
  nursingRating: number;
  hygieneRating: number;
  foodRating: number;
  tags: string[];
  comments?: string;
  status: "NORMAL" | "ALERT_OPEN" | "RESOLVED";
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "feedback.json");

const SEED_DATA: FeedbackRecord[] = [
  {
    id: "FB-1042",
    patientName: "Farhana Khan",
    phone: "9823011223",
    ward: "Maternity Suite",
    roomNumber: "Suite 302",
    language: "hi",
    overallRating: 5,
    doctorRating: 5,
    nursingRating: 5,
    hygieneRating: 5,
    foodRating: 4,
    tags: ["दयालु नर्सें", "ध्यान देने वाले डॉक्टर", "साफ़-सुथरा कमरा"],
    comments: "डिलीवरी के बाद नर्सिंग स्टाफ ने बहुत अच्छी देखभाल की।",
    status: "NORMAL",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "FB-1041",
    patientName: "Snehal Kulkarni",
    phone: "9765409812",
    ward: "Private Room",
    roomNumber: "Room 204",
    language: "mr",
    overallRating: 2,
    doctorRating: 4,
    nursingRating: 3,
    hygieneRating: 2,
    foodRating: 3,
    tags: ["लक्ष देणारे डॉक्टर"],
    comments: "संध्याकाळी वॉशरूम स्वच्छता लवकर व्हायला हवी.",
    status: "ALERT_OPEN",
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
  },
  {
    id: "FB-1040",
    patientName: "Zoya Siddiqui",
    phone: "9920144556",
    ward: "General Ward",
    roomNumber: "Bed G-08",
    language: "en",
    overallRating: 4,
    doctorRating: 5,
    nursingRating: 4,
    hygieneRating: 4,
    foodRating: 4,
    tags: ["Caring Nurses", "Quick Response", "Polite Support Staff"],
    comments: "Doctors explained every step clearly to our family.",
    status: "NORMAL",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

function ensureStore(): FeedbackRecord[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_DATA, null, 2), "utf-8");
    return SEED_DATA;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as FeedbackRecord[];
  } catch {
    return SEED_DATA;
  }
}

export function getAllFeedback(): FeedbackRecord[] {
  return ensureStore().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createFeedback(
  input: Omit<FeedbackRecord, "id" | "status" | "createdAt">
): FeedbackRecord {
  const current = ensureStore();
  const nextNum = 1043 + current.length;
  const record: FeedbackRecord = {
    ...input,
    id: `FB-${nextNum}`,
    status: input.overallRating <= 3 ? "ALERT_OPEN" : "NORMAL",
    createdAt: new Date().toISOString(),
  };
  current.unshift(record);
  fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), "utf-8");
  return record;
}

export function updateFeedbackStatus(
  id: string,
  status: "NORMAL" | "ALERT_OPEN" | "RESOLVED"
): FeedbackRecord | null {
  const current = ensureStore();
  const idx = current.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  current[idx] = { ...current[idx], status };
  fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), "utf-8");
  return current[idx];
}