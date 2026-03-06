import { makeStyles, Text, tokens } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { getProblemDetailMock } from '../../../api/mock';
import { ProblemPane } from '../EditorView/ProblemPane';

const useStyles = makeStyles({
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
});

interface ProblemDetail {
  description: string;
}

export const ProblemView: React.FC = () => {
  const styles = useStyles();
  const { selectedProblem, isDarkMode } = useAppStore();
  const [problemDetail, setProblemDetail] = useState<ProblemDetail | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProblemDetail = async () => {
      if (!selectedProblem) {
        setProblemDetail(null);
        return;
      }

      const detail = await getProblemDetailMock(selectedProblem.id);
      if (mounted) {
        setProblemDetail(detail);
      }
    };

    void loadProblemDetail();

    return () => {
      mounted = false;
    };
  }, [selectedProblem]);

  if (!selectedProblem || !problemDetail) {
    return (
      <div className={styles.placeholderBox}>
        <Text weight="semibold" style={{ fontSize: '18px', color: tokens.colorNeutralForeground2 }}>
          请从题库中选择一个题目
        </Text>
        <Text style={{ marginTop: '8px', color: tokens.colorNeutralForeground3 }}>
          选题后，左侧将显示题面，右侧显示编辑器与辅助视图
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <ProblemPane description={problemDetail.description} isDarkMode={isDarkMode} />
    </div>
  );
};
