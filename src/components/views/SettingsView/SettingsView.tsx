import { makeStyles, Title1, Text, Switch, tokens } from '@fluentui/react-components';
import { useAppStore } from '../../../stores/useAppStore';

const useStyles = makeStyles({
  content: {
    maxWidth: '600px',
    margin: '0 auto',
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
  settingsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
});

export const SettingsView: React.FC = () => {
  const styles = useStyles();
  const { isDarkMode, setIsDarkMode } = useAppStore();

  return (
    <div className={styles.content}>
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
