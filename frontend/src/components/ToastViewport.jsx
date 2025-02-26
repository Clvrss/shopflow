import { useToast } from '../context/ToastContext';

export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`toast toast-${t.type}`}
          onClick={() => dismiss(t.id)}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
