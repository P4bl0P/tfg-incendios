import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

interface MapControlButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

export default function MapControlButton({
  children,
  active = false,
  className = '',
  ...props
}: MapControlButtonProps) {
  return (
    <button
      type="button"
      className={[
        'relative flex h-9 w-9 items-center justify-center',
        'overflow-hidden rounded-xl border',
        'backdrop-blur-xl',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-0.5 hover:scale-105',
        'active:scale-95',
        'focus:outline-none focus-visible:ring-2',
        'focus-visible:ring-blue-400/60',
        'disabled:cursor-not-allowed disabled:opacity-45',
        active
          ? [
              'border-blue-200 bg-blue-50 text-blue-600',
              'shadow-[0_4px_12px_rgba(37,99,235,0.25)]',
              'hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)]',
            ].join(' ')
          : [
              'border-white/80 bg-white/95 text-slate-600',
              'shadow-[0_4px_12px_rgba(15,23,42,0.2)]',
              'hover:text-blue-600',
              'hover:shadow-[0_6px_16px_rgba(37,99,235,0.25)]',
            ].join(' '),
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}