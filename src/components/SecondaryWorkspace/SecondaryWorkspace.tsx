import { makeStyles, Text, tokens } from '@fluentui/react-components';
import { useEffect, useRef, useState } from 'react';
import { useAppStore, type SecondaryTabType } from '../../stores/useAppStore';
import { EditorView, TestcaseView, ResultView } from '../views';

const PAGE_ENTER_DURATION_MS = 420;
const PAGE_EXIT_DURATION_MS = 320;
const PAGE_ENTER_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const PAGE_EXIT_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const PAGE_OFFSET_PX = 26;

const useStyles = makeStyles({
  panel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, var(--workspace-bg) 0%, color-mix(in srgb, var(--workspace-bg) 92%, var(--workspace-accent-soft)) 100%)',
    ...{
      borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
      borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '18px 22px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    background: 'color-mix(in srgb, var(--workspace-bg) 82%, transparent)',
    backdropFilter: 'blur(12px)',
  },
  headerText: {
    display: 'grid',
    gap: '4px',
    minWidth: 0,
  },
  eyebrow: {
    fontSize: '11px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: tokens.colorNeutralForeground3,
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tabLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
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
    animation: `secondaryPageEnterForward ${PAGE_ENTER_DURATION_MS}ms ${PAGE_ENTER_EASING} forwards`,
  },
  pageEnterBackward: {
    zIndex: 2,
    pointerEvents: 'none',
    animation: `secondaryPageEnterBackward ${PAGE_ENTER_DURATION_MS}ms ${PAGE_ENTER_EASING} forwards`,
  },
  pageExitForward: {
    zIndex: 1,
    pointerEvents: 'none',
    animation: `secondaryPageExitForward ${PAGE_EXIT_DURATION_MS}ms ${PAGE_EXIT_EASING} forwards`,
  },
  pageExitBackward: {
    zIndex: 1,
    pointerEvents: 'none',
    animation: `secondaryPageExitBackward ${PAGE_EXIT_DURATION_MS}ms ${PAGE_EXIT_EASING} forwards`,
  },
});

const animationStyles = `
  @keyframes secondaryPageEnterForward {
    0% {
      transform: translate3d(${PAGE_OFFSET_PX}px, 0, 0) scale(0.992);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
  }

  @keyframes secondaryPageEnterBackward {
    0% {
      transform: translate3d(-${PAGE_OFFSET_PX}px, 0, 0) scale(0.992);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
  }

  @keyframes secondaryPageExitForward {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate3d(-${Math.round(PAGE_OFFSET_PX * 0.5)}px, 0, 0) scale(0.996);
      opacity: 0;
    }
  }

  @keyframes secondaryPageExitBackward {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate3d(${Math.round(PAGE_OFFSET_PX * 0.5)}px, 0, 0) scale(0.996);
      opacity: 0;
    }
  }
`;

type AnimationState = 'entering' | 'entered' | 'exiting';
type PageDirection = 'forward' | 'backward';

interface PageState {
  id: number;
  tab: SecondaryTabType;
  state: AnimationState;
  direction: PageDirection;
}

const tabLabels: Record<SecondaryTabType, string> = {
  editor: '编辑器',
  testcase: '测试点',
  result: '结果',
};

const ViewComponents: Record<SecondaryTabType, React.FC> = {
  editor: EditorView,
  testcase: TestcaseView,
  result: ResultView,
};

export const SecondaryWorkspace: React.FC = () => {
  const styles = useStyles();
  const { secondaryTab, selectedProblem } = useAppStore();
  const [pages, setPages] = useState<PageState[]>([{ id: 0, tab: secondaryTab, state: 'entered', direction: 'forward' }]);
  const prevTabRef = useRef(secondaryTab);
  const pageIdRef = useRef(1);
  const tabOrder: SecondaryTabType[] = ['editor', 'testcase', 'result'];

  useEffect(() => {
    if (prevTabRef.current === secondaryTab) {
      return;
    }

    const currentIndex = tabOrder.indexOf(secondaryTab);
    const prevIndex = tabOrder.indexOf(prevTabRef.current);
    const direction: PageDirection = currentIndex > prevIndex ? 'forward' : 'backward';
    const nextPageId = pageIdRef.current;
    pageIdRef.current += 1;

    setPages((prev) => [
      ...prev.map((page) => ({ ...page, state: 'exiting' as const })),
      { id: nextPageId, tab: secondaryTab, state: 'entering', direction },
    ]);

    prevTabRef.current = secondaryTab;

    const timer = window.setTimeout(() => {
      setPages((prev) =>
        prev
          .filter((page) => page.id === nextPageId)
          .map((page) => ({ ...page, state: 'entered' as const }))
      );
    }, PAGE_ENTER_DURATION_MS + 30);

    return () => window.clearTimeout(timer);
  }, [secondaryTab]);

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
      <aside className={styles.panel} aria-label="状态相关工作区">
        <div className={styles.header}>
          <div className={styles.headerText}>
            <Text className={styles.eyebrow}>Current Problem</Text>
            <Text className={styles.title}>{selectedProblem?.title}</Text>
          </div>
          <Text className={styles.tabLabel}>{tabLabels[secondaryTab]}</Text>
        </div>
        <div className={styles.content}>
          {pages.map((page) => {
            const ViewComponent = ViewComponents[page.tab];

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
      </aside>
    </>
  );
};
