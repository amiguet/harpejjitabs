module.exports = {
    publicPath: '/harpejjitabs/',
    pwa: {
        name: 'Harpejji Tabs',
        appleMobileWebAppCapable: 'yes',
        iconPaths: {
            favicon16: 'img/icons/favicon16.png',
            favicon32: 'img/icons/favicon32.png',
            appleTouchIcon: 'img/icons/favicon512.png',
            maskIcon: 'img/icons/favicon.svg',
            msTileImage: 'img/icons/favicon144.png'
        },
        themeColor: "#000000",
        msTileColor: "#FFFFFF"
    },
    chainWebpack: config => {
        config.plugins.delete('prefetch');
        config.plugins.delete('preload');
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Harpejji Tabs';
                return args
            });
    }
};