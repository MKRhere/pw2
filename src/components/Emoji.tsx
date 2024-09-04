import React from "react";
import { css, cx } from "@emotion/css";

const EmojiMap = {
	"2x": "emoji/2x",
	"nerd": "emoji/nerd",
	"technologist": "emoji/technologist",
	"wink": "emoji/wink",
	"ind": "serenity/U+1F1EE_U+1F1F3",
	"tada": "serenity/U+1F389",
};

export const Emoji = ({
	emoji,
	baseline,
}: {
	emoji: keyof typeof EmojiMap;
	baseline?: boolean;
}) => (
	<img
		className={cx(
			"emoji",
			css`
				image-rendering: pixelated;
				vertical-align: middle;

				height: 1.2em;

				&.baseline {
					vertical-align: baseline;
				}
			`,
			{ baseline },
		)}
		src={`/assets/${EmojiMap[emoji]}.png`}
	/>
);
