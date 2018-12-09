/**
 * @author nuer
 * @time 20151218
 */

fis.set('charset', 'utf-8');        // 文件编码;
fis.set('namespace', 'es6');     // 模块命名空间;
// fis.set('map_file', '/src/widget/resource-map/resource-map.js');    // 给 resourceMap 找个地儿;


// fis.hook('commonjs', {
//     extList: ['.js', '.jsx', '.es', '.ts', '.tsx']
// });
// 设置成是模块化 js, 编译后会被 define 包裹。
fis.match('/modules/(**.js)', {
    isMod: true,
    parser: resolveRequire
});
fis.match('!/modules/**.{js, json, map}', {
    release: false
});
fis.match('/modules/**{package, package-lock}.json', {
    release: false
});

// fis.unhook('components');
// fis.hook('node_modules');

var resolve = require('resolve');
var path = require('path');
var config = {
    basedir: fis.project.getProjectPath()
    ,moduleDirectory: ['modules', 'node_modules']
}
function resolveRequire(content,file){
    return content.replace(/require\("([a-zA-Z\-_\/\d\.]+)"\)/g, function(match, group){
        var conf = {};
        if(/^\.\.?\/?/.test(group)){
            conf.basedir = file.dirname;
        }
        var realPath = resolve.sync( group, { basedir : conf.basedir || config.basedir,  moduleDirectory: config.moduleDirectory } );
        // console.log('[real path]', realPath);
        var relative = path.relative( config.basedir, realPath);
        // console.log('[relative path]', relative);
        return 'require("es6:'+relative+'")';
    });
}