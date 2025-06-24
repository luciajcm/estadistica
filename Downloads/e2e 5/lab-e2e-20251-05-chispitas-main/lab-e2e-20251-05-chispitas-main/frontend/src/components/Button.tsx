import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	className?: string;
	disabled?: boolean;
}

export default function Button({ 
	children, 
	onClick, 
	type = 'button', 
	className = '', 
	disabled = false 
}: ButtonProps) {
	return (
		<button 
			className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${className}`} 
			onClick={onClick}
			type={type}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
