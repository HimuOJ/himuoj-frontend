import { makeStyles, tokens } from '@fluentui/react-components';
import { useEffect, useRef, useState } from 'react';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'relative',
    minWidth: 0,
    minHeight: 0,
  },
  pane: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    minWidth: 0,
    minHeight: 0,
  },
  divider: {
    width: '6px',
    flexShrink: 0,
    cursor: 'col-resize',
    position: 'relative',
    backgroundColor: 'transparent',
    ':hover::before': {
      backgroundColor: tokens.colorBrandStroke1,
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '2px',
      width: '2px',
      borderRadius: '999px',
      backgroundColor: tokens.colorNeutralStroke2,
      transition: 'background-color 0.2s ease',
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
      if (!isDragging.current || !containerRef.current) {
        return;
      }

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
        onMouseDown={() => {
          isDragging.current = true;
        }}
        role="separator"
        aria-orientation="vertical"
        aria-label="调整主视图与辅助视图宽度"
      />
      <div className={styles.pane} style={{ width: `${100 - leftWidth}%` }}>
        {right}
      </div>
    </div>
  );
};
