/* @ds-bundle: {"format":3,"namespace":"DesignSystem_7d1533","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"StatCard","sourcePath":"components/core/StatCard.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"AppSidebar","sourcePath":"components/navigation/AppSidebar.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"2b7e71ee0b51","components/core/Button.jsx":"9214aade3041","components/core/Card.jsx":"17ef2edcc2ab","components/core/Input.jsx":"fb8577f1e195","components/core/StatCard.jsx":"7921e876ca77","components/core/Tag.jsx":"7202e78913ed","components/navigation/AppSidebar.jsx":"d3c2bbc4bae1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_7d1533 = window.DesignSystem_7d1533 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  children,
  variant = 'accent',
  dot = false
}) {
  const variantMap = {
    accent: {
      background: 'var(--color-accent-subtle)',
      color: 'var(--color-accent)'
    },
    dark: {
      background: 'var(--color-dark)',
      color: 'var(--color-text-on-dark)'
    },
    neutral: {
      background: 'var(--color-surface-card)',
      color: 'var(--color-text-secondary)'
    },
    success: {
      background: 'var(--color-success-subtle)',
      color: 'var(--color-success)'
    },
    warning: {
      background: 'var(--color-warning-subtle)',
      color: 'var(--color-warning)'
    },
    error: {
      background: 'var(--color-error-subtle)',
      color: 'var(--color-error)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-wide)',
      fontFamily: 'var(--font-body)',
      ...variantMap[variant]
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor',
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  disabled = false,
  onClick,
  style: extraStyle
}) {
  const rounding = pill ? 'var(--radius-pill)' : size === 'lg' ? 'var(--radius-lg)' : 'var(--radius-md)';
  const sizeMap = {
    sm: {
      height: 'var(--btn-height-sm)',
      padding: '0 var(--space-3)',
      fontSize: 'var(--text-sm)'
    },
    md: {
      height: 'var(--btn-height-md)',
      padding: '0 var(--space-5)',
      fontSize: 'var(--text-base)'
    },
    lg: {
      height: 'var(--btn-height-lg)',
      padding: '0 var(--space-6)',
      fontSize: 'var(--text-md)'
    }
  };
  const variantMap = {
    primary: {
      background: 'var(--color-accent)',
      color: 'var(--color-text-on-accent)'
    },
    dark: {
      background: 'var(--color-dark)',
      color: 'var(--color-text-on-dark)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-primary)',
      outline: 'var(--border-medium)'
    },
    accent: {
      background: 'var(--color-accent-subtle)',
      color: 'var(--color-accent)'
    },
    surface: {
      background: 'var(--color-surface-card)',
      color: 'var(--color-text-primary)'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-wide)',
      transition: `background var(--dur-fast) var(--ease-std), opacity var(--dur-fast)`,
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      whiteSpace: 'nowrap',
      lineHeight: 'normal',
      borderRadius: rounding,
      ...sizeMap[size],
      ...variantMap[variant],
      ...extraStyle
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  variant = 'light',
  padding = true,
  radius = 'lg',
  onClick,
  style: extraStyle
}) {
  const variantMap = {
    light: {
      background: 'var(--color-surface-card)',
      color: 'var(--color-text-primary)'
    },
    dark: {
      background: 'var(--color-dark)',
      color: 'var(--color-text-on-dark)'
    },
    accent: {
      background: 'var(--color-accent)',
      color: 'var(--color-text-on-accent)'
    },
    white: {
      background: 'var(--color-white)',
      color: 'var(--color-text-primary)'
    },
    surface: {
      background: 'var(--color-surface-bg)',
      color: 'var(--color-text-primary)'
    }
  };
  const radiusMap = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)'
  };
  const paddingValue = padding === true ? 'var(--space-5)' : padding === false ? '0' : padding;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      borderRadius: radiusMap[radius] || radius,
      padding: paddingValue,
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      ...variantMap[variant],
      ...extraStyle
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  placeholder = '',
  value,
  onChange,
  type = 'text',
  prefix,
  suffix,
  style: extraStyle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      color: 'var(--color-text-muted)',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
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
      ...extraStyle
    }
  }), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 14,
      color: 'var(--color-text-muted)',
      display: 'flex',
      alignItems: 'center'
    }
  }, suffix));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/StatCard.jsx
try { (() => {
function StatCard({
  label,
  value,
  delta,
  deltaLabel = '相比昨日',
  variant = 'light',
  pill = false,
  accentBar = false,
  style: extraStyle
}) {
  const v = {
    light: {
      bg: 'var(--color-surface-card)',
      labelColor: 'var(--color-text-secondary)',
      valueColor: 'var(--color-text-primary)',
      deltaColor: 'var(--color-accent)',
      metaColor: 'var(--color-text-muted)'
    },
    dark: {
      bg: 'var(--color-dark)',
      labelColor: 'rgba(245,243,240,0.55)',
      valueColor: 'var(--color-text-on-dark)',
      deltaColor: 'var(--color-accent-on-dark)',
      metaColor: 'rgba(245,243,240,0.32)'
    },
    accent: {
      bg: 'var(--color-accent)',
      labelColor: 'rgba(255,255,255,0.70)',
      valueColor: '#ffffff',
      deltaColor: 'rgba(255,255,255,0.90)',
      metaColor: 'rgba(255,255,255,0.55)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: v.bg,
      borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-xl)',
      padding: pill ? 'var(--space-5) var(--space-7)' : 'var(--space-5) var(--space-6) var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      ...extraStyle
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: v.labelColor,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-medium)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-3)',
      marginTop: label ? 'var(--space-3)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-5xl)',
      fontWeight: 'var(--weight-bold)',
      color: v.valueColor,
      fontFamily: 'var(--font-display)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-md)',
      color: v.deltaColor,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-medium)'
    }
  }, "/ ", delta)), deltaLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: v.metaColor,
      fontFamily: 'var(--font-body)',
      marginTop: 'var(--space-2)'
    }
  }, deltaLabel), accentBar && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 'var(--space-6)',
      right: 'var(--space-6)',
      height: 3,
      background: v.deltaColor,
      borderRadius: 'var(--radius-pill)'
    }
  }));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  children,
  color = 'default',
  size = 'md',
  removable = false,
  onRemove
}) {
  const colorMap = {
    default: {
      background: 'var(--color-surface-card)',
      color: 'var(--color-text-secondary)'
    },
    accent: {
      background: 'var(--color-accent-subtle)',
      color: 'var(--color-accent)'
    },
    dark: {
      background: 'var(--color-dark)',
      color: 'var(--color-text-on-dark)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      padding: size === 'sm' ? '2px 10px' : '5px 14px',
      borderRadius: 'var(--radius-pill)',
      fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      fontFamily: 'var(--font-body)',
      ...colorMap[color]
    }
  }, children, removable && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    style: {
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      color: 'currentColor',
      opacity: 0.6,
      fontSize: 14,
      lineHeight: 1,
      marginLeft: 2
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppSidebar.jsx
try { (() => {
const NAV_ITEMS = [{
  id: 'browse',
  label: '瀏覽課程',
  icon: /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "14",
    width: "7",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "7",
    height: "7",
    rx: "1"
  }))
}, {
  id: 'courses',
  label: '課程列表',
  icon: /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "15",
    y2: "18"
  }))
}, {
  id: 'saved',
  label: '已收藏',
  icon: /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 3h14a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2z"
  }))
}, {
  id: 'stats',
  label: '學習紀錄',
  icon: /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "20",
    x2: "18",
    y2: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "20",
    x2: "12",
    y2: "4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "20",
    x2: "6",
    y2: "14"
  }))
}];
function AppSidebar({
  activeItem = 'browse',
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      width: 'var(--sidebar-width)',
      minHeight: '100%',
      background: 'var(--color-dark)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'var(--space-5) 0',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 3,
      width: 26,
      height: 26,
      marginBottom: 'var(--space-7)'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderRadius: 3,
      background: i === 1 || i === 2 ? 'var(--color-accent-on-dark)' : 'rgba(255,255,255,0.80)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      width: '100%',
      alignItems: 'center'
    }
  }, NAV_ITEMS.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.id,
    title: item.label,
    onClick: () => onNavigate && onNavigate(item.id),
    style: {
      width: 44,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      background: activeItem === item.id ? 'rgba(255,255,255,0.10)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: activeItem === item.id ? 'var(--color-accent-on-dark)' : 'rgba(255,255,255,0.38)',
      transition: 'background var(--dur-fast), color var(--dur-fast)'
    }
  }, item.icon))), /*#__PURE__*/React.createElement("button", {
    title: "\u767B\u51FA",
    style: {
      marginTop: 'auto',
      width: 44,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.28)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "16,17 21,12 16,7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "12",
    x2: "9",
    y2: "12"
  }))));
}
Object.assign(__ds_scope, { AppSidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppSidebar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.AppSidebar = __ds_scope.AppSidebar;

})();
