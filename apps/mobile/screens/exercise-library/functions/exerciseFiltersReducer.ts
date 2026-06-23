export type ExerciseSearchParams = {
  search: string;
  equipments: string[];
  bodyParts: string[];
  exerciseType?: string;
};

export type ExerciseFilterAction =
  | { type: "setSearch"; search: string }
  | { type: "toggleEquipment"; equipment: string }
  | { type: "toggleBodyPart"; bodyPart: string }
  | { type: "setExerciseType"; exerciseType?: string }
  | { type: "clear" };

type ExerciseSearchFilters = {
  search: string;
  equipments: string[];
  bodyParts: string[];
  exerciseType?: string;
};

export const initialExerciseFilters: ExerciseSearchParams = {
  search: "",
  equipments: [],
  bodyParts: [],
  exerciseType: undefined,
};

export function exerciseFiltersReducer(
  state: ExerciseSearchFilters,
  action: ExerciseFilterAction,
): ExerciseSearchFilters {
  switch (action.type) {
    case "setSearch":
      return { ...state, search: action.search };

    case "toggleEquipment":
      return {
        ...state,
        equipments: state.equipments.includes(action.equipment)
          ? state.equipments.filter((item) => item !== action.equipment)
          : [...state.equipments, action.equipment],
      };

    case "toggleBodyPart":
      return {
        ...state,
        bodyParts: state.bodyParts.includes(action.bodyPart)
          ? state.bodyParts.filter((item) => item !== action.bodyPart)
          : [...state.bodyParts, action.bodyPart],
      };

    case "setExerciseType":
      return { ...state, exerciseType: action.exerciseType };

    case "clear":
      return {
        search: "",
        equipments: [],
        bodyParts: [],
        exerciseType: undefined,
      };
  }
}
