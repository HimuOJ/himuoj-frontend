import type { components as ProblemComponents } from './problems.gen';
import type { components as SubmissionComponents } from './submissions.gen';

type ProblemSummary = ProblemComponents['schemas']['ProblemSummary'];
type PagedProblemSummaryResponse = ProblemComponents['schemas']['PagedProblemSummaryResponse'];
type TestCaseDetail = ProblemComponents['schemas']['TestCaseDetail'];
type TestCaseListResponse = ProblemComponents['schemas']['TestCaseListResponse'];

type SubmissionDetail = SubmissionComponents['schemas']['SubmissionDetail'];
type TestCaseResultDetail = SubmissionComponents['schemas']['TestCaseResultDetail'];
type TestCaseResultListResponse = SubmissionComponents['schemas']['TestCaseResultListResponse'];
type PagedSubmissionSummaryResponse = SubmissionComponents['schemas']['PagedSubmissionSummaryResponse'];

const NETWORK_DELAY_MS = 220;

const problems: ProblemSummary[] = [
  {
    id: 1,
    title: 'A + B 问题',
    timeLimitMs: 1000,
    memoryLimitKb: 65536,
    authorId: 1001,
    createdAt: '2026-01-08T10:20:00.000Z',
  },
  {
    id: 2,
    title: '两数之和',
    timeLimitMs: 1200,
    memoryLimitKb: 65536,
    authorId: 1001,
    createdAt: '2026-01-11T08:45:00.000Z',
  },
  {
    id: 3,
    title: '最长子串',
    timeLimitMs: 2000,
    memoryLimitKb: 131072,
    authorId: 1002,
    createdAt: '2026-01-14T13:05:00.000Z',
  },
  {
    id: 4,
    title: '两个数组的中位数',
    timeLimitMs: 2500,
    memoryLimitKb: 131072,
    authorId: 1003,
    createdAt: '2026-01-18T07:30:00.000Z',
  },
  {
    id: 5,
    title: '最长回文子串',
    timeLimitMs: 1800,
    memoryLimitKb: 131072,
    authorId: 1002,
    createdAt: '2026-01-20T16:40:00.000Z',
  },
];

const testCasesByProblemId: Record<number, TestCaseDetail[]> = {
  1: [
    {
      id: 101,
      problemId: 1,
      inputUploadId: 'obj-input-p1-1',
      expectedOutputUploadId: 'obj-output-p1-1',
      scoreWeight: 50,
      isHidden: false,
    },
    {
      id: 102,
      problemId: 1,
      inputUploadId: 'obj-input-p1-2',
      expectedOutputUploadId: 'obj-output-p1-2',
      scoreWeight: 50,
      isHidden: true,
    },
  ],
  2: [
    {
      id: 201,
      problemId: 2,
      inputUploadId: 'obj-input-p2-1',
      expectedOutputUploadId: 'obj-output-p2-1',
      scoreWeight: 100,
      isHidden: false,
    },
  ],
};

const submissions: SubmissionDetail[] = [
  {
    id: 9001,
    userId: 42,
    problemId: 1,
    language: 'cpp17',
    status: 'Accepted',
    maxTimeConsumedMs: 12,
    maxMemoryConsumedKb: 2457,
    submittedAt: '2026-03-01T09:20:12.000Z',
    codeUploadId: 'obj-code-9001',
  },
  {
    id: 9002,
    userId: 42,
    problemId: 2,
    language: 'cpp17',
    status: 'WrongAnswer',
    maxTimeConsumedMs: 4,
    maxMemoryConsumedKb: 1792,
    submittedAt: '2026-03-03T11:45:05.000Z',
    codeUploadId: 'obj-code-9002',
  },
];

const submissionResultsBySubmissionId: Record<number, TestCaseResultDetail[]> = {
  9001: [
    {
      id: 80001,
      submissionId: 9001,
      testCaseId: 101,
      status: 'Accepted',
      timeConsumedMs: 8,
      memoryConsumedKb: 2200,
      actualOutputUploadId: 'obj-actual-9001-101',
      errorMessage: null,
    },
    {
      id: 80002,
      submissionId: 9001,
      testCaseId: 102,
      status: 'Accepted',
      timeConsumedMs: 12,
      memoryConsumedKb: 2457,
      actualOutputUploadId: 'obj-actual-9001-102',
      errorMessage: null,
    },
  ],
  9002: [
    {
      id: 80003,
      submissionId: 9002,
      testCaseId: 201,
      status: 'WrongAnswer',
      timeConsumedMs: 4,
      memoryConsumedKb: 1792,
      actualOutputUploadId: 'obj-actual-9002-201',
      errorMessage: null,
    },
  ],
};

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

interface ProblemQuery {
  page?: number;
  pageSize?: number;
  authorId?: number;
}

export async function listProblemsMock(query: ProblemQuery = {}): Promise<PagedProblemSummaryResponse> {
  await sleep(NETWORK_DELAY_MS);

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const filteredItems = typeof query.authorId === 'number'
    ? problems.filter((problem) => problem.authorId === query.authorId)
    : problems;
  const start = (page - 1) * pageSize;
  const items = filteredItems.slice(start, start + pageSize);
  const totalItems = filteredItems.length;

  return {
    items,
    meta: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

interface ListProblemTestCasesOptions {
  includeHidden?: boolean;
}

export async function listProblemTestCasesMock(
  problemId: number,
  options: ListProblemTestCasesOptions = {}
): Promise<TestCaseListResponse> {
  await sleep(NETWORK_DELAY_MS);

  const items = testCasesByProblemId[problemId] ?? [];
  const includeHidden = options.includeHidden ?? false;

  return {
    items: includeHidden ? items : items.filter((testCase) => !testCase.isHidden),
  };
}

interface SubmissionQuery {
  page?: number;
  pageSize?: number;
  userId?: number;
  problemId?: number;
  language?: string;
  status?: SubmissionComponents['schemas']['JudgeStatus'];
}

export async function listSubmissionsMock(query: SubmissionQuery = {}): Promise<PagedSubmissionSummaryResponse> {
  await sleep(NETWORK_DELAY_MS);

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;

  const filteredItems = submissions
    .filter((submission) => query.userId === undefined || submission.userId === query.userId)
    .filter((submission) => query.problemId === undefined || submission.problemId === query.problemId)
    .filter((submission) => query.language === undefined || submission.language === query.language)
    .filter((submission) => query.status === undefined || submission.status === query.status)
    .slice()
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));

  const start = (page - 1) * pageSize;
  const items = filteredItems.slice(start, start + pageSize);
  const totalItems = filteredItems.length;

  return {
    items,
    meta: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function getLatestSubmissionMock(problemId: number): Promise<SubmissionDetail | null> {
  await sleep(NETWORK_DELAY_MS);

  const latest = submissions
    .filter((submission) => submission.problemId === problemId)
    .slice()
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt))[0];

  return latest ?? null;
}

export async function listSubmissionTestCaseResultsMock(submissionId: number): Promise<TestCaseResultListResponse> {
  await sleep(NETWORK_DELAY_MS);
  return {
    items: submissionResultsBySubmissionId[submissionId] ?? [],
  };
}
