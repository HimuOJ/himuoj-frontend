import { makeStyles, Title1, Text, tokens } from '@fluentui/react-components';
import { useAsyncData } from '../../../hooks';
import { listProblemTestCasesMock } from '../../../api/mock';
import { CardList } from '../../shared/CardList';
import { FieldCard } from '../../shared/FieldCard';
import type { components as ProblemComponents } from '../../../api/problems.gen';

type TestCaseDetail = ProblemComponents['schemas']['TestCaseDetail'];

const DEFAULT_PROBLEM_ID = 1;

const useStyles = makeStyles({
  content: {
    maxWidth: '860px',
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
    '& > *:nth-child(2)': { animationDelay: '0.06s' },
    '& > *:nth-child(3)': { animationDelay: '0.09s' },
    '& > *:nth-child(4)': { animationDelay: '0.12s' },
    '& > *:nth-child(5)': { animationDelay: '0.15s' },
    '& > *:nth-child(6)': { animationDelay: '0.18s' },
    '& > *:nth-child(7)': { animationDelay: '0.21s' },
    '& > *:nth-child(8)': { animationDelay: '0.24s' },
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
  titleText: {
    fontSize: '17px',
    lineHeight: '1.35',
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
    borderRadius: '4px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    background: tokens.colorNeutralBackground2,
    border: '1px solid var(--colorNeutralStroke2)',
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
});

export const TestcaseView: React.FC = () => {
  const styles = useStyles();
  const { loading, data: testCases } = useAsyncData<TestCaseDetail>(
    async () => {
      const response = await listProblemTestCasesMock(DEFAULT_PROBLEM_ID, { includeHidden: true });
      return response.items;
    },
    []
  );

  return (
    <div className={styles.content}>
      <Title1>测试用例</Title1>
      <Text block className={styles.sectionText}>
        显示该题目的测试用例元数据与对象引用
      </Text>
      <div className={`${styles.listStack} ${styles.staggerContainer}`}>
        <CardList
          loading={loading}
          items={testCases}
          emptyText="当前题目暂无测试用例"
          loadingText="正在加载测试用例..."
          renderItem={(testCase) => (
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
                <FieldCard label="inputUploadId" value={testCase.inputUploadId} />
                <FieldCard label="expectedOutputUploadId" value={testCase.expectedOutputUploadId} />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
