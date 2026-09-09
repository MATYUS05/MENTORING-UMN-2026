// src/shared/components/PageBackground.tsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders a full-page background image via a portal straight into <body>,
 * sized to the whole document height (navbar top through footer bottom) and
 * kept behind everything with a negative z-index. Scrolls with the page
 * (not `position: fixed`) since it's positioned against the document, not
 * the viewport.
 */
export default function PageBackground({ src }: { src: string }) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const root = document.getElementById('root');
    const update = () => setHeight(root ? root.scrollHeight : document.documentElement.scrollHeight);
    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(root ?? document.body);
    window.addEventListener('resize', update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-50"
      style={{
        height,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />,
    document.body,
  );
}
