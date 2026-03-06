import { makeStyles, tokens, shorthands, Tab, TabList, Button, MessageBar, MessageBarBody, Text } from '@fluentui/react-components';
import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';

const useStyles = makeStyles({
  pane: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  tabs: {
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  container: {
    flex: 1,
    minHeight: 0,
  },
});

interface CodeEditorPaneProps {
  language: string;
  isDarkMode: boolean;
}

export const CodeEditorPane: React.FC<CodeEditorPaneProps> = ({ language, isDarkMode }) => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState<'code' | 'file'>('code');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`);

  const getLanguageId = () => {
    const langMap: Record<string, string> = {
      'C++': 'cpp',
      'Python': 'python',
      'Java': 'java',
      'JavaScript': 'javascript',
    };
    return langMap[language] || 'cpp';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  return (
    <div className={styles.pane}>
      <div className={styles.tabs}>
        <TabList selectedValue={activeTab} onTabSelect={(_, data) => setActiveTab(data.value as 'code' | 'file')}>
          <Tab value="code">代码</Tab>
          <Tab value="file">文件</Tab>
        </TabList>
      </div>
      <div className={styles.container}>
        {activeTab === 'code' ? (
          <Editor
            language={getLanguageId()}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme={isDarkMode ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        ) : (
          <div style={{ padding: '24px' }}>
            <MessageBar intent="warning" style={{ marginBottom: '16px' }}>
              <MessageBarBody>
                请勿上传包含恶意代码、病毒或其他危险内容的文件。仅上传符合题目要求的源代码文件。
              </MessageBarBody>
            </MessageBar>
            <Text block style={{ marginBottom: '12px', fontWeight: 600 }}>上传源代码文件</Text>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".cpp,.c,.py,.java,.js"
              style={{ display: 'none' }}
            />
            <Button appearance="primary" onClick={() => fileInputRef.current?.click()}>
              选择文件
            </Button>
            {uploadedFile && (
              <Text block style={{ marginTop: '12px', color: tokens.colorNeutralForeground2 }}>
                已选择: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
              </Text>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
