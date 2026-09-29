import type { AnchorHTMLAttributes } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

// Native navigation remains reliable when the Vinext client router fails to initialize.
export default function SafeLink({ href, ...props }: Props) {
  return <a href={href} {...props} />;
}
