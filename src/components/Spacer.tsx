import React from "react";

type Props = {
	inline?: boolean;
	x?: number;
	y?: number;
};

const rem = (x?: number) => (x === 0 ? x : x ? `${x}rem` : "100%");

export const Spacer: React.FC<Props> = ({ inline, x, y = 1 }) => {
	return (
		<span
			// identifier
			className="spacer"
			style={{
				display: inline ? "inline-block" : "block",
				minWidth: rem(x),
				minHeight: rem(y),
			}}
		/>
	);
};
