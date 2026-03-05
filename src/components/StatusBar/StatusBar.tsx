import {
  makeStyles,
  tokens,
  shorthands,
  Text,
  Tooltip,
  mergeClasses,
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
  PlayCircleRegular,
  ErrorCircleFilled,
} from '@fluentui/react-icons';
import { useAppStore, type SubmissionStatus, type ConnectionStatus } from '../../stores/useAppStore';

const useStyles = makeStyles({
  container: {
    height: '28px',
    width: '100%',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '12px',
    paddingRight: '12px',
    boxSizing: 'border-box',
    fontSize: '12px',
    ...shorthands.borderTop('1px', 'solid', 'rgba(255, 255, 255, 0.22)'),
    transition: 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s ease',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'default',
    transition: 'color 0.2s ease',
    ':hover': {
      opacity: 0.8,
    },
  },
  icon: {
    fontSize: '14px',
    transition: 'color 0.2s ease',
  },
  text: {
    color: 'inherit',
  },
  statusIdle: {
    color: tokens.colorNeutralForegroundOnBrand,
  },
  statusPending: {
    color: '#FFE7B0',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  statusSuccess: {
    color: '#C6F5DE',
    animation: 'successPop 0.3s ease-out',
  },
  statusError: {
    color: '#FFD4D4',
    animation: 'errorShake 0.4s ease-out',
  },
  connectionConnected: {
    color: '#C6F5DE',
  },
  connectionDisconnected: {
    color: '#FFD4D4',
  },
  connectionConnecting: {
    color: '#FFE7B0',
    animation: 'spin 1s linear infinite',
  },
  connectionLabel: {
    fontSize: '11px',
    letterSpacing: '0.1px',
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

const getCompileStatusInfo = (status: 'idle' | 'compiling' | 'success' | 'error') => {
  switch (status) {
    case 'idle':
      return { text: '就绪', className: 'statusIdle' as const };
    case 'compiling':
      return { text: '编译中...', className: 'statusPending' as const };
    case 'success':
      return { text: '编译完成', className: 'statusSuccess' as const };
    case 'error':
      return { text: '编译错误', className: 'statusError' as const };
  }
};

export const StatusBar: React.FC = () => {
  const styles = useStyles();
  const {
    currentLanguage,
    compileStatus,
    lastRunTime,
    submissionStatus,
    connectionStatus,
    userInfo,
  } = useAppStore();

  const submissionInfo = getSubmissionStatusInfo(submissionStatus);
  const connectionInfo = getConnectionStatusInfo(connectionStatus);
  const compileInfo = getCompileStatusInfo(compileStatus);

  const SubmissionIcon = submissionInfo.icon;
  const ConnectionIcon = connectionInfo.icon;
  const connectionStatusText = connectionStatus === 'connected'
    ? '已连接'
    : connectionStatus === 'connecting'
    ? '连接中'
    : '已断开';

  return (
    <footer className={styles.container} role="contentinfo" aria-label="状态栏">
      <div className={styles.section}>
        {/* Language */}
        <Tooltip content="当前语言" relationship="label">
          <div className={styles.item}>
            <CodeRegular className={styles.icon} />
            <Text className={styles.text}>{currentLanguage}</Text>
          </div>
        </Tooltip>

        {/* Compile Status */}
        <Tooltip content="编译状态" relationship="label">
          <div className={mergeClasses(styles.item, styles[compileInfo.className])}>
            <PlayCircleRegular className={styles.icon} />
            <Text className={styles.text}>{compileInfo.text}</Text>
          </div>
        </Tooltip>

        {/* Last Run Time */}
        {lastRunTime && (
          <Tooltip content="上次运行时间" relationship="label">
            <div className={styles.item}>
              <ClockRegular className={styles.icon} />
              <Text className={styles.text}>{lastRunTime}</Text>
            </div>
          </Tooltip>
        )}
      </div>

      <div className={styles.section}>
        {/* Submission Status */}
        <Tooltip content="提交状态" relationship="label">
          <div className={mergeClasses(styles.item, styles[submissionInfo.className])}>
            <SubmissionIcon className={styles.icon} />
            <Text weight="semibold" className={styles.text}>{submissionInfo.text}</Text>
          </div>
        </Tooltip>

        {/* Connection Status */}
        <Tooltip content={`服务器：${connectionStatusText}`} relationship="label">
          <div className={mergeClasses(styles.item, styles[connectionInfo.className])}>
            <ConnectionIcon className={styles.icon} />
            <Text className={mergeClasses(styles.text, styles.connectionLabel)}>{connectionStatusText}</Text>
          </div>
        </Tooltip>

        {/* User Info */}
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
