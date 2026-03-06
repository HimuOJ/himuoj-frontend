import { makeStyles } from '@fluentui/react-components';
import { useAppStore } from '../../../stores/useAppStore';
import { CodeEditorPane } from './CodeEditorPane';

const useStyles = makeStyles({
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

export const EditorView: React.FC = () => {
  const styles = useStyles();
  const { currentLanguage, isDarkMode } = useAppStore();

  return (
    <div className={styles.content}>
      <CodeEditorPane language={currentLanguage} isDarkMode={isDarkMode} />
    </div>
  );
};
