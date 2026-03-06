import { tokens } from '@fluentui/react-components';
import type { components as SubmissionComponents } from '../api/submissions.gen';

type JudgeStatus = SubmissionComponents['schemas']['JudgeStatus'];

interface JudgeStatusConfig {
  label: string;
  color: string;
  tint: string;
}

export const JUDGE_STATUS_CONFIG: Record<JudgeStatus, JudgeStatusConfig> = {
  Accepted: {
    label: '通过',
    color: tokens.colorPaletteGreenForeground1,
    tint: 'rgba(28, 196, 130, 0.2)',
  },
  Pending: {
    label: '排队中',
    color: tokens.colorPaletteYellowForeground1,
    tint: 'rgba(240, 179, 60, 0.2)',
  },
  Running: {
    label: '评测中',
    color: tokens.colorPaletteYellowForeground1,
    tint: 'rgba(240, 179, 60, 0.2)',
  },
  WrongAnswer: {
    label: '答案错误',
    color: tokens.colorPaletteRedForeground1,
    tint: 'rgba(233, 93, 93, 0.2)',
  },
  TimeLimitExceeded: {
    label: '超出时间限制',
    color: tokens.colorPaletteRedForeground1,
    tint: 'rgba(233, 93, 93, 0.2)',
  },
  MemoryLimitExceeded: {
    label: '超出内存限制',
    color: tokens.colorPaletteRedForeground1,
    tint: 'rgba(233, 93, 93, 0.2)',
  },
  RuntimeError: {
    label: '运行时错误',
    color: tokens.colorPaletteRedForeground1,
    tint: 'rgba(233, 93, 93, 0.2)',
  },
  CompilationError: {
    label: '编译错误',
    color: tokens.colorPaletteRedForeground1,
    tint: 'rgba(233, 93, 93, 0.2)',
  },
  SystemError: {
    label: '系统错误',
    color: tokens.colorPaletteRedForeground1,
    tint: 'rgba(233, 93, 93, 0.2)',
  },
};
