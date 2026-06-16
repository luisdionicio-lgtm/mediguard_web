import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function QuizBlock({ quiz, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = quiz.correct_option;
  const isRight = selected === correct;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    if (isRight) onComplete?.(100);
    else onComplete?.(0);
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
      <p style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16, fontSize: '0.97rem' }}>
        🧠 {quiz.question}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(quiz.options || []).map((opt) => {
          let bg = 'transparent';
          let border = '1px solid var(--border)';
          let color = 'var(--text-secondary)';
          if (submitted) {
            if (opt.key === correct) { bg = 'rgba(34,197,94,0.1)'; border = '1px solid var(--success)'; color = 'var(--success)'; }
            else if (opt.key === selected) { bg = 'rgba(220,38,38,0.1)'; border = '1px solid var(--error)'; color = 'var(--error)'; }
          } else if (selected === opt.key) {
            bg = 'rgba(99,102,241,0.1)'; border = '1px solid #6366f1'; color = '#6366f1';
          }
          return (
            <button
              key={opt.key}
              onClick={() => !submitted && setSelected(opt.key)}
              style={{ padding: '11px 14px', background: bg, border, borderRadius: 10, color, textAlign: 'left', cursor: submitted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s', fontSize: '0.88rem' }}
            >
              <span style={{ fontWeight: 700, minWidth: 22, height: 22, borderRadius: '50%', border: `1px solid currentColor`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                {opt.key}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          style={{ marginTop: 16, padding: '10px 24px', background: selected ? '#6366f1' : 'var(--surface-2)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: selected ? 'pointer' : 'not-allowed', fontSize: '0.88rem' }}
        >
          Verificar respuesta
        </button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 14, background: isRight ? 'rgba(34,197,94,0.08)' : 'rgba(220,38,38,0.08)', border: `1px solid ${isRight ? 'rgba(34,197,94,0.25)' : 'rgba(220,38,38,0.25)'}`, borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            {isRight ? <CheckCircle2 size={18} color="var(--success)" /> : <XCircle size={18} color="var(--error)" />}
            <span style={{ fontWeight: 700, color: isRight ? 'var(--success)' : 'var(--error)', fontSize: '0.9rem' }}>
              {isRight ? '¡Correcto!' : 'Incorrecto'}
            </span>
          </div>
          {quiz.explanation && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{quiz.explanation}</p>}
        </div>
      )}
    </div>
  );
}
