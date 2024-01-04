const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/user',
        createProxyMiddleware({
            target: 'http://backend:8080',
            changeOrigin: true,
            cookieDomainRewrite: 'localhost',
            pathRewrite: {
                '^/user': '/user',
            },
        })
    );
    app.use(
        '/device',
        createProxyMiddleware({
            target: 'http://backend:8080',
            changeOrigin: true,
            cookieDomainRewrite: 'localhost',
            pathRewrite: {
                '^/device': '/device',
            },
        })
    );
    app.use(
        '/message',
        createProxyMiddleware({
            target: 'http://backend:8080',
            changeOrigin: true,
            cookieDomainRewrite: 'localhost',
            pathRewrite: {
                '^/message': '/message',
            },
        })
    )
};
