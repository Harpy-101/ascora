import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import useGetWeightEntryById from "../hooks/use-get-weight-entry-by-id";
import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import WeightEntryForm from "../components/WeightEntryForm";

type EditWeightEntryScrennProps = {
  weightEntryId: string;
};

export default function EditWeightEtryScreen({
  weightEntryId,
}: EditWeightEntryScrennProps) {
  const { data, isLoading, isFetchedAfterMount, error, refetch } =
    useGetWeightEntryById(weightEntryId);

  if (isLoading || !isFetchedAfterMount) {
    return <ScreenLoadingState message="Loding entry..." />;
  }

  if (!data) {
    return (
      <ScreenErrorState
        title="Could not load weight entry"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <WeightEntryForm entry={data} />;
}
