import React from "react";
import { motion } from "framer-motion";

const RevealChildren: React.FC<{
	type: "div" | "span" | "li";
	children: React.ReactChild[];
	show: boolean;
}> = ({ type, children: items, show = false, ...props }) => {
	const Comp = motion[type];
	const opacity = show ? 1 : 0;
	const y = show ? 0 : -2;

	return (
		<>
			{items.map((item, i) => (
				<Comp
					key={i}
					initial={{ opacity: 0, y: -2 }}
					animate={{
						opacity,
						y: y * i,
						transition: {
							delay: i * 0.01,
						},
					}}
					{...props}>
					{item}
				</Comp>
			))}
		</>
	);
};

export default RevealChildren;
