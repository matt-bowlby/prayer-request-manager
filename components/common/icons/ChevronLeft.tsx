import { Svg, Path } from "react-native-svg";

export default function ChevronLeft({
    width,
    height,
    color,
}: {
    width?: number;
    height?: number;
    color?: string;
}) {
    return (
        <Svg width={width || 80} height={height || 80} viewBox="0 0 25 24" fill="none">
            <Path d="M15 6L9 12L15 18" stroke={color || "#000000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></Path>
        </Svg>
    );
}
