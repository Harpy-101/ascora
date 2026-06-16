import { Control, Controller, Path } from "react-hook-form";
import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import ControlledInputInner from "./ControlledInputIneer";

type ControlledInputProps = {
  control: Control<WorkoutFormValues>;
  name: Path<WorkoutFormValues>;
};

export default function ControlledInput({
  control,
  name,
}: ControlledInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <ControlledInputInner field={field} fieldState={fieldState} />
      )}
    />
  );
}
