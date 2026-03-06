import { Text } from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    background: 'var(--colorNeutralBackground2)',
    border: '1px solid var(--colorNeutralStroke2)',
    padding: '18px',
    borderRadius: '4px',
  },
});

interface CardListProps<T> {
  loading: boolean;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyText?: string;
  loadingText?: string;
}

export function CardList<T>({ loading, items, renderItem, emptyText = '暂无数据', loadingText = '正在加载...' }: CardListProps<T>) {
  const styles = useStyles();

  if (loading) {
    return (
      <div className={styles.card}>
        <Text>{loadingText}</Text>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.card}>
        <Text>{emptyText}</Text>
      </div>
    );
  }

  return <>{items.map(renderItem)}</>;
}
