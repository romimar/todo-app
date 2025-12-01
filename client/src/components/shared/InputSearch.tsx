import { Input } from "@/components/ui/input";
import { useState } from "react";
import { X } from "lucide-react";

interface InputSearchProps {
	onSearchParam?: (param: string) => void;
}

const InputSearch = ({ onSearchParam }: InputSearchProps) => {
	const [searchValue, setSearchValue] = useState('');

	const handleClear = () => {
		setSearchValue('');
		if (onSearchParam) {
			onSearchParam('');
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchValue(value);
		if (onSearchParam) {
			onSearchParam(value);
		}
	}

	return (
		<div className="relative w-full max-w-sm mb-4">
			<Input
				type="text"
				id="search"
				placeholder="Search items..."
				value={searchValue}
				onChange={handleChange}
			/>
			{searchValue && (
				<button
					type="button"
					onClick={handleClear}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
				>
					<X size={15} />
				</button>
			)}
		</div>
	);
};

export default InputSearch;