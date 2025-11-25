import Svg, { Path } from "react-native-svg";

export default function ChevronDown({
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
			<Path d="M6 9L12 15L18 9" stroke={color || "#000000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></Path>
		</Svg>
	);
}
