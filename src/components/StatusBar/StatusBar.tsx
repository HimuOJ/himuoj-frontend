import {
  makeStyles,
  tokens,
  shorthands,
  Text,
  Tooltip,
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
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke3),
    transition: 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s ease',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'default',
    transition: 'color 0.3s ease, transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-1px)',
    },
  },
  icon: {
    fontSize: '14px',
    transition: 'transform 0.3s ease, color 0.3s ease',
  },
  statusIdle: {
    color: tokens.colorNeutralForegroundOnBrand,
    transition: 'color 0.3s ease',
  },
  statusPending: {
    color: tokens.colorPaletteYellowForeground1,
    transition: 'color 0.3s ease',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  statusSuccess: {
    color: tokens.colorPaletteGreenForeground1,
    transition: 'color 0.3s ease',
    animation: 'successPop 0.3s ease-out',
  },
  statusError: {
    color: tokens.colorPaletteRedForeground1,
    transition: 'color 0.3s ease',
    animation: 'errorShake 0.4s ease-out',
  },
  connectionConnected: {
    color: tokens.colorPaletteGreenForeground3,
    transition: 'color 0.3s ease',
  },
  connectionDisconnected: {
    color: tokens.colorPaletteRedForeground3,
    transition: 'color 0.3s ease',
  },
  connectionConnecting: {
    color: tokens.colorPaletteYellowForeground3,
    transition: 'color 0.3s ease',
    animation: 'spin 1s linear infinite',
  },
});

const getSubmissionStatusInfo = (status: SubmissionStatus) => {
  switch (status) {
    case 'idle':
      return { text: 'Ready', icon: CircleRegular, className: 'statusIdle' as const };
    case 'pending':
      return { text: 'Pending', icon: ClockRegular, className: 'statusPending' as const };
    case 'accepted':
      return { text: 'Accepted', icon: CheckmarkCircleFilled, className: 'statusSuccess' as const };
    case 'wrong-answer':
      return { text: 'Wrong Answer', icon: DismissCircleFilled, className: 'statusError' as const };
    case 'error':
      return { text: 'Error', icon: ErrorCircleFilled, className: 'statusError' as const };
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
    currentLanguage,
    compileStatus,
    lastRunTime,
    submissionStatus,
    connectionStatus,
    userInfo,
  } = useAppStore();

  const submissionInfo = getSubmissionStatusInfo(submissionStatus);
  const connectionInfo = getConnectionStatusInfo(connectionStatus);

  const SubmissionIcon = submissionInfo.icon;
  const ConnectionIcon = connectionInfo.icon;

  const compileText = compileStatus === 'idle'
    ? 'Ready'
    : compileStatus === 'compiling'
    ? 'Compiling...'
    : compileStatus === 'success'
    ? 'Compiled'
    : 'Compile Error';

  return (
    <footer className={styles.container} role="contentinfo" aria-label="Status Bar">
      <div className={styles.section}>
        {/* Language */}
        <Tooltip content="Current Language" relationship="label">
          <div className={styles.item}>
            <CodeRegular className={styles.icon} />
            <Text>{currentLanguage}</Text>
          </div>
        </Tooltip>

        {/* Compile Status */}
        <Tooltip content="Compile Status" relationship="label">
          <div className={styles.item}>
            <PlayCircleRegular className={styles.icon} />
            <Text>{compileText}</Text>
          </div>
        </Tooltip>

        {/* Last Run Time */}
        {lastRunTime && (
          <Tooltip content="Last Run Time" relationship="label">
            <div className={styles.item}>
              <ClockRegular className={styles.icon} />
              <Text>{lastRunTime}</Text>
            </div>
          </Tooltip>
        )}
      </div>

      <div className={styles.section}>
        {/* Submission Status */}
        <Tooltip content="Submission Status" relationship="label">
          <div className={`${styles.item} ${styles[submissionInfo.className]}`}>
            <SubmissionIcon className={styles.icon} />
            <Text weight="semibold">{submissionInfo.text}</Text>
          </div>
        </Tooltip>

        {/* Connection Status */}
        <Tooltip content={`Server: ${connectionStatus}`} relationship="label">
          <div className={`${styles.item} ${styles[connectionInfo.className]}`}>
            <ConnectionIcon className={styles.icon} />
          </div>
        </Tooltip>

        {/* User Info */}
        <Tooltip content={userInfo?.name || 'Guest'} relationship="label">
          <div className={styles.item}>
            <PersonRegular className={styles.icon} />
            <Text>{userInfo?.name || 'Guest'}</Text>
          </div>
        </Tooltip>
      </div>
    </footer>
  );
};
