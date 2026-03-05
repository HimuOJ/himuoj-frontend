import {
  Tooltip,
  makeStyles,
  tokens,
  shorthands,
  mergeClasses,
} from '@fluentui/react-components';
import {
  NavigationRegular,
  CodeRegular,
  BeakerRegular,
  TaskListLtrRegular,
  SettingsRegular,
  type FluentIcon,
} from '@fluentui/react-icons';
import { useAppStore, type TabType } from '../../stores/useAppStore';

interface NavItem {
  id: TabType;
  label: string;
  icon: FluentIcon;
}

const navItems: NavItem[] = [
  { id: 'explorer', label: 'Explorer', icon: NavigationRegular },
  { id: 'editor', label: 'Editor', icon: CodeRegular },
  { id: 'testcase', label: 'TestCase', icon: BeakerRegular },
  { id: 'result', label: 'Result', icon: TaskListLtrRegular },
  { id: 'settings', label: 'Settings', icon: SettingsRegular },
];

const useStyles = makeStyles({
  container: {
    width: '56px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRight('1px', 'solid', tokens.colorNeutralStroke3),
    boxSizing: 'border-box',
    flexShrink: 0,
    transition: 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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
    width: '48px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      color: tokens.colorNeutralForeground1,
    },
    ':active': {
      opacity: 0.8,
    },
  },
  activeNavButton: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandForeground1,
    borderLeftColor: tokens.colorBrandStroke1,
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1,
      color: tokens.colorBrandForeground1,
    },
  },
  icon: {
    fontSize: '22px',
  },
});

export const ActivityBar: React.FC = () => {
  const styles = useStyles();
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav className={styles.container} role="navigation" aria-label="Activity Bar">
      <div className={styles.navList}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Tooltip
              key={item.id}
              content={item.label}
              relationship="label"
              positioning="after"
            >
              <div
                className={mergeClasses(
                  styles.navButton,
                  isActive && styles.activeNavButton
                )}
                onClick={() => setActiveTab(item.id)}
                role="button"
                aria-label={item.label}
                aria-pressed={isActive}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(item.id);
                  }
                }}
              >
                <Icon className={styles.icon} />
              </div>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
};
