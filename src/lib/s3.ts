import { S3, config } from "aws-sdk";

let s3: S3 | undefined = undefined;

export const getS3Client = () => {
	if (!s3) {
		config.update({
			accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
			secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
		});

		s3 = new S3({
			params: { Bucket: process.env.NEXT_PUBLIC_S3_BUCKET },
			region: process.env.NEXT_PUBLIC_S3_REGION,
			signatureVersion: "v4",
		});
	}
	return s3;

};
