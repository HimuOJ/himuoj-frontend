import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardHeader, Button } from '@fluentui/react-components';
import { CopyRegular } from '@fluentui/react-icons';
import 'katex/dist/katex.min.css';

const useStyles = makeStyles({
  pane: {
    padding: '24px',
    overflowY: 'auto',
  },
  markdown: {
    '& h1': { fontSize: '24px', marginTop: '16px', marginBottom: '12px' },
    '& h2': { fontSize: '20px', marginTop: '16px', marginBottom: '10px' },
    '& p': { marginBottom: '12px', lineHeight: '1.6' },
    '& code': {
      backgroundColor: tokens.colorNeutralBackground3,
      padding: '2px 2px',
      borderRadius: '4px',
      fontFamily: 'monospace',
    },
    '& pre': {
      padding: '5px',
      overflow: 'auto',
      position: 'relative',
    },
  },
  codeBlockCard: {
    marginTop: '12px',
    marginBottom: '12px',
    boxShadow: 'none',
    ...shorthands.border('none'),
    '& .fui-CardHeader__header': {
      width: '100%',
    },
  },
  codeBlockCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  codeBlockLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  copyButton: {
    minWidth: 'auto',
    padding: '4px 8px',
    fontSize: '12px',
    height: '28px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

interface ProblemPaneProps {
  description: string;
  isDarkMode: boolean;
}

export const ProblemPane: React.FC<ProblemPaneProps> = ({ description, isDarkMode }) => {
  const styles = useStyles();

  return (
    <div className={styles.pane}>
      <div className={styles.markdown}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ node, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const lang = match ? match[1] : 'text';
              const codeContent = String(children).replace(/\n$/, '');
              const isInline = node?.position?.start?.line === node?.position?.end?.line;

              if (isInline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              if (lang === 'input' || lang === 'output') {
                const label = lang === 'input' ? '输入' : '输出';
                return (
                  <Card className={styles.codeBlockCard} size="small">
                    <CardHeader
                      header={
                        <div className={styles.codeBlockCardHeader}>
                          <span className={styles.codeBlockLabel}>{label}</span>
                          <Button
                            appearance="subtle"
                            icon={<CopyRegular fontSize={14} />}
                            className={styles.copyButton}
                            onClick={() => navigator.clipboard.writeText(codeContent)}
                          >
                            复制
                          </Button>
                        </div>
                      }
                    />
                    <SyntaxHighlighter
                      style={isDarkMode ? oneDark : oneLight}
                      language="text"
                      PreTag="div"
                      customStyle={{ margin: 0, borderRadius: '4px' }}
                      {...props}
                    >
                      {codeContent}
                    </SyntaxHighlighter>
                  </Card>
                );
              }

              return (
                <SyntaxHighlighter
                  style={isDarkMode ? oneDark : oneLight}
                  language={lang}
                  PreTag="pre"
                  {...props}
                >
                  {codeContent}
                </SyntaxHighlighter>
              );
            },
          }}
        >
          {description}
        </ReactMarkdown>
      </div>
    </div>
  );
};
