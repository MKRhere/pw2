export interface Experience {
	active: boolean;
	title: string;
	location: string;
	position: string;
	year: string;
	description: React.ReactElement | string;
	logo: string;
	onClick?: (e: React.MouseEvent) => void;
}
