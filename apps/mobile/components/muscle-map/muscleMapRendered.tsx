import Svg, { Path } from "react-native-svg";
import { bodyFemaleFront } from "./assets/bodyFemaleFront";
import { bodyFemaleBack } from "./assets/bodyFemaleBack";
import { bodyFront } from "./assets/bodyFront";
import { bodyBack } from "./assets/bodyBack";

type Slug =
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

export type ExtendedBodyPart = {
  slug?: Slug;
  color?: string;
  intensity?: number;
  side?: "left" | "right";
  styles?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
};

type AssetBodyPart = ExtendedBodyPart & {
  path?: {
    common?: string[];
    left?: string[];
    right?: string[];
  };
};

type BodyProps = {
  data: readonly ExtendedBodyPart[];
  side?: "front" | "back";
  gender?: "male" | "female";
  colors?: readonly string[];
  defaultFill?: string;
  defaultStroke?: string;
  defaultStrokeWidth?: number;
  hiddenParts?: Slug[];
  disabledParts?: Slug[];
  onBodyPartPress?: (part: ExtendedBodyPart, side?: "left" | "right") => void;
};

export function NativeMuscleBody({
  data,
  side = "front",
  gender = "male",
  colors = ["#059669", "#F59E0B"],
  defaultFill = "#D1D5DB",
  defaultStroke = "#9CA3AF",
  defaultStrokeWidth = 0.5,
  hiddenParts = [],
  disabledParts = [],
  onBodyPartPress,
}: BodyProps) {
  const bodyToRender =
    gender === "female"
      ? side === "front"
        ? bodyFemaleFront
        : bodyFemaleBack
      : side === "front"
        ? bodyFront
        : bodyBack;

  const viewBox =
    gender === "male"
      ? side === "front"
        ? "0 0 724 1448"
        : "580 0 724 1448"
      : side === "front"
        ? "0 0 724 1448"
        : "580 0 724 1448";

  const userDataMap = new Map<Slug, ExtendedBodyPart>();

  data.forEach((part) => {
    if (part.slug) {
      userDataMap.set(part.slug, part);
    }
  });

  function getMergedPart(assetPart: AssetBodyPart): AssetBodyPart {
    if (!assetPart.slug) return assetPart;

    const userPart = userDataMap.get(assetPart.slug);

    if (!userPart) return assetPart;

    let color = userPart.color;

    if (!color && userPart.intensity) {
      color = colors[userPart.intensity - 1];
    }

    return {
      ...assetPart,
      ...userPart,
      path: assetPart.path,
      color,
    };
  }

  function getFill(part: AssetBodyPart, pathSide?: "left" | "right") {
    if (part.slug && disabledParts.includes(part.slug)) {
      return "#EBEBE4";
    }

    if (part.side && pathSide && part.side !== pathSide) {
      return defaultFill;
    }

    return part.styles?.fill ?? part.color ?? defaultFill;
  }

  function getStroke(part: AssetBodyPart) {
    return part.styles?.stroke ?? defaultStroke;
  }

  function getStrokeWidth(part: AssetBodyPart) {
    return part.styles?.strokeWidth ?? defaultStrokeWidth;
  }

  return (
    <Svg
      viewBox={viewBox}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {bodyToRender
        .filter((part: AssetBodyPart) => {
          return !part.slug || !hiddenParts.includes(part.slug);
        })
        .map((assetPart: AssetBodyPart) => {
          const part = getMergedPart(assetPart);

          const commonPaths =
            part.path?.common?.map((d, index) => (
              <Path
                key={`${part.slug}-common-${index}`}
                d={d}
                fill={getFill(part)}
                stroke={getStroke(part)}
                strokeWidth={getStrokeWidth(part)}
                opacity={
                  part.slug && disabledParts.includes(part.slug) ? 0.6 : 1
                }
                onPress={() => onBodyPartPress?.(part)}
              />
            )) ?? [];

          const leftPaths =
            part.path?.left?.map((d, index) => (
              <Path
                key={`${part.slug}-left-${index}`}
                d={d}
                fill={getFill(part, "left")}
                stroke={getStroke(part)}
                strokeWidth={getStrokeWidth(part)}
                opacity={
                  part.slug && disabledParts.includes(part.slug) ? 0.6 : 1
                }
                onPress={() => onBodyPartPress?.(part, "left")}
              />
            )) ?? [];

          const rightPaths =
            part.path?.right?.map((d, index) => (
              <Path
                key={`${part.slug}-right-${index}`}
                d={d}
                fill={getFill(part, "right")}
                stroke={getStroke(part)}
                strokeWidth={getStrokeWidth(part)}
                opacity={
                  part.slug && disabledParts.includes(part.slug) ? 0.6 : 1
                }
                onPress={() => onBodyPartPress?.(part, "right")}
              />
            )) ?? [];

          return [...commonPaths, ...leftPaths, ...rightPaths];
        })}
    </Svg>
  );
}
