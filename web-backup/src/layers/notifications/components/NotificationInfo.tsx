import React from "react";
import { Text } from "@mantine/core";
import { Icon, IconProps } from "@tabler/icons-react";

interface Props {
	icon:
		| React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
		| string;
	label: string;
}

const GUNSVG = () => {
	return (
		<svg
			width='18px'
			viewBox='-51.2 -51.2 614.40 614.40'
			xmlns='http://www.w3.org/2000/svg'
			fill='#000000'
			stroke='#000000'
			stroke-width='0.00512'
			transform='rotate(0)'
		>
			<g id='SVGRepo_bgCarrier' stroke-width='0'></g>
			<g
				id='SVGRepo_tracerCarrier'
				stroke-linecap='round'
				stroke-linejoin='round'
				stroke='#CCCCCC'
				stroke-width='1.024'
			></g>
			<g id='SVGRepo_iconCarrier'>
				<path
					fill='#d1d1d1'
					d='M79.238 115.768l-28.51 67.863h406.15l-.273-67.862h-263.83v55.605h-15v-55.605h-16.68v55.605H146.1v-55.605h-17.434v55.605h-15v-55.605H79.238zm387.834 15.96v40.66h18.688v-40.66h-18.688zM56.768 198.63l20.566 32.015L28.894 406.5l101.68 7.174 21.54-97.996h115.74l14.664-80.252 174.55-3.873-.13-32.922H56.767zM263.44 235.85l-11.17 61.142h-96.05l12.98-59.05 12.53-.278-2.224 35.5 14.262 13.576 1.003-33.65 24.69-16.264 43.98-.976z'
				></path>
			</g>
		</svg>
	);
};

const NotificationInfo: React.FC<Props> = (props) => {
	return (
		<div style={{ color: "#d5d5d5", display: "flex", gap: 10 }}>
			{typeof props.icon !== "string" ? (
				<props.icon size={20} />
			) : props.icon === "gun" ? (
				<GUNSVG />
			) : (
				<i className={`ti ti-${props.icon}`} style={{ fontSize: 20 }} />
			)}
			<Text size='sm'>{props.label}</Text>
		</div>
	);
};

export default NotificationInfo;
