export type ExerciseDetailsResponse = {
  success: boolean;
  data: {
    exerciseId: string;
    name: string;
    imageUrl: string;
    imageUrls?: {
      "360p"?: string;
      "480p"?: string;
      "720p"?: string;
      "1080p"?: string;
    };
    equipments: string[];
    bodyParts: string[];
    exerciseType: string;
    targetMuscles: string[];
    secondaryMuscles: string[];
    videoUrl?: string;
    overview: string;
    instructions: string[];
    exerciseTips: string[];
    variations: string[];
    relatedExerciseIds: string[];
  };
};

export async function getExerciseDetails(
  exerciseId: string,
): Promise<ExerciseDetailsResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Missing EXPO_PUBLIC_API_URL");
  }

  const url = `${apiUrl}/api/exercises/${encodeURIComponent(exerciseId)}`;

  console.log("Exercise details URL:", url);

  const res = await fetch(url);

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`Failed to fetch exercise details: ${res.status} ${body}`);
  }

  return JSON.parse(body) as ExerciseDetailsResponse;
}
