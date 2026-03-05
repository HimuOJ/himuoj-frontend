import { makeStyles, Text, Tooltip } from '@fluentui/react-components';
import { ReactNode } from 'react';

const useStyles = makeStyles({
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingLeft: '6px',
    paddingRight: '6px',
    height: '20px',
    borderRadius: '4px',
    transition: 'opacity 0.3s ease, background-color 0.2s ease',
    cursor: 'default',
  },
  clickable: {
    cursor: 'pointer',
    ':hover': {
      opacity: 0.7,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
    ':hover': {
      opacity: 0.5,
      backgroundColor: 'transparent',
    },
  },
  icon: {
    fontSize: '14px',
  },
  text: {
    color: 'inherit',
    fontSize: '12px',
  },
});

interface StatusBarItemProps {
  icon: ReactNode;
  text: string;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const StatusBarItem: React.FC<StatusBarItemProps> = ({
  icon,
  text,
  tooltip,
  onClick,
  className,
  disabled = false,
}) => {
  const styles = useStyles();
  const isClickable = !!onClick && !disabled;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const content = (
    <div
      className={`${styles.item} ${isClickable ? styles.clickable : ''} ${disabled ? styles.disabled : ''} ${className || ''}`}
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <span className={styles.icon}>{icon}</span>
      <Text className={styles.text}>{text}</Text>
    </div>
  );

  return tooltip ? (
    <Tooltip content={tooltip} relationship="label">
      {content}
    </Tooltip>
  ) : content;
};
