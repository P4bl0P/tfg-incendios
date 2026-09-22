import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import styles from './CSS/LayerToggle.module.css';

type LayerType = 'dark' | 'satellite';

interface LayerToggleProps {
  activeLayer: LayerType;
  setLayer: (layer: LayerType) => void;
}

function TerrainIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path d="M3 19h18L14 8l-4 5-2-2-5 8Z" />
      <path d="m14 8 2-3 5 7" />
    </svg>
  );
}

function SatelliteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <circle cx="12" cy="12" r="3" />
      <path d="M5.64 5.64a9 9 0 0 0 0 12.72" />
      <path d="M18.36 5.64a9 9 0 0 1 0 12.72" />
      <path d="M2.81 2.81a13 13 0 0 0 0 18.38" />
      <path d="M21.19 2.81a13 13 0 0 1 0 18.38" />
    </svg>
  );
}

export default function LayerToggle({ activeLayer, setLayer }: LayerToggleProps) {
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const firstRender = useRef(true);

  const isSatellite = activeLayer === 'satellite';

  useEffect(() => {
    if (!indicatorRef.current) return;

    const translateX = isSatellite ? '100%' : '0%';

    if (firstRender.current) {
      indicatorRef.current.style.transform = `translateX(${translateX})`;
      firstRender.current = false;
      return;
    }

    animate(indicatorRef.current, {
      translateX,
      duration: 550,
      ease: 'out(4)',
    });
  }, [isSatellite]);

  return (
    <div className={styles.layerToggle} role="group" aria-label="Capa base del mapa">
      <span ref={indicatorRef} className={styles.indicator} />

      <button
        type="button"
        className={`${styles.button} ${!isSatellite ? styles.buttonActive : ''}`}
        aria-pressed={!isSatellite}
        onClick={() => setLayer('dark')}
      >
        <span className={styles.iconWrapper}>
          <TerrainIcon />
        </span>
        <span>Relieve</span>
      </button>

      <button
        type="button"
        className={`${styles.button} ${isSatellite ? styles.buttonActive : ''}`}
        aria-pressed={isSatellite}
        onClick={() => setLayer('satellite')}
      >
        <span className={styles.iconWrapper}>
          <SatelliteIcon />
        </span>
        <span>Satélite</span>
      </button>
    </div>
  );
}