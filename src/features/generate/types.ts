/**
 * ILAW lesson-plan output model for the generator.
 *
 * Mirrors the DepEd MATATAG / ILAW template (`LESSON PLAN.docx`): a lesson-wide
 * header (Lesson Information, Learning Competency, Learner Context) plus
 * session-level fields that are rendered as one column per session. Every
 * per-session field is an array whose length equals the number of sessions, so
 * `field[i]` is the content for Session `i + 1`.
 *
 * This shape is now produced by the backend `POST /lesson-plans` response; the
 * request/record types below mirror the rest of that contract.
 */

import type { ProviderId } from "@/features/settings/types"

/** A single Learning Objective cell: the docx "Knowledge / Skill / Task" triad. */
export interface SessionObjective {
  knowledge: string
  skill: string
  task: string
}

/** One numbered step within a session's Flow / Daloy ng Aralin. */
export interface FlowStep {
  /** Step heading, e.g. "Establish the Purpose". */
  title: string
  /** Step body / teacher actions. */
  details: string
}

/**
 * A fully-structured ILAW lesson plan.
 *
 * Lesson-wide fields render as full-width rows; per-session fields render as one
 * cell per session column (their arrays all share the same length, `N`).
 */
export interface GeneratedLessonPlan {
  // ── Lesson-wide (full-width rows) ──────────────────────────────────────────
  lessonInformation: {
    title: string
    learningAreas: string
    teacherName: string
    gradeLevelAndSection: string
    /** e.g. "5 sessions (45 minutes each)". */
    sessionsLabel: string
    references: string[]
    aiDeclaration: string
  }
  learningCompetency: string[]
  learnerContext: string

  // ── Per-session (one entry per session column) ─────────────────────────────
  /** "Session 1" … "Session N" — drives the table column headers. */
  sessionLabels: string[]
  /** Per session: up to 3 objectives (Knowledge / Skill / Task). */
  learningObjectives: SessionObjective[][]
  preLesson: string[]
  /** Per session: the numbered Flow / Daloy ng Aralin steps. */
  flow: FlowStep[][]
  learningResources: string[][]
  opportunitiesForIntegration: string[][]
  formativeAssessment: string[]
  extendedLearningOpportunities: string[]
  /** Teacher-to-complete — rendered with the amber "needs attention" treatment. */
  reflections: string[]

  // ── Signatories ────────────────────────────────────────────────────────────
  signatories: {
    preparedBy: string
    checkedBy: string
    notedBy: string
  }
}

/**
 * Left-column guidance copy per output row, taken verbatim from the ILAW
 * template. Rendered as the italic helper text beside each row label so the
 * generated table matches the official DepEd format.
 */
export const ROW_GUIDANCE = {
  learningCompetency:
    "Write the competency/ies from the curriculum that we are targeting, and the content or performance standards applicable to the sessions.",
  learningObjectives:
    "Write the smaller knowledge, skills, or tasks from the competency that the learners will work on and be able to show by the end of the sessions. 3 objectives only.",
  learnerContext:
    "Write your observations of your learners, and how they have been performing or responding to learning experiences recently. Include strengths, interests, and possible barriers to learning.",
  preLesson: "Describe how you will help the learners get ready for the lesson.",
  flow:
    "Describe the activities that you can implement in 1 or more sessions to meet the learning objectives. Apply the Learning Design Principles by thinking about how to make the objectives clear, guide learners before they try the task, check well-being and mastery, and connect today's lesson to past competencies.",
  learningResources:
    "List down the learning resources that will help you reach your objectives. Ensure that they are available and inclusive.",
  opportunitiesForIntegration:
    "Write down any possibilities to meaningfully connect with other learning areas, special topics, or technology.",
  formativeAssessment:
    "Create a task, activity, or questions to evaluate learning and provide feedback. Provide appropriate accommodations so all learners can demonstrate their understanding.",
  extendedLearningOpportunities:
    "Suggest other learning experiences outside class hours that learners may access to reinforce what they have learned or spark their curiosity.",
  reflections:
    "Think about what you need to change for the next session based on what happened today. Note what learners are interested in exploring and what you'd like your instructional coach to help you with.",
} as const

/** Marker prefix for teacher-to-complete content (rendered amber). */
export const TEACHER_TODO_PREFIX = "[Teacher to complete]"

// ── Backend `/lesson-plans` contract (camelCase, mirrors the BE schemas) ─────────

/**
 * Body for `POST /lesson-plans` — the Step 1 + Step 2 wizard inputs.
 * Mirrors the BE `LessonPlanGenerateRequest`; built from `LessonDetailsData` +
 * `CompetenciesData` at submit time.
 */
export interface LessonPlanGenerateRequest {
  lessonTitle: string
  gradeLevel: string
  learningArea: string
  term: string
  week: string
  teacherName: string
  section: string
  sessions: number
  minutesPerSession: number
  references: string[]
  aiDeclaration: string
  competencies: string[]
  additionalInstructions: string
}

// ── Curriculum reference data (camelCase, mirrors the BE `/curriculum` schemas) ──

/** Strengthened-SHS track for a cluster; null for K-10 and SHS core subjects. */
export type Track = "ACADEMIC" | "TECHPRO"

/**
 * A DepEd grade level — a row from `GET /curriculum/grade-levels`.
 * `code` (e.g. "GRADE_7") is the stable id used to fetch the grade's subjects;
 * `name` (e.g. "Grade 7") is the display label and the value submitted to the backend.
 */
export interface GradeLevel {
  id: string
  code: string
  name: string
  /** "MATATAG" (Grades 1-10) or "Strengthened SHS" (Grades 11-12). */
  curriculum: string
  orderIndex: number
}

/**
 * A subject offered at a grade level — a row from
 * `GET /curriculum/grade-levels/{code}/subjects`. `name` is the value submitted to
 * the backend; `cluster` groups SHS electives in the dropdown (null for K-10 + core).
 */
export interface Subject {
  id: string
  name: string
  category: "CORE" | "ELECTIVE"
  /** Present for SHS elective subjects; null for K-10 and SHS core subjects. */
  cluster: { id: string; name: string; track: Track } | null
  orderIndex: number
}

/** List-row view of a saved plan (dashboard cards). Mirrors BE `LessonPlanSummary`. */
export interface LessonPlanSummary {
  id: string
  /** ISO-8601 timestamp from the backend. */
  createdAt: string
  title: string
  learningAreas: string
  gradeLevelAndSection: string
  sessionsLabel: string
  providerUsed: ProviderId
  /** Count of "[Teacher to complete]" cells — drives the card's placeholder badge. */
  placeholderCount: number
}

/**
 * Full saved-plan view — returned by `POST /lesson-plans` and `GET /lesson-plans/{id}`.
 * The renderable plan lives under `plan`; the FE keys/navigates by `id`.
 */
export interface LessonPlanDetail {
  id: string
  createdAt: string
  providerUsed: ProviderId
  plan: GeneratedLessonPlan
}
