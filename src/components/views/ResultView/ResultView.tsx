import { makeStyles, Title1, Text, tokens } from '@fluentui/react-components';
import { useState, useEffect } from 'react';
import { getLatestSubmissionMock, listSubmissionTestCaseResultsMock } from '../../../api/mock';
import { formatMemoryFromKb, formatDateTime, JUDGE_STATUS_CONFIG } from '../../../utils';
import type { components as SubmissionComponents } from '../../../api/submissions.gen';
import { useAppStore } from '../../../stores/useAppStore';

type SubmissionDetail = SubmissionComponents['schemas']['SubmissionDetail'];
type TestCaseResultDetail = SubmissionComponents['schemas']['TestCaseResultDetail'];

const useStyles = makeStyles({
  content: {
    maxWidth: '960px',
    margin: '0 auto',
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
  staggerContainer: {
    '& > *': {
      opacity: 0,
      animation: 'fadeInUp 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        opacity: 1,
        transform: 'none',
      },
    },
    '& > *:nth-child(1)': { animationDelay: '0.03s' },
  },
  card: {
    background: tokens.colorNeutralBackground2,
    border: '1px solid var(--colorNeutralStroke2)',
    padding: '18px',
    borderRadius: '4px',
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
    border: '1px solid var(--workspace-index-pill-border)',
  },
  verdictPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '999px',
    background: tokens.colorNeutralBackground2,
    border: '1px solid var(--colorNeutralStroke2)',
    fontWeight: 700,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
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
    borderRadius: '4px',
    background: tokens.colorNeutralBackground2,
    border: '1px solid var(--colorNeutralStroke2)',
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
  resultCaseMeta: {
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
    marginTop: '4px',
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
    borderRadius: '4px',
    background: tokens.colorNeutralBackground2,
    border: '1px solid var(--colorNeutralStroke2)',
    '@media (max-width: 680px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '8px',
    },
  },
  resultCardAccepted: {
    borderLeft: `4px solid ${tokens.colorPaletteGreenBorder1}`,
    background: 'linear-gradient(110deg, rgba(46, 177, 117, 0.2) 0%, rgba(0, 0, 0, 0) 68%)',
  },
});

export const ResultView: React.FC = () => {
  const styles = useStyles();
  const { selectedProblem } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResultDetail[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadResult = async () => {
      if (!selectedProblem) {
        setSubmission(null);
        setTestCaseResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const latestSubmission = await getLatestSubmissionMock(selectedProblem.id);
        if (!mounted) return;
        setSubmission(latestSubmission);

        if (!latestSubmission) {
          setTestCaseResults([]);
          return;
        }

        const response = await listSubmissionTestCaseResultsMock(latestSubmission.id);
        if (!mounted) return;
        setTestCaseResults(response.items);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadResult();
    return () => {
      mounted = false;
    };
  }, [selectedProblem]);

  const acceptedCount = testCaseResults.filter((item) => item.status === 'Accepted').length;

  return (
    <div className={styles.content}>
      <Title1>提交结果</Title1>
      <Text block className={styles.sectionText}>
        当前题目最新提交的评测状态、资源消耗与测试点明细
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
              <div
                className={styles.verdictPill}
                style={{
                  color: JUDGE_STATUS_CONFIG[submission.status].color,
                  background: JUDGE_STATUS_CONFIG[submission.status].tint,
                }}
              >
                <span className={styles.statusDot} />
                {JUDGE_STATUS_CONFIG[submission.status].label}
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
                      style={{
                        color: JUDGE_STATUS_CONFIG[item.status].color,
                        background: JUDGE_STATUS_CONFIG[item.status].tint,
                      }}
                    >
                      <span className={styles.statusDot} />
                      {JUDGE_STATUS_CONFIG[item.status].label}
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
