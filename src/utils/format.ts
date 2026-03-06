export const formatMemoryFromKb = (valueKb: number) => {
  if (valueKb >= 1024) {
    const valueMb = valueKb / 1024;
    return `${Number.isInteger(valueMb) ? valueMb : valueMb.toFixed(1)}MB`;
  }
  return `${valueKb}KB`;
};

export const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
