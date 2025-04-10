import React, { useEffect, useRef, useState } from "react";
import { css, cx } from "@emotion/css";
import { setupCursorTracking, Toggle } from "../util";

import { ReactComponent as CloseIcon } from "../assets/cross.svg";
import { Button } from "./ButtonOrAnchor";

const containerStyle = css`
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	background-color: rgba(from var(--card-bg) r g b / 0.9);
	transition: opacity 300ms;

	& main {
		position: absolute;
		top: 0;
		right: 0;
		width: 50rem;
		max-width: 90vw;
		height: 100%;
		background-color: var(--bg-colour);
		translate: 100% 0;
		transition: translate 300ms, opacity 300ms;
		display: grid;
		place-items: center;
		overflow-y: auto;

		& > .contact-container {
			display: flex;
			flex-direction: column;
			padding: 2rem;
			gap: 2rem;
			width: 100%;
			max-width: 35rem;

			& > .contact-header {
				display: flex;
				justify-content: space-between;
				align-items: center;

				& h3 {
					font-size: 1.5rem;
					font-weight: 700;
				}

				& .close-button {
					background: none;
					border: none;
					cursor: pointer;
					color: var(--text-subdued);

					&:hover,
					&:focus {
						color: var(--text-colour);
					}
				}
			}

			& form {
				display: flex;
				flex-direction: column;
				gap: 1rem;
			}

			& article {
				color: var(--text-subdued);
				margin-bottom: 1rem;
				display: flex;
				flex-direction: column;
				gap: 1.2rem;
				font-size: 0.9rem;
			}

			& .success {
				color: var(--text-success);
			}

			& .error {
				color: var(--text-error);
			}
		}
	}
`;

const inputStyle = css`
	width: 100%;
	padding: 0.8rem;
	border: 1px solid var(--table-border);
	background-color: var(--card-bg);
	color: var(--text-colour);
	font-size: 1rem;
	border-radius: 0.5rem;

	textarea& {
		height: 100%;
		max-height: 20vh;
	}

	&:disabled {
		opacity: 0.8;
		cursor: not-allowed;
	}
`;

const ContactForm: React.FC<{
	toggle: Toggle;
}> = ({ toggle }) => {
	const nameRef = useRef<HTMLInputElement>(null);
	const [sending, setSending] = useState(false);
	const [sent, setSent] = useState(false);

	useEffect(() => {
		if (nameRef.current && toggle.on) nameRef.current.focus();

		if (!toggle.on) {
			setSent(false);
			setSending(false);
			setError(null);
		}

		// remember current page
		const href = window.location.href;

		// hijack back button and close the form instead
		const handleBack = (e: PopStateEvent) => {
			if (toggle.on) {
				e.preventDefault();
				toggle.set(false);
				// not sure of a cleaner way to do this
				// this resets the history to the current page
				window.history.replaceState(null, "", href);
			}
		};

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") toggle.set(false);
		};

		window.addEventListener("keydown", handleEscape);
		window.addEventListener("popstate", handleBack);
		return () => {
			window.removeEventListener("keydown", handleEscape);
			window.removeEventListener("popstate", handleBack);
		};
	}, [toggle.on]);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!name || !email || !message) {
			return setError("Please fill in all fields.");
		}

		setError(null);
		setSending(true);
		try {
			await fetch("https://api.feathers.studio/send", {
				method: "POST",
				body: JSON.stringify({
					type: "website-contact",
					name,
					email,
					message,
				}),
			});
			setName("");
			setEmail("");
			setMessage("");
			setSending(false);
			setSent(true);

			// reset if the form was closed before the request was sent
			if (!toggle.on) setSent(false);
		} catch (e) {
			console.error(e);
			setError(
				"Failed to send message. Try again later, or notify me via email or Telegram, thanks!",
			);
			setSending(false);
			setSent(false);
		}
	};

	const disabled = sending || sent;

	return (
		<section
			aria-hidden={!toggle.on}
			onClick={() => toggle.set(false)}
			className={cx(
				containerStyle,
				css`
					opacity: ${toggle.on ? 1 : 0};
					pointer-events: ${toggle.on ? "auto" : "none"};
				`,
			)}>
			<main
				onClick={e => e.stopPropagation()}
				style={{
					translate: toggle.on ? "0 0" : "100% 0",
				}}>
				<div className="contact-container">
					<div className="contact-header">
						<h3>Let's talk!</h3>
						<button className="close-button" onClick={() => toggle.set(false)}>
							<CloseIcon />
						</button>
					</div>
					<form onSubmit={handleSubmit}>
						<input
							disabled={disabled}
							ref={nameRef}
							type="text"
							name="name"
							placeholder="Name"
							value={name}
							onChange={e => setName(e.target.value)}
							className={inputStyle}
						/>
						<input
							disabled={disabled}
							type="email"
							name="email"
							placeholder="Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							className={inputStyle}
						/>
						<textarea
							disabled={disabled}
							name="message"
							placeholder="Message"
							value={message}
							onChange={e => setMessage(e.target.value)}
							className={inputStyle}
						/>
						<Button disabled={disabled} type="submit" ref={setupCursorTracking}>
							<div className="dynamic-gradient" />
							{sending ? "Sending..." : sent ? "Sent ✅" : "Send"}
						</Button>
						{sent && (
							<p className="success">
								I've received your message! I'll get back to you as soon as
								possible. Thank you for reaching out!
							</p>
						)}
						{error && <p className="error">{error}</p>}
					</form>
					<article>
						<p>
							Hey there! I live in{" "}
							<a
								href="https://www.worldtimebuddy.com/?pl=1&lid=1264527,2643743,5128581,5391959,1819729,1850147&h=1264527&hf=1"
								target="_blank"
								rel="noreferrer">
								Chennai, South India (UTC+05:30)
							</a>
							.
						</p>
						<p>
							I usually respond within 24 hours. I'd love to hear about new
							opportunities or collaborations. Or just drop by to say hi!
						</p>
						<p>
							You can also contact me via{" "}
							<a href="https://t.me/mkrhere" target="_blank" rel="noreferrer">
								Telegram/MKRhere
							</a>
							.
						</p>
					</article>
				</div>
			</main>
		</section>
	);
};

export default ContactForm;
