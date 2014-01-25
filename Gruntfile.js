module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9001,
                    hostname: '192.168.82.103',
                    base: 'src',
                    keepalive: true
                }
            }
        }
    });

    grunt.registerTask('default', [
        'connect'
    ]);
};
