import * as cdk from 'aws-cdk-lib';
import { Effect, PolicyStatement, StarPrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here

		const bucket = new Bucket(this, 'next-drive-bucket', {
			bucketName: 'nagy135-next-drive-bucket',
			versioned: true,
			cors: [{
				allowedOrigins: ['*'],
				allowedHeaders: ['*'],
				allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE],
			}],
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			blockPublicAccess: {
				blockPublicAcls: true,
				ignorePublicAcls: true,
				restrictPublicBuckets: false,
				blockPublicPolicy: false,
			}
		});
		bucket.addToResourcePolicy(
			new PolicyStatement({
				actions: ['s3:GetObject'],
				effect: Effect.ALLOW,
				principals: [new StarPrincipal()],
				resources: [bucket.arnForObjects('*')],
			})
		)

	}
}
