export async function scaleImageBeforeUpload(file: File, dimensions: { width: number, height: number }): Promise<Blob | null> {
	// ensure the file is an image
	if (!file.type.match(/image.*/)) return null;

	const image = new Image();
	image.src = URL.createObjectURL(file);

	await new Promise<Event>((res) => image.onload = res);
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d", { alpha: true })!;

	canvas.width = dimensions.width;
	canvas.height = dimensions.height;

	if (image.height <= image.width) {
		const scaleProportions = canvas.height / image.height;
		const scaledWidth = scaleProportions * image.width;
		context.drawImage(image, (canvas.width - scaledWidth) / 2, 0, scaledWidth, canvas.height);
	}
	else {
		const scaleProportions = canvas.width / image.width;
		const scaledHeight = scaleProportions * image.height;
		context.drawImage(image, 0, (canvas.height - scaledHeight) / 2, canvas.width, scaledHeight);
	}

	return new Promise((res) => canvas.toBlob(res));
}
