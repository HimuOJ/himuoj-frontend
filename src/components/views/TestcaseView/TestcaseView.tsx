import { makeStyles, Title1, Text, tokens } from '@fluentui/react-components';
import { useAsyncData } from '../../../hooks';
import { listProblemTestCasesMock } from '../../../api/mock';
import { CardList } from '../../shared/CardList';
import type { components as ProblemComponents } from '../../../api/problems.gen';
import { useAppStore } from '../../../stores/useAppStore';

type TestCaseDetail = ProblemComponents['schemas']['TestCaseDetail'];

const useStyles = makeStyles({
  content: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '10px',
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
});

export const TestcaseView: React.FC = () => {
  const styles = useStyles();
  const { selectedProblem } = useAppStore();
  const { loading, data: testCases } = useAsyncData<TestCaseDetail>(
    async () => {
      if (!selectedProblem) {
        return [];
      }
      const response = await listProblemTestCasesMock(selectedProblem.id, { includeHidden: false });
      return response.items.filter(tc => !tc.isHidden);
    },
    [selectedProblem?.id]
  );

  return (
    <div className={styles.content}>
      <Title1>测试用例</Title1>
      <Text block className={styles.sectionText}>
        显示当前题目的公开测试用例
      </Text>
      <div className={`${styles.listStack} ${styles.staggerContainer}`}>
        <CardList
          loading={loading}
          items={testCases}
          emptyText="当前题目暂无公开测试用例"
          loadingText="正在加载测试用例..."
          renderItem={(testCase, index) => (
            <div key={testCase.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <Text weight="semibold" className={styles.titleText} block>
                  测试用例 {index + 1}
                </Text>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaPill}>分值权重 {testCase.scoreWeight}</span>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
