import React from 'react';

// One icon family: 24px grid, 1.8 stroke, round caps. Decorative unless a label is given.
function Icon({ children, label, size = 22 }) {
  return (
    <svg className="hl-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {children}
    </svg>
  );
}

export const IconOverview = (p) => <Icon {...p}><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></Icon>;
export const IconLibrary = (p) => <Icon {...p}><path d="M9 3h6M10 3v6l-5 9q-1 3 2 3h10q3 0 2-3l-5-9V3" /><path d="M7.5 15h9" /></Icon>;
export const IconHistory = (p) => <Icon {...p}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v4h4" /><path d="M12 8v4l3 2" /></Icon>;
export const IconMenu = (p) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>;
export const IconClose = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>;
export const IconCollapse = (p) => <Icon {...p}><path d="M15 6l-6 6 6 6" /></Icon>;
export const IconExpand = (p) => <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>;
export const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></Icon>;
export const IconArrow = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
export const IconHand = (p) => <Icon {...p}><path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12V4.5a1.5 1.5 0 0 1 3 0V12V6a1.5 1.5 0 0 1 3 0v8q0 6-6 7-4 0-6-4l-2-4q-1-2 1-2.5t3 1.5z" /></Icon>;
export const IconChat = (p) => <Icon {...p}><path d="M4 6q0-2 2-2h12q2 0 2 2v8q0 2-2 2h-7l-5 4v-4q-2 0-2-2z" /><path d="M8 9h8M8 12h5" /></Icon>;
export const IconRefresh = (p) => <Icon {...p}><path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M20 4v5h-5" /></Icon>;
export const IconLock = (p) => <Icon {...p}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Icon>;
export const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
