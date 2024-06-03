/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'nagy135-next-drive-bucket.s3.eu-north-1.amazonaws.com',
				port: '',
				pathname: '/**/*',
			},
		],
	},
};

export default config;
