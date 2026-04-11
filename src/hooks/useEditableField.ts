import { useState, useCallback, useRef, useEffect } from "react";

export interface EditableFieldState {
  value: string;
  isEditing: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  confirmEdit: () => void;
  onChange: (v: string) => void;
}

type EditLog = { field: string; entityId: string; oldValue: string; newValue: string; timestamp: string; };

const STORAGE_KEY = "cfs-edits";
const LOG_KEY = "cfs-edit-log";

function getEdits(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}

function setEdit(key: string, value: string) {
  const edits = getEdits();
  edits[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}

function logEdit(entry: EditLog) {
  try {
    const logs: EditLog[] = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    logs.push(entry);
    if (logs.length > 500) logs.splice(0, logs.length - 500);
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  } catch {}
}

export function getEditLog(): EditLog[] {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch { return []; }
}

export function useEditableField(entityId: string, field: string, defaultValue: string): EditableFieldState {
  const storageKey = `${entityId}::${field}`;
  const stored = getEdits()[storageKey];
  const [value, setValue] = useState(stored ?? defaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    const s = getEdits()[storageKey];
    if (s !== undefined && s !== value) setValue(s);
  }, [storageKey]);

  const startEdit = useCallback(() => { prevRef.current = value; setIsEditing(true); }, [value]);
  const cancelEdit = useCallback(() => { setValue(prevRef.current); setIsEditing(false); }, []);
  const confirmEdit = useCallback(() => {
    setEdit(storageKey, value);
    logEdit({ field, entityId, oldValue: prevRef.current, newValue: value, timestamp: new Date().toISOString() });
    setIsEditing(false);
  }, [storageKey, value, field, entityId]);
  const onChange = useCallback((v: string) => setValue(v), []);

  return { value, isEditing, startEdit, cancelEdit, confirmEdit, onChange };
}

export function useEditableSelect(entityId: string, field: string, defaultValue: string, options: string[]) {
  const state = useEditableField(entityId, field, defaultValue);
  return { ...state, options };
}
