import {
  Tooltip,
  makeStyles,
  tokens,
  shorthands,
  mergeClasses,
} from '@fluentui/react-components';
import {
  CodeRegular,
  BeakerRegular,
  TaskListLtrRegular,
  type FluentIcon,
} from '@fluentui/react-icons';
import { useAppStore, type SecondaryTabType } from '../../stores/useAppStore';

interface NavItem {
  id: SecondaryTabType;
  label: string;
  icon: FluentIcon;
}

const useStyles = makeStyles({
  container: {
    width: '56px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderLeft('1px', 'solid', tokens.colorNeutralStroke3),
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  navList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    paddingTop: '12px',
    width: '100%',
  },
  navButton: {
    position: 'relative',
    width: '48px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.18s ease',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    ...shorthands.border('none'),
    ...shorthands.padding(0),
    appearance: 'none',
    outlineStyle: 'none',
    boxSizing: 'border-box',
    ':focus-visible': {
      boxShadow: `0 0 0 1px ${tokens.colorBrandStroke2}, 0 0 0 3px ${tokens.colorTransparentStroke}`,
    },
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
    '::after': {
      content: '""',
      position: 'absolute',
      right: '0',
      top: '10px',
      bottom: '10px',
      width: '3px',
      borderRadius: '2px 0 0 2px',
      backgroundColor: tokens.colorBrandStroke1,
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },
  },
  activeNavButton: {
    color: tokens.colorBrandForeground1,
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
    '::after': {
      opacity: 1,
    },
  },
  icon: {
    fontSize: '22px',
  },
});

const navItems: NavItem[] = [
  { id: 'editor', label: '编辑器', icon: CodeRegular },
  { id: 'testcase', label: '测试点', icon: BeakerRegular },
  { id: 'result', label: '结果', icon: TaskListLtrRegular },
];

export const SecondaryActivityBar: React.FC = () => {
  const styles = useStyles();
  const { secondaryTab, setSecondaryTab } = useAppStore();

  return (
    <nav className={styles.container} role="navigation" aria-label="次级活动栏">
      <div className={styles.navList}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = secondaryTab === item.id;

          return (
            <Tooltip
              key={item.id}
              content={item.label}
              relationship="label"
              positioning="before"
            >
              <button
                type="button"
                className={mergeClasses(
                  styles.navButton,
                  isActive && styles.activeNavButton
                )}
                onClick={() => setSecondaryTab(item.id)}
                aria-label={item.label}
                aria-pressed={isActive}
              >
                <Icon className={styles.icon} />
              </button>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
};
