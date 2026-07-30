import { createId } from "@/db/create-id";
import {
  WorkoutPlanFormValues,
  workoutPlanSchema,
} from "@/screens/workouts/workout-plans/validation/planExerciseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, ReactNode, useContext } from "react";
import {
  FormProvider,
  useFieldArray,
  UseFieldArrayMove,
  UseFieldArrayRemove,
  useForm,
} from "react-hook-form";

export type ExerciseToAdd = {
  exerciseId: string;
  name: string;
};

type WorkoutPlanFormContextValues = {
  exerciseFields: ReturnType<
    typeof useFieldArray<WorkoutPlanFormValues, "exercises", "fieldId">
  >["fields"];
  appendExercise: (exercies: ExerciseToAdd) => void;
  removeExercies: UseFieldArrayRemove;
  moveExercise: UseFieldArrayMove;
};

const WorkoutPlanFormContext =
  createContext<WorkoutPlanFormContextValues | null>(null);

export function WorkoutPlanFormProvider({
  children,
  formValues,
}: {
  children: ReactNode;
  formValues?: WorkoutPlanFormValues;
}) {
  const form = useForm<WorkoutPlanFormValues>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      name: formValues?.name ?? "",
      description: formValues?.description ?? "",
      exercises: formValues?.exercises ?? [],
    },
    shouldFocusError: false,
  });

  const exerciseFieldArray = useFieldArray({
    control: form.control,
    name: "exercises",
    keyName: "fieldId",
  });

  function appendExercise(exercise: ExerciseToAdd) {
    exerciseFieldArray.append({
      id: createId(),
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      //   sets: [
      // {
      //   id: createId(),
      setCount: 1,
      setNumber: 1,
      targetReps: null,
      targetWeight: null,
      // },
      //   ],
    });
  }

  return (
    <FormProvider {...form}>
      <WorkoutPlanFormContext.Provider
        value={{
          exerciseFields: exerciseFieldArray.fields,
          appendExercise,
          removeExercies: exerciseFieldArray.remove,
          moveExercise: exerciseFieldArray.move,
        }}
      >
        {children}
      </WorkoutPlanFormContext.Provider>
    </FormProvider>
  );
}

export function useWorkoutPlanForm() {
  const context = useContext(WorkoutPlanFormContext);

  if (!context) {
    throw new Error(
      "useWorkoutPlanForm can only be used inside WorkoutPlanFormContext",
    );
  }

  return context;
}
