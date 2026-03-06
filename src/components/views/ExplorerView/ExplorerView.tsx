import { makeStyles, Title1, Text, tokens, shorthands } from '@fluentui/react-components';
import { useAppStore } from '../../../stores/useAppStore';
import { useAsyncData } from '../../../hooks';
import { listProblemsMock } from '../../../api/mock';
import { formatMemoryFromKb, formatDateTime } from '../../../utils';
import { CardList } from '../../shared/CardList';
import type { components as ProblemComponents } from '../../../api/problems.gen';

type ProblemSummary = ProblemComponents['schemas']['ProblemSummary'];

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
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1),
    },
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
  resultCaseMeta: {
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
    marginTop: '4px',
  },
});

export const ExplorerView: React.FC = () => {
  const styles = useStyles();
  const { openProblemInEditor } = useAppStore();
  const { loading, data: problems } = useAsyncData<ProblemSummary>(
    async () => {
      const response = await listProblemsMock({ page: 1, pageSize: 8 });
      return response.items;
    },
    []
  );

  return (
    <div className={styles.content}>
      <Title1>浏览题目</Title1>
      <Text block className={styles.sectionText}>
        从题库中选择并练习编程题目
      </Text>
      <div className={`${styles.listStack} ${styles.staggerContainer}`}>
        <CardList
          loading={loading}
          items={problems}
          emptyText="暂无题目"
          loadingText="正在加载题目..."
          renderItem={(problem) => (
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
          )}
        />
      </div>
    </div>
  );
};
