import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import WeightEntryForm from "../components/WeightEntryForm";
import useGetLastWeight from "../hooks/use-get-last-weight";
import ScreenErrorState from "@/components/screen-states/ScreenErrorState";

export default function NewUserWeightEntryScreen() {
  const { data, isLoading, isFetchedAfterMount, error, refetch } =
    useGetLastWeight();

  if (isLoading || !isFetchedAfterMount) {
    return <ScreenLoadingState />;
  }

  if (error) {
    return (
      <ScreenErrorState
        title="Could not load page"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }
  console.log("Last entred weight", data);

  return <WeightEntryForm lastWeight={data ?? undefined} />;
}
