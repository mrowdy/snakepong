requirejs.config({
    baseUrl: 'src'
});

requirejs(['snakepong'],
    function   (Snakepong) {
    console.log('main loaded');
});