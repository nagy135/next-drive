"use client";

import { useCallback, useState } from "react";
import { S3, config } from "aws-sdk";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export default function FileUploader() {
	const [files, setFiles] = useState<File[]>([]);

	const onDropHandler = (ev: any) => {
		ev.preventDefault();

		let file = "";
		if (ev.dataTransfer.items) {
			// Use DataTransferItemList interface to access the file(s)
			file =
				[...ev.dataTransfer.items]
					.find((item: any) => item.kind === "file")
					.getAsFile();
		} else {
			// Use DataTransfer interface to access the file(s)
			file = ev.dataTransfer.files[0];
		}
		setFiles([...files, file as unknown as File]);
	};

	const onDragOver = (ev: any) => ev.preventDefault();

	const uploadFiles = useCallback(() => {

		// S3 Credentials
		config.update({
			accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
			secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
		});
		const s3 = new S3({
			params: { Bucket: process.env.NEXT_PUBLIC_S3_BUCKET },
			region: process.env.NEXT_PUBLIC_S3_REGION,
		});

		// Files Parameters

		for (const file of files) {
			const params = {
				Bucket: process.env.NEXT_PUBLIC_S3_BUCKET ?? "",
				Key: file.name,
				Body: file,
			};

			// Uploading file to s3

			var upload = s3
				.putObject(params)
				.on("httpUploadProgress", (evt) => {
					// File uploading progress
					console.log(
						`Uploading ${(evt.loaded * 100) / evt.total}%`
					);
				})
				.promise();

			upload.then((data) => {
				console.log("================\n", "data: ", data, "\n================");
				alert("File uploaded successfully.");
			});
		}
	}, [files]);

	return (
		<div className="border-2 rounded-lg p-5">
			{files.length ? <Label> Selected files: </Label> : null}
			{files.map((file, i) => (
				<div key={file?.name ?? `key-${i}`} style={{ color: "green", fontWeight: "bold" }}>
					<Label>{file.name}</Label>
				</div>
			))}
			{files.length ?
				<Button
					onClick={() => uploadFiles()}
					className="mt-3 mr-0 ml-auto block">Upload</Button> : null}
			<div style={{ marginTop: 20 }}></div>
			<div className="flex flex-col" id="drop_zone" onDrop={onDropHandler} onDragOver={onDragOver}>
				<div className="text-center">Drop file here or</div>
				<Label className="border-2 rounded p-2 mt-3" htmlFor={"file_picker"}>Click to select file</Label>
				<input
					id="file_picker"
					className="hidden"
					type="file"
					accept="image/png, image/jpeg"
					onChange={(ev) => {
						const file = ev.target?.files?.[0];
						if (!file) return
						setFiles([...files, file]);
					}}
				></input>
			</div>
		</div>
	);
};
