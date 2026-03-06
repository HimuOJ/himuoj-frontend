import { Text, makeStyles, tokens, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  field: {
    padding: '10px 12px',
    borderRadius: '4px',
    background: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  label: {
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
  },
  value: {
    marginTop: '4px',
    fontFamily: '"JetBrains Mono", "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace',
    fontSize: '12px',
  },
});

interface FieldCardProps {
  label: string;
  value: React.ReactNode;
}

export const FieldCard: React.FC<FieldCardProps> = ({ label, value }) => {
  const styles = useStyles();
  return (
    <div className={styles.field}>
      <Text className={styles.label}>{label}</Text>
      <div className={styles.value}>{value}</div>
    </div>
  );
};
