import { makeStyles, Title1 } from '@fluentui/react-components';
import { useAppStore, type PrimaryTabType } from '../../stores/useAppStore';
import { useEffect, useState, useRef } from 'react';
import { ExplorerView, ProblemView, SettingsView } from '../views';

const PAGE_ENTER_DURATION_MS = 420;
const PAGE_EXIT_DURATION_MS = 320;
const PAGE_ENTER_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const PAGE_EXIT_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const PAGE_OFFSET_PX = 26;

const useStyles = makeStyles({
  container: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    background: 'var(--workspace-bg)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  content: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  pageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: '28px',
    overflowY: 'auto',
    overflowX: 'hidden',
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    '&::-webkit-scrollbar': { width: '8px' },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': { background: 'var(--colorNeutralStroke2)', borderRadius: '4px' },
    '&::-webkit-scrollbar-thumb:hover': { background: 'var(--colorNeutralStroke1)' },
  },
  pageEntered: {
    zIndex: 1,
  },
  pageEnterForward: {
    zIndex: 2,
    pointerEvents: 'none',
    animation: `workspacePageEnterForward ${PAGE_ENTER_DURATION_MS}ms ${PAGE_ENTER_EASING} forwards`,
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '1ms',
    },
  },
  pageEnterBackward: {
    zIndex: 2,
    pointerEvents: 'none',
    animation: `workspacePageEnterBackward ${PAGE_ENTER_DURATION_MS}ms ${PAGE_ENTER_EASING} forwards`,
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '1ms',
    },
  },
  pageExitForward: {
    zIndex: 1,
    pointerEvents: 'none',
    animation: `workspacePageExitForward ${PAGE_EXIT_DURATION_MS}ms ${PAGE_EXIT_EASING} forwards`,
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '1ms',
    },
  },
  pageExitBackward: {
    zIndex: 1,
    pointerEvents: 'none',
    animation: `workspacePageExitBackward ${PAGE_EXIT_DURATION_MS}ms ${PAGE_EXIT_EASING} forwards`,
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '1ms',
    },
  },
  placeholderBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '400px',
    color: 'var(--colorNeutralForeground3)',
  },
});

const animationStyles = `
  @keyframes workspacePageEnterForward {
    0% {
      transform: translate3d(0, ${PAGE_OFFSET_PX}px, 0) scale(0.992);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
  }

  @keyframes workspacePageEnterBackward {
    0% {
      transform: translate3d(0, -${PAGE_OFFSET_PX}px, 0) scale(0.992);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
  }

  @keyframes workspacePageExitForward {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, -${Math.round(PAGE_OFFSET_PX * 0.5)}px, 0) scale(0.996);
      opacity: 0;
    }
  }

  @keyframes workspacePageExitBackward {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, ${Math.round(PAGE_OFFSET_PX * 0.5)}px, 0) scale(0.996);
      opacity: 0;
    }
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translate3d(0, 10px, 0);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

type AnimationState = 'entering' | 'entered' | 'exiting';
type PageDirection = 'forward' | 'backward';

interface PageState {
  id: number;
  tab: PrimaryTabType;
  state: AnimationState;
  direction: PageDirection;
}

const tabLabels: Record<PrimaryTabType, string> = {
  explorer: '题库',
  problem: '题面',
  settings: '设置',
};

const ViewComponents: Record<PrimaryTabType, React.FC> = {
  explorer: ExplorerView,
  problem: ProblemView,
  settings: SettingsView,
};

export const Workspace: React.FC = () => {
  const styles = useStyles();
  const { primaryTab } = useAppStore();
  const [pages, setPages] = useState<PageState[]>([{ id: 0, tab: primaryTab, state: 'entered', direction: 'forward' }]);
  const prevTabRef = useRef(primaryTab);
  const pageIdRef = useRef(1);
  const tabOrder: PrimaryTabType[] = ['explorer', 'problem', 'settings'];

  useEffect(() => {
    if (prevTabRef.current === primaryTab) {
      return;
    }

    const currentIndex = tabOrder.indexOf(primaryTab);
    const prevIndex = tabOrder.indexOf(prevTabRef.current);
    const direction: PageDirection = currentIndex > prevIndex ? 'forward' : 'backward';
    const nextPageId = pageIdRef.current;
    pageIdRef.current += 1;

    setPages(prev => [
      ...prev.map(p => ({ ...p, state: 'exiting' as const })),
      { id: nextPageId, tab: primaryTab, state: 'entering', direction },
    ]);

    prevTabRef.current = primaryTab;

    const timer = window.setTimeout(() => {
      setPages(prev =>
        prev
          .filter(p => p.id === nextPageId)
          .map(p => ({ ...p, state: 'entered' as const }))
      );
    }, PAGE_ENTER_DURATION_MS + 30);

    return () => window.clearTimeout(timer);
  }, [primaryTab]);

  const getPageClasses = (page: PageState) => {
    const baseClass = styles.pageContainer;

    if (page.state === 'entering') {
      return `${baseClass} ${page.direction === 'forward' ? styles.pageEnterForward : styles.pageEnterBackward}`;
    }
    if (page.state === 'exiting') {
      return `${baseClass} ${page.direction === 'forward' ? styles.pageExitForward : styles.pageExitBackward}`;
    }
    return `${baseClass} ${styles.pageEntered}`;
  };

  return (
    <>
      <style>{animationStyles}</style>
      <main className={styles.container} role="main">
        <div className={styles.content}>
          {pages.map((page) => {
            const ViewComponent = ViewComponents[page.tab] ?? (() => (
              <div className={styles.placeholderBox}>
                <Title1>{tabLabels[page.tab]}</Title1>
              </div>
            ));

            return (
              <div
                key={page.id}
                className={getPageClasses(page)}
              >
                <ViewComponent />
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};
