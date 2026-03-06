import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  index: {
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
    ...shorthands.border('1px', 'solid', 'var(--workspace-index-pill-border)'),
  },
  meta: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    background: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  verdict: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '999px',
    background: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    fontWeight: 700,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
});

interface PillProps {
  variant: 'index' | 'meta' | 'verdict';
  children: React.ReactNode;
  showDot?: boolean;
}

export const Pill: React.FC<PillProps> = ({ variant, children, showDot = false }) => {
  const styles = useStyles();
  return (
    <span className={styles[variant]}>
      {showDot && <span className={styles.statusDot} />}
      {children}
    </span>
  );
};
