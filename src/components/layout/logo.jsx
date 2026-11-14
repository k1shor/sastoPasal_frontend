import { cn } from '@/lib/utils';

const SIZE_STYLES = {
  sm: { box: 'size-8 rounded-[10px]', glyph: 'size-[18px]' },
  md: { box: 'size-9 rounded-xl', glyph: 'size-[22px]' },
};

/**
 * SastoPasal brand mark, optionally followed by the wordmark.
 * Colours come from theme tokens only (no hardcoded values).
 */
export function Logo({ size = 'md', showName = false, className, nameClassName }) {
  const styles = SIZE_STYLES[size] ?? SIZE_STYLES.md;

  return (
    <span className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <span
        className={cn(
          'grid shrink-0 place-items-center bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/25',
          styles.box,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={styles.glyph}
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M5.6 8.6h12.8l-1 10a1.8 1.8 0 0 1-1.8 1.6H8.4a1.8 1.8 0 0 1-1.8-1.6l-1-10Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 8.6V7.1a2.8 2.8 0 0 1 5.6 0v1.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M10.4 13.2h3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>

      {showName && (
        <span
          className={cn(
            'truncate text-[15px] font-semibold leading-none tracking-tight text-foreground',
            nameClassName,
          )}
        >
          SastoPasal
        </span>
      )}
    </span>
  );
}
