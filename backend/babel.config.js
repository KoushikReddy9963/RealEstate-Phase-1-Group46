export default {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current'
            },
            modules: 'auto' // Changed from false to auto
        }]
    ],
    env: {
        test: {
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        node: 'current'
                    },
                    modules: 'auto'
                }]
            ]
        }
    }
};