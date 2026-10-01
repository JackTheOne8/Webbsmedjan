type IconName = 'arrow-up-right' | 'menu' | 'close' | 'check' | 'plus';

const paths: Record<IconName, string> = {
  'arrow-up-right': 'M6 18 18 6M6 6h12v12',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  check: 'm5 12 4 4L19 6',
  plus: 'M12 5v14M5 12h14',
};

// SVG paths keep the same shape on iOS, Android and desktop, independent of emoji fonts.
export function Icon({ name }: { name: IconName }) {
  return <svg className={`ui-icon ui-icon-${name}`} data-icon={name} width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={paths[name]}/>
  </svg>;
}
