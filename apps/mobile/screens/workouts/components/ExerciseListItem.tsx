import { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  Easing,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const SCREENT_WIDTH = Dimensions.get("window").width;
const ITEM_SPACING = 16;

type ExerciseListitemProps = {
  children: React.ReactNode;
  isDeleting: boolean;
  onExitComplete: () => void;
};

export default function ExerciseListitem({
  children,
  isDeleting,
  onExitComplete,
}: ExerciseListitemProps) {
  const deleteProgress = useSharedValue(0);
  const messuredHeight = useSharedValue(0);
  const deletingStarted = useSharedValue(false);

  const animationStyle = useAnimatedStyle(() => {
    if (!deletingStarted.value) {
      return {
        opacity: 1,
        transform: [{ translateX: 0 }],
        marginBottom: ITEM_SPACING,
      };
    }

    return {
      opacity: 1 - deleteProgress.value,
      height: messuredHeight.value * (1 - deleteProgress.value),
      marginBottom: ITEM_SPACING * (1 - deleteProgress.value),
      transform: [{ translateX: deleteProgress.value * -SCREENT_WIDTH }],
      overflow: "hidden",
    };
  });

  useEffect(() => {
    if (!isDeleting) return;
    deletingStarted.value = true;

    deleteProgress.value = withTiming(
      1,
      {
        duration: 250,
        easing: Easing.inOut(Easing.quad),
      },
      (finished) => {
        if (finished) {
          scheduleOnRN(onExitComplete);
        }
      },
    );
  }, [isDeleting, deleteProgress, onExitComplete, deletingStarted]);

  return (
    <Animated.View
      entering={SlideInRight.duration(250).easing(Easing.inOut(Easing.quad))}
      onLayout={(event) => {
        if (!deletingStarted.value) {
          messuredHeight.value = event.nativeEvent.layout.height;
        }
      }}
      style={animationStyle}
      pointerEvents={isDeleting ? "none" : "auto"}
    >
      {children}
    </Animated.View>
  );
}
