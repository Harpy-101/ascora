export type Slug =
  | "abs"
  | "adductors"
  | "ankles"
  | "biceps"
  | "calves"
  | "chest"
  | "deltoids"
  | "feet"
  | "forearm"
  | "gluteal"
  | "hamstring"
  | "hands"
  | "hair"
  | "head"
  | "knees"
  | "lower-back"
  | "neck"
  | "obliques"
  | "quadriceps"
  | "tibialis"
  | "trapezius"
  | "triceps"
  | "upper-back";

export const ASCEND_MUSCLE_TO_SLUG: Record<string, Slug> = {
  // Adductors / inner thigh
  "ADDUCTOR LONGUS": "adductors",
  "ADDUCTOR BREVIS": "adductors",
  "ADDUCTOR MAGNUS": "adductors",
  GRACILIS: "adductors",
  PECTINEUS: "adductors",

  // Arms
  "BICEPS BRACHII": "biceps",
  BRACHIALIS: "biceps",
  BRACHIORADIALIS: "forearm",
  "WRIST EXTENSORS": "forearm",
  "WRIST FLEXORS": "forearm",
  "TRICEPS BRACHII": "triceps",

  // Shoulders
  "ANTERIOR DELTOID": "deltoids",
  "LATERAL DELTOID": "deltoids",
  "POSTERIOR DELTOID": "deltoids",

  // Chest
  "PECTORALIS MAJOR CLAVICULAR HEAD": "chest",
  "PECTORALIS MAJOR STERNAL HEAD": "chest",
  "SERRATUS ANTE": "chest",
  "SERRATUS ANTERIOR": "chest",

  // Core
  "RECTUS ABDOMINIS": "abs",
  "TRANSVERSUS ABDOMINIS": "abs",
  OBLIQUES: "obliques",

  // Back
  "ERECTOR SPINAE": "lower-back",
  "LATISSIMUS DORSI": "upper-back",
  INFRASPINATUS: "upper-back",
  SUBSCAPULARIS: "upper-back",
  "TERES MAJOR": "upper-back",
  "TERES MINOR": "upper-back",

  // Traps / neck
  "TRAPEZIUS LOWER FIBERS": "trapezius",
  "TRAPEZIUS MIDDLE FIBERS": "trapezius",
  "TRAPEZIUS UPPER FIBERS": "trapezius",
  "LEVATOR SCAPULAE": "trapezius",
  SPLENIUS: "neck",
  STERNOCLEIDOMASTOID: "neck",

  // Glutes / hips
  "GLUTEUS MAXIMUS": "gluteal",
  "GLUTEUS MEDIUS": "gluteal",
  "GLUTEUS MINIMUS": "gluteal",
  "DEEP HIP EXTERNAL ROTATORS": "gluteal",
  "TENSOR FASCIAE LATAE": "gluteal",

  // Hip flexors / quads
  ILIOPSOAS: "quadriceps",
  SARTORIUS: "quadriceps",
  QUADRICEPS: "quadriceps",

  // Posterior leg
  HAMSTRINGS: "hamstring",
  POPLITEUS: "knees",

  // Lower leg
  GASTROCNEMIUS: "calves",
  SOLEUS: "calves",
  "TIBIALIS ANTERIOR": "tibialis",
};
