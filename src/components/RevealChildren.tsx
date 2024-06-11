import React from "react";

const RevealChildren: React.FC<{
	type: "div" | "span" | "li";
	children: (
		| string
		| number
		| React.ReactElement<any, string | React.JSXElementConstructor<any>>
	)[];
	show: boolean;
}> = ({ type, children: items, show = false, ...props }) => {
	const Comp = type;

	return (
		<>
			{items.map((item, i) => (
				<Comp
					key={i}
					style={{
						opacity: show ? 1 : 0,
						transform: `translateY(${show ? 0 : -2 * i}px)`,
						transition: "opacity 250ms, transform 250ms",
						transitionDelay: `${i * 0.01}s`,
					}}
					{...props}>
					{item}
				</Comp>
			))}
		</>
	);
};

export default RevealChildren;
