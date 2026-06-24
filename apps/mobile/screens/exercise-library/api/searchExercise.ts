export type ExerciseSearchParams = {
  search: string;
  bodyParts: string[];
  equipments: string[];
  exerciseType?: string;
  after?: string;
  limit?: number;
};

export default async function searchExercises(params: ExerciseSearchParams) {
  const searchParams = new URLSearchParams();

  if (params.search.trim()) {
    searchParams.set("name", params.search.trim());
  }

  if (params.bodyParts.length > 0) {
    searchParams.set("bodyParts", params.bodyParts.join(","));
  }

  if (params.equipments.length > 0) {
    searchParams.set("equipments", params.equipments.join(","));
  }

  if (params.exerciseType) {
    searchParams.set("exerciseType", params.exerciseType);
  }

  if (params.after) {
    searchParams.set("after", params.after);
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit ?? 20));
  }

  //  ! Add the backend url
  const response = await fetch("");

  if (!response.ok) {
    throw new Error(`Failed to search exercises`);
  }

  return response.json();
}
