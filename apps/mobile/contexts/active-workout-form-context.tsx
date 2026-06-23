import { createId } from "@/db/create-id";
import {
  WorkoutFormSchema,
  WorkoutFormValues,
} from "@/lib/validation/exerciseSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, ReactNode, useContext } from "react";
import {
  FormProvider,
  useFieldArray,
  UseFieldArrayRemove,
  useForm,
} from "react-hook-form";

type ExerciseToAdd = {
  exerciseId: string;
  name: string;
};

type ActiveWorkoutFaromContextValue = {
  exerciseFields: ReturnType<
    typeof useFieldArray<WorkoutFormValues, "exercises", "fieldId">
  >["fields"];
  appendExercise: (exercise: ExerciseToAdd) => void;
  removeExercise: UseFieldArrayRemove;
};

const ActiveWorkoutContext =
  createContext<ActiveWorkoutFaromContextValue | null>(null);

export function ActiveWorkoutFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(WorkoutFormSchema),
    defaultValues: {
      name: "Deafalt name",
      notes: "",
      exercises: [],
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
      sets: [
        {
          id: createId(),
          setNumber: 1,
          weight: "",
          reps: "",
          completed: false,
        },
      ],
    });
  }

  return (
    <FormProvider {...form}>
      <ActiveWorkoutContext.Provider
        value={{
          exerciseFields: exerciseFieldArray.fields,
          appendExercise,
          removeExercise: exerciseFieldArray.remove,
        }}
      >
        {children}
      </ActiveWorkoutContext.Provider>
    </FormProvider>
  );
}

export function useActiveWorkoutForm() {
  const context = useContext(ActiveWorkoutContext);

  if (!context) {
    throw new Error(
      "useActiveWorkoutForm must be used inside ActiveWorkoutFormProvider",
    );
  }

  return context;
}
