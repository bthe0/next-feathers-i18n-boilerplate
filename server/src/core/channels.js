/**
 * Note this file should only be used
 * if requiring socket integration
 *
 * @param app
 */

module.exports = app => {
    if (typeof app.channel !== 'function') {
        return;
    }

    app.on('connection', connection => {
        app.channel('anonymous').join(connection);
    });

    app.on('login', (authResult, {connection}) => {
        if (connection) {
            app.channel('anonymous').leave(connection);
            app.channel('authenticated').join(connection);
        }
    });

    app.publish((data, hook) => {
        return app.channel('authenticated');
    });
};
