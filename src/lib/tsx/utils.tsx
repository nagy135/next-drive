import Image from "next/image";
import { useState } from "react";

export const ImageWithHideOnError = (props: any) => {
	const [hideImage, setHideImage] = useState(false);

	return (
		!hideImage && (
			<Image
				{...props}
				onError={() => {
					setHideImage(true);
				}}
			/>
		)
	);
};

