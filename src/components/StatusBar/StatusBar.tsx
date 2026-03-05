import {
  makeStyles,
  tokens,
  shorthands,
  Text,
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
  PlayRegular,
  ErrorCircleFilled,
} from '@fluentui/react-icons';
import { useAppStore, type SubmissionStatus, type ConnectionStatus } from '../../stores/useAppStore';
import { StatusBarItem } from './StatusBarItem';

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
  connectionConnectedIdle: {
    color: '#2D7D46',
  },
  connectionDisconnectedIdle: {
    color: '#C4314B',
  },
  connectionConnectingIdle: {
    color: '#CA6C1D',
  },
  connectionConnectedActive: {
    color: '#C6F5DE',
  },
  connectionDisconnectedActive: {
    color: '#FFD4D4',
  },
  connectionConnectingActive: {
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

const getConnectionStatusInfo = (status: ConnectionStatus, isActive: boolean) => {
  const suffix = isActive ? 'Active' : 'Idle';
  switch (status) {
    case 'connected':
      return { icon: CloudCheckmarkRegular, className: `connectionConnected${suffix}` as const };
    case 'disconnected':
      return { icon: CloudDismissRegular, className: `connectionDisconnected${suffix}` as const };
    case 'connecting':
      return { icon: CloudSyncRegular, className: `connectionConnecting${suffix}` as const };
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
  const connectionInfo = getConnectionStatusInfo(connectionStatus, isActive);
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
        <Text>{submissionInfo.text}</Text>
      </div>

      <div className={styles.rightSection}>
        {isActive && (
          <>
            <StatusBarItem
              icon={<CodeRegular />}
              text={currentLanguage}
              tooltip="当前语言"
            />

            <StatusBarItem
              icon={<PlayRegular />}
              text="运行"
              tooltip="运行代码"
              onClick={() => console.log('Run code')}
            />
          </>
        )}

        <StatusBarItem
          icon={<ConnectionIcon />}
          text={connectionStatusText}
          tooltip={`服务器：${connectionStatusText}`}
          className={styles[connectionInfo.className]}
        />

        <StatusBarItem
          icon={<PersonRegular />}
          text={userInfo?.name || '游客'}
          tooltip={userInfo?.name || '游客'}
        />
      </div>
    </footer>
  );
};
