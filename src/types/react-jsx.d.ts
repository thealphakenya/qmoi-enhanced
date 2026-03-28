import type React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
        enabled?: boolean;
      };
    }
  }
}
