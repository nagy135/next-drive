"use client";

import { Upload } from '@aws-sdk/lib-storage';
import { useCallback, useState } from "react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { Switch } from "~/components/ui/switch";
import { getS3Client } from "~/lib/s3";
import { scaleImageBeforeUpload } from "~/lib/image";
import { api } from "~/trpc/react";

export default function FileUploader() {
	const [files, setFiles] = useState<File[]>([]);
	const [publicSwitch, setPublicSwitch] = useState(true);
	const [uploadProgress, setUploadProgress] = useState(0);
	const createFileMutation = api.file.create.useMutation({
		onSuccess: () => {
			setFiles([]);
			location.reload();
		}
	});

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


	const uploadFiles = useCallback(async () => {

		const s3 = getS3Client();

		for (const file of files) {
			console.log("[INFO] uploading: ", file);
			const params = {
				Bucket: process.env.NEXT_PUBLIC_S3_BUCKET ?? "",
				Key: file.name,
				Body: file,
				ContentType: file.type,
			};

			const upload = new Upload({
				client: s3,
				params
			});

			upload.on("httpUploadProgress", (progress) => {
				setUploadProgress(Math.round((progress.loaded! * 100) / progress.total!));
			});


			await upload.done();
			createFileMutation.mutate({
				name: file.name,
				makePublic: publicSwitch,
			})
			console.log("[INFO] uploaded successfuly: ", file);

			const resized = await scaleImageBeforeUpload(file, { width: 100, height: 100 });
			if (!resized) {
				console.error("Failed to resize image");
				return;
			}
			const resizedParams = {
				Bucket: process.env.NEXT_PUBLIC_S3_BUCKET ?? "",
				Key: `resized/${file.name}`,
				Body: resized,
				ContentType: file.type,
			};

			const uploadResized = new Upload({
				client: s3,
				params: resizedParams
			})

			await uploadResized.done();
			console.log("[INFO] resized uploaded successfuly: ", file);
		}
	}, [files, setUploadProgress, publicSwitch]);

	return (
		<div className="border-2 rounded-lg p-5">
			{files.length ? <Label> Selected files: </Label> : null}
			{files.map((file, i) => (
				<div key={file?.name ?? `key-${i}`} style={{ color: "green", fontWeight: "bold" }}>
					<Label>{file.name}</Label>
				</div>
			))}
			{files.length ?
				<div>
					<div className="flex items-center mt-3 space-x-2">
						<Switch checked={publicSwitch} onCheckedChange={() => setPublicSwitch(e => !e)} id="airplane-mode" />
						<Label htmlFor="airplane-mode">Public</Label>
					</div>
					<Button
						onClick={() => uploadFiles()}
						className="mt-3 mr-0 ml-auto block">Upload</Button>
					<Progress value={uploadProgress} max={100} className="w-full mt-3"></Progress>
				</div>
				: null}
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
