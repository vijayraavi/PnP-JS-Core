var path = require("path"),
    webpack = require('webpack');

module.exports = {
    // serve config
    cache: true,
    entry: './src/pnp.ts',
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/assets/",
        filename: "pnp.js",
        libraryTarget: "umd",
        library: "$pnp"
    },
    devtool: "source-map",
    resolve: {
        enforceExtension: false,
        extensions: ['.ts']
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/\.\.\/net\/nodefetchclient/, "../net/nodefetchclientbrowser"),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    "babel-loader",
                    "ts-loader"
                ],
            },
        ]
    }
};
