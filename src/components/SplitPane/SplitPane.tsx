import { makeStyles, tokens } from '@fluentui/react-components';
import { useState, useRef, useEffect } from 'react';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  pane: {
    overflow: 'auto',
    height: '100%',
  },
  divider: {
    width: '4px',
    cursor: 'col-resize',
    backgroundColor: tokens.colorNeutralStroke2,
    ':hover': {
      backgroundColor: tokens.colorBrandBackground,
    },
  },
});

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
}

export const SplitPane: React.FC<SplitPaneProps> = ({ left, right, defaultLeftWidth = 50 }) => {
  const styles = useStyles();
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setLeftWidth(Math.max(20, Math.min(80, newWidth)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.pane} style={{ width: `${leftWidth}%` }}>
        {left}
      </div>
      <div
        className={styles.divider}
        onMouseDown={() => (isDragging.current = true)}
      />
      <div className={styles.pane} style={{ width: `${100 - leftWidth}%` }}>
        {right}
      </div>
    </div>
  );
};
