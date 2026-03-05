import * as React from 'react';
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
  hidden?: boolean;
}

const useStyles = makeStyles({
  container: {
    width: '56px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
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
  navItemWrapper: {
    position: 'relative',
    width: '48px',
    height: '44px',
    transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transformOrigin: 'center center',
  },
  navItemHidden: {
    opacity: 0,
    transform: 'scale(0.6) translateY(-8px)',
    pointerEvents: 'none',
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
  },
  navItemVisible: {
    opacity: 1,
    transform: 'scale(1) translateY(0)',
    pointerEvents: 'auto',
  },
  navItemEntering: {
    animationDuration: '0.45s',
    animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    animationFillMode: 'forwards',
    animationName: 'editorIconEnter',
  },
  '@keyframes editorIconEnter': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.5) translateY(-20px) rotate(-12deg)',
    },
    '60%': {
      opacity: 1,
      transform: 'scale(1.08) translateY(2px) rotate(2deg)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1) translateY(0) rotate(0deg)',
    },
  },
  navButton: {
    position: 'relative',
    width: '48px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '8px',
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
      left: '0',
      top: '10px',
      bottom: '10px',
      width: '3px',
      borderRadius: '0 2px 2px 0',
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

export const ActivityBar: React.FC = () => {
  const styles = useStyles();
  const { activeTab, setActiveTab, selectedProblem } = useAppStore();
  const prevHasProblemRef = React.useRef(false);
  const [isEntering, setIsEntering] = React.useState(false);

  // Build nav items dynamically based on selectedProblem
  const navItems: NavItem[] = [
    { id: 'explorer', label: '题库', icon: NavigationRegular },
    { id: 'editor', label: '编辑器', icon: CodeRegular, hidden: !selectedProblem },
    { id: 'testcase', label: '测试点', icon: BeakerRegular },
    { id: 'result', label: '结果', icon: TaskListLtrRegular },
    { id: 'settings', label: '设置', icon: SettingsRegular },
  ];

  // Watch for editor icon appearing (when selectedProblem becomes non-null)
  React.useEffect(() => {
    const nowHasProblem = !!selectedProblem;
    if (nowHasProblem && !prevHasProblemRef.current) {
      // Editor icon is appearing - trigger animation
      setIsEntering(true);
      const timer = setTimeout(() => setIsEntering(false), 450);
      return () => clearTimeout(timer);
    }
    prevHasProblemRef.current = nowHasProblem;
  }, [selectedProblem]);

  return (
    <nav className={styles.container} role="navigation" aria-label="活动栏">
      <div className={styles.navList}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isEditor = item.id === 'editor';
          const shouldAnimate = isEditor && isEntering;

          return (
            <div
              key={item.id}
              className={mergeClasses(
                styles.navItemWrapper,
                item.hidden ? styles.navItemHidden : styles.navItemVisible,
                shouldAnimate && styles.navItemEntering
              )}
            >
              <Tooltip
                content={item.label}
                relationship="label"
                positioning="after"
              >
                <button
                  type="button"
                  className={mergeClasses(
                    styles.navButton,
                    isActive && styles.activeNavButton
                  )}
                  onClick={() => setActiveTab(item.id)}
                  aria-label={item.label}
                  aria-pressed={isActive}
                  disabled={item.hidden}
                >
                  <Icon className={styles.icon} />
                </button>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
