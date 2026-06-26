/**
 * Local (mock) ILAW lesson-plan generator.
 *
 * Maps the wizard inputs into a complete `GeneratedLessonPlan`, sizing every
 * per-session field to `details.sessions` so the Result table renders one column
 * per session. Teacher-provided fields carry real values; AI-owned sections carry
 * representative placeholder content, and Reflections are left as an amber
 * "[Teacher to complete]" prompt.
 *
 * Pure and deterministic (no randomness, no I/O) — replace the body with a real
 * `POST /lesson-plans` call when the backend lands; the return shape is unchanged.
 */

import type { LessonDetailsData } from "./components/step-lesson-details"
import type { CompetenciesData } from "./components/step-competencies"
import {
  TEACHER_TODO_PREFIX,
  type FlowStep,
  type GeneratedLessonPlan,
  type SessionObjective,
} from "./types"

/** Pick from a pool by session index, wrapping when sessions exceed pool size. */
const pick = <T,>(pool: T[], i: number): T => pool[i % pool.length]

/** Build a session-length array, mapping each index to generated content. */
const perSession = <T,>(count: number, build: (i: number) => T): T[] =>
  Array.from({ length: count }, (_, i) => build(i))

/**
 * Generate an ILAW lesson plan from the collected wizard inputs.
 *
 * @param details - Step 1 "Lesson Information" values (incl. `sessions`).
 * @param competencies - Step 2 competencies + optional instructions.
 * @returns A fully-structured `GeneratedLessonPlan` with N session columns.
 */
export function generateLessonPlan(
  details: LessonDetailsData,
  competencies: CompetenciesData,
): GeneratedLessonPlan {
  const sessions = Math.max(1, details.sessions)
  const topic = details.lessonTitle.trim() || "the lesson topic"
  const area = details.learningArea || "this learning area"

  const cleanCompetencies = competencies.competencies
    .map((c) => c.trim())
    .filter(Boolean)

  const gradeLevelAndSection = [details.gradeLevel, details.section]
    .filter(Boolean)
    .join(" — ")

  const sessionsLabel = `${sessions} session${sessions !== 1 ? "s" : ""} (${
    details.minutesPerSession
  } minutes each)`

  return {
    lessonInformation: {
      title: details.lessonTitle.trim() || `${TEACHER_TODO_PREFIX} Lesson title`,
      learningAreas: details.learningArea,
      teacherName: details.teacherName.trim() || `${TEACHER_TODO_PREFIX} Name of teacher/s`,
      gradeLevelAndSection: gradeLevelAndSection || details.gradeLevel,
      sessionsLabel,
      references: details.references.map((r) => r.trim()).filter(Boolean),
      aiDeclaration: details.aiDeclaration.trim(),
    },

    learningCompetency:
      cleanCompetencies.length > 0
        ? cleanCompetencies
        : [`${TEACHER_TODO_PREFIX} Add the target curriculum competency/ies.`],

    learnerContext:
      `${details.gradeLevel || "The"} learners taking ${area} bring varied prior ` +
      `knowledge to ${topic}. Most respond well to concrete, real-world examples ` +
      `and benefit from guided practice before independent work; a common barrier ` +
      `is sustaining focus across multi-step procedures.`,

    sessionLabels: perSession(sessions, (i) => `Session ${i + 1}`),

    learningObjectives: perSession(sessions, (i) =>
      buildObjectives(topic, i),
    ),

    preLesson: perSession(sessions, (i) => pick(PRE_LESSON_POOL, i)(topic)),

    flow: perSession(sessions, (i) => buildFlow(topic, i)),

    learningResources: perSession(sessions, (i) => pick(RESOURCE_POOL, i)),

    opportunitiesForIntegration: perSession(sessions, (i) => pick(INTEGRATION_POOL, i)),

    formativeAssessment: perSession(sessions, (i) => pick(ASSESSMENT_POOL, i)(topic)),

    extendedLearningOpportunities: perSession(sessions, (i) => pick(EXTENDED_POOL, i)(topic)),

    reflections: perSession(
      sessions,
      (i) =>
        `${TEACHER_TODO_PREFIX} Write your personal reflection after this ` +
        `${area} session (Session ${i + 1}). Example: Most learners grasped the ` +
        `main concept, but the group activity ran longer than planned — next ` +
        `session I will give clearer instructions and prepare a catch-up task for ` +
        `learners who were absent.`,
    ),

    signatories: {
      preparedBy: details.teacherName.trim() || "",
      checkedBy: "",
      notedBy: "",
    },
  }
}

// ── Content pools (cycled by session index) ───────────────────────────────────

/** Three objectives (Knowledge / Skill / Task) tailored to the session focus. */
function buildObjectives(topic: string, i: number): SessionObjective[] {
  const focus = pick(OBJECTIVE_FOCUS, i)
  return [
    {
      knowledge: `Define and ${focus.verb} the key concepts of ${topic} relevant to this session.`,
      skill: `Identify and ${focus.skill} using accurate terminology and notation.`,
      task: `Complete a guided task that demonstrates ${focus.task}.`,
    },
  ]
}

const OBJECTIVE_FOCUS = [
  { verb: "explain", skill: "describe the core components", task: "correct identification of components" },
  { verb: "analyze", skill: "apply the basic procedures", task: "step-by-step problem solving" },
  { verb: "evaluate", skill: "compare and contrast cases", task: "reasoned classification of examples" },
  { verb: "connect", skill: "relate concepts to real-world contexts", task: "an applied, real-world example" },
  { verb: "synthesize", skill: "create original examples", task: "an original product showing mastery" },
]

const PRE_LESSON_POOL: Array<(topic: string) => string> = [
  (t) =>
    `Display a familiar real-world scenario and ask learners how they might ` +
    `represent it in connection with ${t}. Use their responses to surface prior knowledge.`,
  (t) =>
    `Show a short visual (image or clip) related to ${t} and run a quick ` +
    `think-pair-share so learners recall the previous session.`,
  (t) =>
    `Pose a warm-up question that links yesterday's work to today's focus on ${t}; ` +
    `collect quick answers to gauge readiness.`,
  (t) =>
    `Present a brief gallery of examples connected to ${t} and ask learners to ` +
    `note patterns they observe before any formal definitions.`,
  (t) =>
    `Have learners brainstorm where ${t} appears in everyday life, referencing ` +
    `student-created examples from earlier sessions.`,
]

/** Numbered Flow / Daloy ng Aralin steps for a session. */
function buildFlow(topic: string, i: number): FlowStep[] {
  return [
    { title: "Establish the Purpose", details: `Make the objectives clear and explain why ${topic} matters in ${pick(["mathematics", "everyday life", "future studies", "technology", "the workplace"], i)}.` },
    { title: "Vocabulary Support", details: `Define the key terms learners will need, with examples and non-examples.` },
    { title: "Guided Practice", details: `Model a worked example step by step, then have learners answer along before trying on their own.` },
    { title: "Check for Understanding", details: `Circulate, ask probing questions, and adjust pacing based on learner responses.` },
  ]
}

const RESOURCE_POOL: string[][] = [
  ["Whiteboard and markers", "Printed handouts with guided-practice items", "Reference/textbook excerpt"],
  ["Projector and slides", "Manipulatives or visual aids", "Worksheet for paired practice"],
  ["Chart paper and sticky notes", "Sample problem set", "Calculators (if applicable)"],
  ["Digital simulation or sandbox", "Comparison-table template", "Curated example bank"],
  ["Art/craft or hands-on materials", "Rubric for self-assessment", "Presentation space for sharing"],
]

const INTEGRATION_POOL: string[][] = [
  ["Computer Science: foundational uses in computing and graphics", "Science: observing patterns in nature"],
  ["Business: scheduling, routing, and inventory applications", "Social Studies: representing relationships and networks"],
  ["Art & Design: structure, symmetry, and composition", "Engineering: modeling and design"],
  ["Environmental Science: data and measurement", "History: how the concept developed over time"],
  ["Literature & Language: precise description and reasoning", "PE/Health: tracking and interpreting data"],
]

const ASSESSMENT_POOL: Array<(topic: string) => string> = [
  (t) =>
    `Exit Ticket: short items asking learners to identify and label the core ` +
    `elements of ${t}. Provide pre-marked supports for learners who need them.`,
  (t) =>
    `Quick quiz: 3–4 problems applying ${t}; offer simplified items for ` +
    `struggling learners and extension items for advanced learners.`,
  (t) =>
    `Comparison task: learners classify examples of ${t} and justify their ` +
    `reasoning in one or two sentences.`,
  (t) =>
    `Worked-explanation: learners solve a problem on ${t} and explain each step, ` +
    `with sentence frames available for language support.`,
  (t) =>
    `Performance check: learners produce an original example demonstrating ${t}, ` +
    `assessed with a brief rubric covering accuracy and clarity.`,
]

const EXTENDED_POOL: Array<(topic: string) => string> = [
  (t) => `Ask learners to find and document a real-world example of ${t} at home or in their community.`,
  (t) => `Challenge advanced learners to extend ${t} to a slightly more complex case and share their reasoning.`,
  (t) => `Invite learners to research how ${t} is used in a field that interests them and write a short paragraph.`,
  (t) => `Have learners create an annotated example or mini-portfolio illustrating ${t}.`,
  (t) => `Encourage learners to design an original product (poster, pattern, or model) applying ${t}.`,
]
