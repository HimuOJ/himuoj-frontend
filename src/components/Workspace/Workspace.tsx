import { makeStyles, tokens, shorthands, Title1, Text, Switch } from '@fluentui/react-components';
import { useAppStore } from '../../stores/useAppStore';
import { useEffect, useState, useRef } from 'react';
import {
  getLatestSubmissionMock,
  listProblemTestCasesMock,
  listProblemsMock,
  listSubmissionTestCaseResultsMock,
} from '../../api/mock';
import type { components as ProblemComponents } from '../../api/problems.gen';
import type { components as SubmissionComponents } from '../../api/submissions.gen';

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
    maxWidth: '960px',
    margin: '0 auto',
  },
  editorContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  testcaseContent: {
    maxWidth: '860px',
    margin: '0 auto',
  },
  resultContent: {
    maxWidth: '960px',
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
    background: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    padding: '18px',
    fontFamily: '"JetBrains Mono", "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    minHeight: '300px',
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'pre-wrap',
  },
  card: {
    background: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    padding: '18px',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1),
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
    '& > *:nth-child(7)': { animationDelay: '0.21s' },
    '& > *:nth-child(8)': { animationDelay: '0.24s' },
  },
  sectionText: {
    marginTop: '8px',
    color: tokens.colorNeutralForeground2,
    fontSize: '14px',
    lineHeight: '1.5',
  },
  listStack: {
    marginTop: '24px',
    display: 'grid',
    gap: '14px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  indexPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '54px',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.2px',
    color: tokens.colorNeutralForeground2,
    backgroundColor: 'var(--workspace-index-pill-bg)',
    ...shorthands.border('1px', 'solid', 'var(--workspace-index-pill-border)'),
  },
  titleText: {
    fontSize: '17px',
    lineHeight: '1.35',
  },
  metaRow: {
    marginTop: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  metaPill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    background: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  caseFields: {
    marginTop: '10px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '10px',
    '@media (max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
  caseField: {
    padding: '10px 12px',
    borderRadius: '10px',
    background: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  fieldLabel: {
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
  },
  fieldValue: {
    marginTop: '4px',
    fontFamily: '"JetBrains Mono", "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace',
    fontSize: '12px',
  },
  resultMetrics: {
    marginTop: '12px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '10px',
    '@media (max-width: 680px)': {
      gridTemplateColumns: '1fr',
    },
  },
  metricCard: {
    padding: '12px',
    borderRadius: '10px',
    background: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  metricLabel: {
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '4px',
  },
  verdictPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '999px',
    background: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    fontWeight: 700,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  resultCaseList: {
    marginTop: '14px',
    display: 'grid',
    gap: '10px',
  },
  resultCaseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: '10px',
    background: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    '@media (max-width: 680px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '8px',
    },
  },
  resultCaseMeta: {
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
    marginTop: '4px',
  },
  resultCardAccepted: {
    borderLeft: `4px solid ${tokens.colorPaletteGreenBorder1}`,
    background: 'linear-gradient(110deg, rgba(46, 177, 117, 0.2) 0%, rgba(0, 0, 0, 0) 68%)',
  },
  settingsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
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

type ProblemSummary = ProblemComponents['schemas']['ProblemSummary'];
type TestCaseDetail = ProblemComponents['schemas']['TestCaseDetail'];
type SubmissionDetail = SubmissionComponents['schemas']['SubmissionDetail'];
type TestCaseResultDetail = SubmissionComponents['schemas']['TestCaseResultDetail'];
type JudgeStatus = SubmissionComponents['schemas']['JudgeStatus'];

const DEFAULT_PROBLEM_ID = 1;

const formatMemoryFromKb = (valueKb: number) => {
  if (valueKb >= 1024) {
    const valueMb = valueKb / 1024;
    return `${Number.isInteger(valueMb) ? valueMb : valueMb.toFixed(1)}MB`;
  }
  return `${valueKb}KB`;
};

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getJudgeStatusLabel = (status: JudgeStatus) => {
  switch (status) {
    case 'Pending':
      return '排队中';
    case 'Running':
      return '评测中';
    case 'Accepted':
      return '通过';
    case 'WrongAnswer':
      return '答案错误';
    case 'TimeLimitExceeded':
      return '超出时间限制';
    case 'MemoryLimitExceeded':
      return '超出内存限制';
    case 'RuntimeError':
      return '运行时错误';
    case 'CompilationError':
      return '编译错误';
    default:
      return '系统错误';
  }
};

const getJudgeStatusColor = (status: JudgeStatus) => {
  switch (status) {
    case 'Accepted':
      return tokens.colorPaletteGreenForeground1;
    case 'Pending':
    case 'Running':
      return tokens.colorPaletteYellowForeground1;
    default:
      return tokens.colorPaletteRedForeground1;
  }
};

const getJudgeStatusTint = (status: JudgeStatus) => {
  switch (status) {
    case 'Accepted':
      return 'rgba(28, 196, 130, 0.2)';
    case 'Pending':
    case 'Running':
      return 'rgba(240, 179, 60, 0.2)';
    default:
      return 'rgba(233, 93, 93, 0.2)';
  }
};

const ExplorerView: React.FC = () => {
  const styles = useStyles();
  const { openProblemInEditor } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<ProblemSummary[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadProblems = async () => {
      setLoading(true);
      try {
        const response = await listProblemsMock({ page: 1, pageSize: 8 });
        if (!mounted) {
          return;
        }
        setProblems(response.items);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProblems();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.explorerContent}>
      <Title1>浏览题目</Title1>
      <Text block className={styles.sectionText}>
        从题库中选择并练习编程题目
      </Text>
      <div className={`${styles.listStack} ${styles.staggerContainer}`}>
        {loading && (
          <div className={styles.card}>
            <Text>正在加载题目...</Text>
          </div>
        )}
        {!loading && problems.length === 0 && (
          <div className={styles.card}>
            <Text>暂无题目</Text>
          </div>
        )}
        {problems.map((problem) => (
          <div
            key={problem.id}
            className={styles.card}
            onClick={() => openProblemInEditor({ id: problem.id, title: problem.title })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openProblemInEditor({ id: problem.id, title: problem.title });
              }
            }}
          >
            <div className={styles.cardHeader}>
              <div>
                <Text weight="semibold" className={styles.titleText} block>
                  {problem.title}
                </Text>
                <Text block className={styles.resultCaseMeta}>
                  作者 #{problem.authorId} · 创建于 {formatDateTime(problem.createdAt)}
                </Text>
              </div>
              <span className={styles.indexPill}>#{problem.id}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaPill}>时间限制 {problem.timeLimitMs}ms</span>
              <span className={styles.metaPill}>内存限制 {formatMemoryFromKb(problem.memoryLimitKb)}</span>
              <span className={styles.metaPill}>Author ID {problem.authorId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EditorView: React.FC = () => {
  const styles = useStyles();
  const { selectedProblem } = useAppStore();

  return (
    <div className={styles.editorContent}>
      {selectedProblem ? (
        <>
          <div style={{ marginBottom: '16px', padding: '12px 16px', background: tokens.colorNeutralBackground2, borderRadius: '8px', border: `1px solid ${tokens.colorNeutralStroke2}` }}>
            <Text weight="semibold" style={{ fontSize: '16px' }}>
              当前题目: {selectedProblem.title}
            </Text>
            <Text style={{ marginLeft: '12px', color: tokens.colorNeutralForeground2, fontSize: '14px' }}>
              #{selectedProblem.id}
            </Text>
          </div>
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
        </>
      ) : (
        <div className={styles.placeholderBox}>
          <Text weight="semibold" style={{ fontSize: '18px', color: tokens.colorNeutralForeground2 }}>
            请从题库中选择一个题目开始编程
          </Text>
          <Text style={{ marginTop: '8px', color: tokens.colorNeutralForeground3 }}>
            在"题库"标签页中点击任意题目卡片即可打开编辑器
          </Text>
        </div>
      )}
    </div>
  );
};

const TestcaseView: React.FC = () => {
  const styles = useStyles();
  const [loading, setLoading] = useState(true);
  const [testCases, setTestCases] = useState<TestCaseDetail[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadTestCases = async () => {
      setLoading(true);
      try {
        const response = await listProblemTestCasesMock(DEFAULT_PROBLEM_ID, { includeHidden: true });
        if (!mounted) {
          return;
        }
        setTestCases(response.items);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadTestCases();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.testcaseContent}>
      <Title1>测试用例</Title1>
      <Text block className={styles.sectionText}>
        显示该题目的测试用例元数据与对象引用
      </Text>
      <div className={`${styles.listStack} ${styles.staggerContainer}`}>
        {loading && (
          <div className={styles.card}>
            <Text>正在加载测试用例...</Text>
          </div>
        )}
        {!loading && testCases.length === 0 && (
          <div className={styles.card}>
            <Text>当前题目暂无测试用例</Text>
          </div>
        )}
        {testCases.map((testCase) => (
          <div key={testCase.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <Text weight="semibold" className={styles.titleText} block>
                用例 #{testCase.id} · 题目 #{testCase.problemId}
              </Text>
              <span className={styles.indexPill}>{testCase.isHidden ? '隐藏' : '公开'}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaPill}>分值权重 {testCase.scoreWeight}</span>
              <span className={styles.metaPill}>Hidden: {testCase.isHidden ? 'true' : 'false'}</span>
            </div>
            <div className={styles.caseFields}>
              <div className={styles.caseField}>
                <Text className={styles.fieldLabel}>inputUploadId</Text>
                <div className={styles.fieldValue}>{testCase.inputUploadId}</div>
              </div>
              <div className={styles.caseField}>
                <Text className={styles.fieldLabel}>expectedOutputUploadId</Text>
                <div className={styles.fieldValue}>{testCase.expectedOutputUploadId}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResultView: React.FC = () => {
  const styles = useStyles();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResultDetail[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadResult = async () => {
      setLoading(true);
      try {
        const latestSubmission = await getLatestSubmissionMock(DEFAULT_PROBLEM_ID);
        if (!mounted) {
          return;
        }
        setSubmission(latestSubmission);

        if (!latestSubmission) {
          setTestCaseResults([]);
          return;
        }

        const response = await listSubmissionTestCaseResultsMock(latestSubmission.id);
        if (!mounted) {
          return;
        }
        setTestCaseResults(response.items);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadResult();
    return () => {
      mounted = false;
    };
  }, []);

  const acceptedCount = testCaseResults.filter((item) => item.status === 'Accepted').length;

  return (
    <div className={styles.resultContent}>
      <Title1>提交结果</Title1>
      <Text block className={styles.sectionText}>
        最新提交的评测状态、资源消耗与测试点明细
      </Text>
      <div className={`${styles.listStack} ${styles.staggerContainer}`}>
        {loading && (
          <div className={styles.card}>
            <Text>正在加载提交结果...</Text>
          </div>
        )}
        {!loading && !submission && (
          <div className={styles.card}>
            <Text>暂无提交记录</Text>
          </div>
        )}
        {!loading && submission && (
          <div className={`${styles.card} ${submission.status === 'Accepted' ? styles.resultCardAccepted : ''}`}>
            <div className={styles.cardHeader}>
              <div className={styles.verdictPill} style={{ color: getJudgeStatusColor(submission.status), background: getJudgeStatusTint(submission.status) }}>
                <span className={styles.statusDot} />
                {getJudgeStatusLabel(submission.status)}
              </div>
              <span className={styles.indexPill}>#{submission.id}</span>
            </div>
            <div className={styles.resultMetrics}>
              <div className={styles.metricCard}>
                <Text className={styles.metricLabel}>耗时</Text>
                <Text block className={styles.metricValue}>{submission.maxTimeConsumedMs}ms</Text>
              </div>
              <div className={styles.metricCard}>
                <Text className={styles.metricLabel}>内存</Text>
                <Text block className={styles.metricValue}>{formatMemoryFromKb(submission.maxMemoryConsumedKb)}</Text>
              </div>
              <div className={styles.metricCard}>
                <Text className={styles.metricLabel}>语言</Text>
                <Text block className={styles.metricValue}>{submission.language}</Text>
              </div>
            </div>
            <Text block className={styles.resultCaseMeta}>
              提交 #{submission.id} · 提交时间 {formatDateTime(submission.submittedAt)}
            </Text>
            <Text block className={styles.resultCaseMeta}>
              测试点通过 {acceptedCount}/{testCaseResults.length}
            </Text>
            {testCaseResults.length > 0 && (
              <div className={styles.resultCaseList}>
                {testCaseResults.map((item) => (
                  <div key={item.id} className={styles.resultCaseItem}>
                    <div>
                      <Text weight="semibold">测试点 #{item.testCaseId}</Text>
                      <Text block className={styles.resultCaseMeta}>
                        {item.timeConsumedMs}ms · {formatMemoryFromKb(item.memoryConsumedKb)}
                      </Text>
                    </div>
                    <div
                      className={styles.verdictPill}
                      style={{ color: getJudgeStatusColor(item.status), background: getJudgeStatusTint(item.status) }}
                    >
                      <span className={styles.statusDot} />
                      {getJudgeStatusLabel(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsView: React.FC = () => {
  const styles = useStyles();
  const { isDarkMode, setIsDarkMode } = useAppStore();

  return (
    <div className={styles.settingsContent}>
      <Title1>偏好设置</Title1>
      <div style={{ marginTop: '24px' }} className={styles.staggerContainer}>
        <div className={`${styles.card} ${styles.settingsRow}`}>
          <div>
            <Text weight="semibold" block>深色模式</Text>
            <Text style={{ color: tokens.colorNeutralForeground2, fontSize: '12px' }}>
              在浅色与深色主题间切换
            </Text>
          </div>
          <Switch
            checked={isDarkMode}
            onChange={(_, data) => setIsDarkMode(data.checked)}
            label={isDarkMode ? '已开启' : '已关闭'}
          />
        </div>
      </div>
    </div>
  );
};

const tabLabels: Record<string, string> = {
  explorer: '题库',
  editor: '编辑器',
  testcase: '测试点',
  result: '结果',
  settings: '设置',
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
                <Title1>{tabLabels[page.tab] || page.tab}</Title1>
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
