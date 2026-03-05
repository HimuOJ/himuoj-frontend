import { FluentProvider, makeStyles, tokens } from '@fluentui/react-components';
import { ActivityBar } from './components/ActivityBar';
import { StatusBar } from './components/StatusBar';
import { Workspace } from './components/Workspace';
import { useAppStore } from './stores/useAppStore';
import { himuojLightTheme, himuojDarkTheme } from './themes/himuoj';
import { useEffect, useRef } from 'react';

const useStyles = makeStyles({
  app: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: tokens.fontFamilyBase,
    transition: 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  mainContainer: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  themeTransitionOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 9999,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  themeTransitionActive: {
    opacity: 1,
  },
});

function App() {
  const styles = useStyles();
  const { isDarkMode } = useAppStore();
  const appRef = useRef<HTMLDivElement>(null);
  const prevThemeRef = useRef(isDarkMode);

  // Add theme transition class to enable smooth color transitions
  useEffect(() => {
    if (appRef.current) {
      appRef.current.classList.add('theme-transition');
    }
  }, []);

  // Handle theme change with visual feedback
  useEffect(() => {
    if (prevThemeRef.current !== isDarkMode && appRef.current) {
      // Remove transition class briefly to prevent animation on initial load
      appRef.current.classList.remove('theme-transition');

      // Force reflow
      void appRef.current.offsetHeight;

      // Re-add transition class
      appRef.current.classList.add('theme-transition');

      prevThemeRef.current = isDarkMode;
    }
  }, [isDarkMode]);

  return (
    <FluentProvider theme={isDarkMode ? himuojDarkTheme : himuojLightTheme}>
      <div ref={appRef} className={styles.app}>
        <div className={styles.mainContainer}>
          <ActivityBar />
          <Workspace />
        </div>
        <StatusBar />
      </div>
    </FluentProvider>
  );
}

export default App;
