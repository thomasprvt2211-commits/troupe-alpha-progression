import {
  Compass,
  HeartPulse,
  Tent,
  ChefHat,
  Flame,
  Link,
  Hammer,
  Leaf,
  HandHeart,
  Crown,
  Medal,
  MessageCircle,
  Star,
  Shield,
  Target,
  Map,
  BookOpen,
  Users,
  TreePine,
  Mountain,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Compass,
  HeartPulse,
  Tent,
  ChefHat,
  Flame,
  Link,
  Hammer,
  Leaf,
  HandHeart,
  Crown,
  Medal,
  MessageCircle,
  Star,
  Shield,
  Target,
  Map,
  BookOpen,
  Users,
  TreePine,
  Mountain,
};

interface BadgeIconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function BadgeIcon({
  icon,
  className = "h-6 w-6",
  style,
}: BadgeIconProps) {
  const Icon = iconMap[icon] ?? Medal;
  return <Icon className={className} style={style} />;
}

export { iconMap };
