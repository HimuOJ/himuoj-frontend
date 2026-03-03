这是一个「IDE 形态的在线评测平台（OJ）」，核心目标：
App Shell Layout
= Activity Bar + Workspace + Status Bar

1）Activity Bar（最左侧固定栏）

位置：左侧固定宽度（约 48~60px）
用途：一级功能导航
包含功能按钮：
- Problem（题目）
- Editor（代码编辑）
- TestCase（测试用例）
- Result（提交记录）
- Settings（语言/主题）

交互规则：
1. 点击图标切换 Workspace 主区域内容
2. 当前激活模块高亮显示

2）Workspace/Content（主工作区）
这是核心区域。
内容区（Content）承载什么？
Content 在不同功能下展示不同模块：当前只考虑最简实现，显示最简单的内容：一个H1标题即可。

3) Status Bar（底部状态栏）(主题色 + 浅色字体)
固定在底部。
展示：
当前语言
编译状态
上次运行时间
提交状态（Pending / Accepted / WA）
服务器连接状态
用户登录信息
这个区域非常关键。

它是“系统反馈区”。

## UI/UX 设计原则
0. 选用 @fluentui/react-components 作为 UI 库，确保组件一致性和现代感。
1. 主题色仅作为点缀，整体以浅色为主，保持界面清爽。
2. ICON: @fluentui/react-icons，保持视觉统一。

主题色遵循：
```
const himuoj: BrandVariants = { 
  10: "#060202",
  20: "#231211",
  30: "#3C1B1B",
  40: "#512122",
  50: "#67272A",
  60: "#7E2E32",
  70: "#95343A",
  80: "#AD3A42",
  90: "#C5404A",
  100: "#DE4653",
  110: "#EC5A62",
  120: "#F27275",
  130: "#F78988",
  140: "#FB9F9D",
  150: "#FEB4B1",
  160: "#FFCAC7"
};

 const lightTheme: Theme = {
   ...createLightTheme(himuoj), 
};

 const darkTheme: Theme = {
   ...createDarkTheme(himuoj), 
};


darkTheme.colorBrandForeground1 = himuoj[110];
darkTheme.colorBrandForeground2 = himuoj[120];
```

