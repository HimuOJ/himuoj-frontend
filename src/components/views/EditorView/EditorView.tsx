import { makeStyles, Text, tokens } from '@fluentui/react-components';
import { useState, useEffect } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { getProblemDetailMock } from '../../../api/mock';
import { SplitPane } from '../../SplitPane';
import { ProblemPane } from './ProblemPane';
import { CodeEditorPane } from './CodeEditorPane';

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

export const EditorView: React.FC = () => {
  const styles = useStyles();
  const { selectedProblem, currentLanguage, isDarkMode } = useAppStore();
  const [problemDetail, setProblemDetail] = useState<any>(null);

  useEffect(() => {
    if (!selectedProblem) return;
    getProblemDetailMock(selectedProblem.id).then(setProblemDetail);
  }, [selectedProblem]);

  return (
    <div className={styles.content}>
      {selectedProblem && problemDetail ? (
        <SplitPane
          left={<ProblemPane description={problemDetail.description} isDarkMode={isDarkMode} />}
          right={<CodeEditorPane language={currentLanguage} isDarkMode={isDarkMode} />}
        />
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
