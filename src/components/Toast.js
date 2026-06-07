import React, { createContext, useCallback, useContext, useState } from "react";
import "../styles/Toast.css";

/*
 * Minimal toast system to replace alert(). Neon-noir styled.
 * Usage: const toast = useToast(); toast.ok("done"), toast.err("..."), toast.info("...")
 */

const ToastCtx = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (kind, msg, ttl = 4200) => {
      const id = ++_id;
      setToasts((t) => [...t, { id, kind, msg }]);
      if (ttl) setTimeout(() => dismiss(id), ttl);
      return id;
    },
    [dismiss]
  );

  const api = {
    ok: (m, ttl) => push("ok", m, ttl),
    err: (m, ttl) => push("err", m, ttl),
    info: (m, ttl) => push("info", m, ttl),
    dismiss,
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.kind}`} onClick={() => dismiss(t.id)}>
            <span className="toast-led" />
            <span className="toast-msg">{t.msg}</span>
            <span className="toast-x">✕</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
