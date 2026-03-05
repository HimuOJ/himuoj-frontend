import {
  makeStyles,
  tokens,
  shorthands,
  Text,
  Tooltip,
  mergeClasses,
  Button,
} from '@fluentui/react-components';
import {
  CircleRegular,
  CheckmarkCircleFilled,
  DismissCircleFilled,
  ClockRegular,
  CloudCheckmarkRegular,
  CloudDismissRegular,
  CloudSyncRegular,
  PersonRegular,
  CodeRegular,
  PlayRegular,
  ErrorCircleFilled,
} from '@fluentui/react-icons';
import { useAppStore, type SubmissionStatus, type ConnectionStatus } from '../../stores/useAppStore';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    zIndex: 2,
    height: '28px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '12px',
    paddingRight: '12px',
    boxSizing: 'border-box',
    fontSize: '12px',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    transition: 'background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s ease',
  },
  idle: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  active: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.borderTop('1px', 'solid', 'rgba(255, 255, 255, 0.22)'),
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'default',
    transition: 'opacity 0.3s ease',
    ':hover': {
      opacity: 0.8,
    },
  },
  icon: {
    fontSize: '14px',
  },
  text: {
    color: 'inherit',
  },
  runButton: {
    minWidth: 'auto',
    height: '20px',
    paddingLeft: '8px',
    paddingRight: '8px',
    fontSize: '11px',
  },
  connectionConnected: {
    color: '#C6F5DE',
  },
  connectionDisconnected: {
    color: '#FFD4D4',
  },
  connectionConnecting: {
    color: '#FFE7B0',
  },
});

const getSubmissionStatusInfo = (status: SubmissionStatus) => {
  switch (status) {
    case 'idle':
      return { text: '就绪', icon: CircleRegular, className: 'statusIdle' as const };
    case 'pending':
      return { text: '评测中', icon: ClockRegular, className: 'statusPending' as const };
    case 'accepted':
      return { text: '通过', icon: CheckmarkCircleFilled, className: 'statusSuccess' as const };
    case 'wrong-answer':
      return { text: '答案错误', icon: DismissCircleFilled, className: 'statusError' as const };
    case 'error':
      return { text: '系统错误', icon: ErrorCircleFilled, className: 'statusError' as const };
  }
};

const getConnectionStatusInfo = (status: ConnectionStatus) => {
  switch (status) {
    case 'connected':
      return { icon: CloudCheckmarkRegular, className: 'connectionConnected' as const };
    case 'disconnected':
      return { icon: CloudDismissRegular, className: 'connectionDisconnected' as const };
    case 'connecting':
      return { icon: CloudSyncRegular, className: 'connectionConnecting' as const };
  }
};

export const StatusBar: React.FC = () => {
  const styles = useStyles();
  const {
    selectedProblem,
    currentLanguage,
    connectionStatus,
    userInfo,
    submissionStatus,
  } = useAppStore();

  const isActive = selectedProblem !== null;
  const connectionInfo = getConnectionStatusInfo(connectionStatus);
  const ConnectionIcon = connectionInfo.icon;
  const connectionStatusText = connectionStatus === 'connected'
    ? '已连接'
    : connectionStatus === 'connecting'
    ? '连接中'
    : '已断开';

  const submissionInfo = getSubmissionStatusInfo(submissionStatus);

  return (
    <footer
      className={mergeClasses(styles.container, isActive ? styles.active : styles.idle)}
      role="contentinfo"
      aria-label="状态栏"
    >
      <div className={styles.leftSection}>
        <Text className={styles.text}>{submissionInfo.text}</Text>
      </div>

      <div className={styles.rightSection}>
        {isActive && (
          <>
            <Tooltip content="当前语言" relationship="label">
              <div className={styles.item}>
                <CodeRegular className={styles.icon} />
                <Text className={styles.text}>{currentLanguage}</Text>
              </div>
            </Tooltip>

            <Tooltip content="运行代码" relationship="label">
              <Button
                appearance="transparent"
                icon={<PlayRegular />}
                size="small"
                className={styles.runButton}
              >
                运行
              </Button>
            </Tooltip>
          </>
        )}

        <Tooltip content={`服务器：${connectionStatusText}`} relationship="label">
          <div className={mergeClasses(styles.item, styles[connectionInfo.className])}>
            <ConnectionIcon className={styles.icon} />
            <Text className={styles.text}>{connectionStatusText}</Text>
          </div>
        </Tooltip>

        <Tooltip content={userInfo?.name || '游客'} relationship="label">
          <div className={styles.item}>
            <PersonRegular className={styles.icon} />
            <Text className={styles.text}>{userInfo?.name || '游客'}</Text>
          </div>
        </Tooltip>
      </div>
    </footer>
  );
};
