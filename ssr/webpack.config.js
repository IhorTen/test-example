var webpack = require("webpack")
var version = require("../version")

var config = {
	mode: "production",
    target: "node",
    node: {
		__dirname: false,
		__filename: false,
	},
	entry: __dirname + "/index.tsx",
	output: {
		path: __dirname,
		filename: `dist/index.js`
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "awesome-typescript-loader?configFileName=tsconfig.server.json",
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				enforce: "pre",
				loader: "source-map-loader"
			},
			{
				test: /\.html$/,
				loader: "html-loader"
			},
			{
				test: /\.(svg|woff|woff2|ttf|otf|png|jpg)$/,
				loader: "url-loader"
			},
			{
				test: /\.(css|sass)$/,
				loader: "ignore-loader"
			}
		]
	},
	resolve: {
		modules: [
			"node_modules",
			`${__dirname}/../src`
		],
		extensions: [".js", ".jsx", ".sass", ".json", ".css", ".ts", ".tsx"]
	},
	parallelism: 2,
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
		new webpack.DefinePlugin({
			"ENV": JSON.stringify("server"),
			"process.env.ENV": JSON.stringify("server"),
			"process.env.VERSION": JSON.stringify(version.v()),
			"process.env.NODE_ENV": JSON.stringify("production"),
			"global.GENTLY": false
		})
	]
}

module.exports = config