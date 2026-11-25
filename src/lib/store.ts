import fs from "fs";
import path from "path";
import { LangCode } from "./translations";

export interface FeedbackRecord {
  id: string;
  dispatchId?: string;
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

export interface PatientDispatchRecord {
  id: string;
  patientName: string;
  guardianPhone: string;
  ward: string;
  roomNumber?: string;
  language: LangCode;
  status: "PENDING" | "SENT" | "SUBMITTED";
  sentVia?: "WHATSAPP" | "SMS";
  sentAt?: string;
  submittedRating?: number;
  createdAt: string;
}

interface StoreShape {
  feedback: FeedbackRecord[];
  dispatches: PatientDispatchRecord[];
}

const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, "feedback.json");
const TMP_DATA_DIR = path.join("/tmp", "fauzia-feedback-data");
const TMP_DATA_FILE = path.join(TMP_DATA_DIR, "feedback.json");

const SEED_FEEDBACK: FeedbackRecord[] = [
  {
    id: "FB-1042",
    dispatchId: "REG-201",
    patientName: "Farhana Khan",
    phone: "9823011223",
    ward: "Maternity Ward",
    roomNumber: "Room 201",
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
    dispatchId: "REG-202",
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
];

const SEED_DISPATCHES: PatientDispatchRecord[] = [
  {
    id: "REG-203",
    patientName: "Ayesha Shaikh",
    guardianPhone: "9820455110",
    ward: "Maternity Ward",
    roomNumber: "Bed 12",
    language: "en",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "REG-201",
    patientName: "Farhana Khan",
    guardianPhone: "9823011223",
    ward: "Maternity Ward",
    roomNumber: "Room 201",
    language: "hi",
    status: "SUBMITTED",
    sentVia: "WHATSAPP",
    sentAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    submittedRating: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "REG-202",
    patientName: "Snehal Kulkarni",
    guardianPhone: "9765409812",
    ward: "Private Room",
    roomNumber: "Room 204",
    language: "mr",
    status: "SUBMITTED",
    sentVia: "SMS",
    sentAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    submittedRating: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
  },
];

let memoryStore: StoreShape | null = null;

function cloneSeed(): StoreShape {
  return {
    feedback: SEED_FEEDBACK.map((item) => ({ ...item, tags: [...item.tags] })),
    dispatches: SEED_DISPATCHES.map((item) => ({ ...item })),
  };
}

function readJsonFile(filePath: string): StoreShape | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return {
        feedback: parsed as FeedbackRecord[],
        dispatches: SEED_DISPATCHES.map((item) => ({ ...item })),
      };
    }
    if (parsed && Array.isArray(parsed.feedback)) {
      return {
        feedback: parsed.feedback as FeedbackRecord[],
        dispatches: Array.isArray(parsed.dispatches)
          ? (parsed.dispatches as PatientDispatchRecord[])
          : [],
      };
    }
    return null;
  } catch {
    return null;
  }
}

function writeJsonFile(
  dirPath: string,
  filePath: string,
  data: StoreShape
): boolean {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

function ensureStore(): StoreShape {
  if (memoryStore) return memoryStore;

  const fromLocal = readJsonFile(LOCAL_DATA_FILE);
  if (fromLocal) {
    memoryStore = fromLocal;
    return memoryStore;
  }

  const fromTmp = readJsonFile(TMP_DATA_FILE);
  if (fromTmp) {
    memoryStore = fromTmp;
    return memoryStore;
  }

  const seeded = cloneSeed();
  memoryStore = seeded;
  if (!writeJsonFile(LOCAL_DATA_DIR, LOCAL_DATA_FILE, seeded)) {
    writeJsonFile(TMP_DATA_DIR, TMP_DATA_FILE, seeded);
  }
  return memoryStore;
}

function persistStore(data: StoreShape): void {
  memoryStore = data;
  if (!writeJsonFile(LOCAL_DATA_DIR, LOCAL_DATA_FILE, data)) {
    writeJsonFile(TMP_DATA_DIR, TMP_DATA_FILE, data);
  }
}

export function getAllFeedback(): FeedbackRecord[] {
  return [...ensureStore().feedback].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createFeedback(
  input: Omit<FeedbackRecord, "id" | "status" | "createdAt">
): FeedbackRecord {
  const current = ensureStore();
  const nextNum = 1043 + current.feedback.length;
  const record: FeedbackRecord = {
    ...input,
    id: `FB-${nextNum}`,
    status: input.overallRating <= 3 ? "ALERT_OPEN" : "NORMAL",
    createdAt: new Date().toISOString(),
  };

  const cleanPhone = (input.phone || "").replace(/\D/g, "").slice(-10);
  const updatedDispatches = current.dispatches.map((d) => {
    const matchesId = input.dispatchId && d.id === input.dispatchId;
    const matchesPhone =
      cleanPhone.length === 10 &&
      d.guardianPhone.replace(/\D/g, "").slice(-10) === cleanPhone &&
      d.status !== "SUBMITTED";
    if (matchesId || matchesPhone) {
      return {
        ...d,
        status: "SUBMITTED" as const,
        submittedRating: input.overallRating,
      };
    }
    return d;
  });

  persistStore({
    feedback: [record, ...current.feedback],
    dispatches: updatedDispatches,
  });
  return record;
}

export function updateFeedbackStatus(
  id: string,
  status: "NORMAL" | "ALERT_OPEN" | "RESOLVED"
): FeedbackRecord | null {
  const current = ensureStore();
  const idx = current.feedback.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  const updated = [...current.feedback];
  updated[idx] = { ...updated[idx], status };
  persistStore({ ...current, feedback: updated });
  return updated[idx];
}

export function getAllDispatches(): PatientDispatchRecord[] {
  return [...ensureStore().dispatches].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createDispatches(
  entries: Array<{
    patientName: string;
    guardianPhone: string;
    ward: string;
    roomNumber?: string;
    language: LangCode;
  }>
): PatientDispatchRecord[] {
  const current = ensureStore();
  let counter = 204 + current.dispatches.length;
  const created: PatientDispatchRecord[] = entries.map((entry) => {
    const item: PatientDispatchRecord = {
      id: `REG-${counter++}`,
      patientName: entry.patientName.trim(),
      guardianPhone: entry.guardianPhone.trim(),
      ward: entry.ward,
      roomNumber: entry.roomNumber?.trim() || "",
      language: entry.language,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    return item;
  });

  persistStore({
    ...current,
    dispatches: [...created, ...current.dispatches],
  });
  return created;
}

export function markDispatchSent(
  id: string,
  channel: "WHATSAPP" | "SMS"
): PatientDispatchRecord | null {
  const current = ensureStore();
  const idx = current.dispatches.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  const updated = [...current.dispatches];
  updated[idx] = {
    ...updated[idx],
    status: updated[idx].status === "SUBMITTED" ? "SUBMITTED" : "SENT",
    sentVia: channel,
    sentAt: new Date().toISOString(),
  };
  persistStore({ ...current, dispatches: updated });
  return updated[idx];
}