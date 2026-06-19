import React from 'react';

export function Input({
  placeholder = '',
  value,
  onChange,
  type = 'text',
  prefix,
  suffix,
  style: extraStyle,
}) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {prefix && (
        <span
          style={{
            position: 'absolute',
            left: 14,
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: 'var(--input-height)',
          padding: `0 ${suffix ? '44px' : 'var(--space-5)'} 0 ${prefix ? '44px' : 'var(--space-5)'}`,
          borderRadius: 'var(--radius-pill)',
          border: 'var(--border-medium)',
          background: 'var(--color-white)',
          fontSize: 'var(--text-base)',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          boxSizing: 'border-box',
          ...extraStyle,
        }}
      />
      {suffix && (
        <span
          style={{
            position: 'absolute',
            right: 14,
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}
