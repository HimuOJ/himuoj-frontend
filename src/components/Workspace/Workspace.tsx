import { makeStyles, tokens, shorthands, Title1, Text } from '@fluentui/react-components';
import { useAppStore } from '../../stores/useAppStore';
import { useEffect, useState, useRef } from 'react';

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
    backgroundColor: tokens.colorNeutralBackground1,
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
    padding: '24px',
    overflowY: 'auto',
    overflowX: 'hidden',
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: tokens.colorNeutralStroke2,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: tokens.colorNeutralStroke1,
    },
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
  explorerContent: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  editorContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  testcaseContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  resultContent: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  settingsContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  placeholderBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '400px',
    color: tokens.colorNeutralForeground3,
  },
  codeEditor: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('8px'),
    padding: '16px',
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    minHeight: '300px',
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'pre-wrap',
    transition: 'all 0.3s ease',
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '16px',
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 24px ${tokens.colorNeutralShadowAmbient}`,
    },
  },
  staggerContainer: {
    '& > *': {
      opacity: 0,
      animation: `fadeInUp ${PAGE_EXIT_DURATION_MS}ms ${PAGE_ENTER_EASING} forwards`,
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        opacity: 1,
        transform: 'none',
      },
    },
    '& > *:nth-child(1)': { animationDelay: '0.03s' },
    '& > *:nth-child(2)': { animationDelay: '0.06s' },
    '& > *:nth-child(3)': { animationDelay: '0.09s' },
    '& > *:nth-child(4)': { animationDelay: '0.12s' },
    '& > *:nth-child(5)': { animationDelay: '0.15s' },
    '& > *:nth-child(6)': { animationDelay: '0.18s' },
  },
  resultCardAccepted: {
    borderLeft: `4px solid ${tokens.colorPaletteGreenBackground1}`,
    background: `linear-gradient(90deg, ${tokens.colorPaletteGreenBackground1}15 0%, transparent 100%)`,
  },
  toggleButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: `0 4px 12px ${tokens.colorBrandShadowAmbient}`,
    },
    ':active': {
      transform: 'scale(0.98)',
    },
  },
});

// Animation keyframes
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
  tab: string;
  state: AnimationState;
  direction: PageDirection;
}

const ExplorerView: React.FC = () => {
  const styles = useStyles();
  const problems = [
    { id: 1, title: 'A + B Problem', difficulty: 'Easy', solved: 12450 },
    { id: 2, title: 'Two Sum', difficulty: 'Easy', solved: 8932 },
    { id: 3, title: 'Longest Substring', difficulty: 'Medium', solved: 6543 },
    { id: 4, title: 'Median of Two Arrays', difficulty: 'Hard', solved: 3210 },
    { id: 5, title: 'Longest Palindrome', difficulty: 'Medium', solved: 5678 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return tokens.colorPaletteGreenForeground1;
      case 'Medium':
        return tokens.colorPaletteYellowForeground1;
      case 'Hard':
        return tokens.colorPaletteRedForeground1;
      default:
        return tokens.colorNeutralForeground2;
    }
  };

  return (
    <div className={styles.explorerContent}>
      <Title1>Explore Problems</Title1>
      <Text block style={{ marginTop: '8px', color: tokens.colorNeutralForeground2 }}>
        Discover and practice coding problems from our collection
      </Text>
      <div style={{ marginTop: '24px' }} className={styles.staggerContainer}>
        {problems.map((problem) => (
          <div
            key={problem.id}
            className={styles.card}
            style={{
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div>
              <Text weight="semibold" block>
                {problem.id}. {problem.title}
              </Text>
              <Text style={{ color: tokens.colorNeutralForeground2, fontSize: '12px', marginTop: '4px' }}>
                Solved by {problem.solved.toLocaleString()} users
              </Text>
            </div>
            <Text style={{ color: getDifficultyColor(problem.difficulty), fontWeight: 600 }}>
              {problem.difficulty}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

const EditorView: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.editorContent}>
      <div className={styles.codeEditor}>
{`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`}
      </div>
    </div>
  );
};

const TestcaseView: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.testcaseContent}>
      <Title1>Test Cases</Title1>
      <div style={{ marginTop: '24px' }} className={styles.staggerContainer}>
        <div className={styles.card} style={{ marginBottom: '12px' }}>
          <Text weight="semibold" block>Sample Test 1</Text>
          <div style={{ marginTop: '8px', display: 'flex', gap: '24px' }}>
            <div>
              <Text style={{ color: tokens.colorNeutralForeground2 }}>Input:</Text>
              <pre style={{ margin: '4px 0', fontFamily: 'monospace' }}>1 2</pre>
            </div>
            <div>
              <Text style={{ color: tokens.colorNeutralForeground2 }}>Expected Output:</Text>
              <pre style={{ margin: '4px 0', fontFamily: 'monospace' }}>3</pre>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <Text weight="semibold" block>Sample Test 2</Text>
          <div style={{ marginTop: '8px', display: 'flex', gap: '24px' }}>
            <div>
              <Text style={{ color: tokens.colorNeutralForeground2 }}>Input:</Text>
              <pre style={{ margin: '4px 0', fontFamily: 'monospace' }}>100 200</pre>
            </div>
            <div>
              <Text style={{ color: tokens.colorNeutralForeground2 }}>Expected Output:</Text>
              <pre style={{ margin: '4px 0', fontFamily: 'monospace' }}>300</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultView: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.resultContent}>
      <Title1>Submission Results</Title1>
      <div style={{ marginTop: '24px' }} className={styles.staggerContainer}>
        <div className={`${styles.card} ${styles.resultCardAccepted}`}>
          <Text weight="semibold" style={{ color: tokens.colorPaletteGreenForeground1 }}>Accepted</Text>
          <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <Text style={{ color: tokens.colorNeutralForeground2 }}>Time</Text>
              <Text block>12ms</Text>
            </div>
            <div>
              <Text style={{ color: tokens.colorNeutralForeground2 }}>Memory</Text>
              <Text block>2.4MB</Text>
            </div>
            <div>
              <Text style={{ color: tokens.colorNeutralForeground2 }}>Language</Text>
              <Text block>C++17</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsView: React.FC = () => {
  const styles = useStyles();
  const { isDarkMode, setIsDarkMode } = useAppStore();

  return (
    <div className={styles.settingsContent}>
      <Title1>Settings</Title1>
      <div style={{ marginTop: '24px' }} className={styles.staggerContainer}>
        <div className={styles.card} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Text weight="semibold" block>Dark Mode</Text>
            <Text style={{ color: tokens.colorNeutralForeground2, fontSize: '12px' }}>
              Toggle between light and dark theme
            </Text>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={styles.toggleButton}
          >
            {isDarkMode ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewComponents: Record<string, React.FC> = {
  explorer: ExplorerView,
  editor: EditorView,
  testcase: TestcaseView,
  result: ResultView,
  settings: SettingsView,
};

export const Workspace: React.FC = () => {
  const styles = useStyles();
  const { activeTab } = useAppStore();
  const [pages, setPages] = useState<PageState[]>([{ id: 0, tab: activeTab, state: 'entered', direction: 'forward' }]);
  const prevTabRef = useRef(activeTab);
  const pageIdRef = useRef(1);
  const tabOrder = ['explorer', 'editor', 'testcase', 'result', 'settings'];

  useEffect(() => {
    if (prevTabRef.current === activeTab) {
      return;
    }

    const currentIndex = tabOrder.indexOf(activeTab);
    const prevIndex = tabOrder.indexOf(prevTabRef.current);
    const direction: PageDirection = currentIndex > prevIndex ? 'forward' : 'backward';
    const nextPageId = pageIdRef.current;
    pageIdRef.current += 1;

    // Keep previous page for a brief overlap and animate the incoming page.
    setPages(prev => [
      ...prev.map(p => ({ ...p, state: 'exiting' as const })),
      { id: nextPageId, tab: activeTab, state: 'entering', direction },
    ]);

    prevTabRef.current = activeTab;

    const timer = window.setTimeout(() => {
      setPages(prev =>
        prev
          .filter(p => p.id === nextPageId)
          .map(p => ({ ...p, state: 'entered' as const }))
      );
    }, PAGE_ENTER_DURATION_MS + 30);

    return () => window.clearTimeout(timer);
  }, [activeTab]);

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
            const ViewComponent = ViewComponents[page.tab] || (() => (
              <div className={styles.placeholderBox}>
                <Title1>{page.tab.charAt(0).toUpperCase() + page.tab.slice(1)}</Title1>
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
