
import { S3Client } from "@aws-sdk/client-s3";

import { XhrHttpHandler } from '@aws-sdk/xhr-http-handler';

let client: S3Client | undefined = undefined;

export const getS3Client = () => {
	if (!client) {

		client = new S3Client({
			requestHandler: new XhrHttpHandler({}),
			region: process.env.NEXT_PUBLIC_S3_REGION,
			credentials: {
				accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
				secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
			}
		});
	}
	return client;

};
