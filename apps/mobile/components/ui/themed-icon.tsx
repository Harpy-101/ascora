import { ThemeColorToken } from "@/lib/theme/colors";
import useThemeColor from "@/lib/theme/use-theme-color";
import { LucideIcon } from "lucide-react-native";

type ThemedIconProps = {
  icon: LucideIcon;
  colorToken?: ThemeColorToken;
  size?: number;
};

export default function ThemedIcon({
  icon: Icon,
  colorToken = "foreground",
  size = 18,
}: ThemedIconProps) {
  const color = useThemeColor(colorToken);

  return <Icon size={size} color={color} />;
}
