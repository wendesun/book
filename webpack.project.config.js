// 新的项目名(可以是一个路径，也可以是string)
var  projectName = 'book';

var options = {
    projectName: projectName,
    // 配置每个页面的来源与模块依赖
    pages: [
        {
            from: "./book/index",
            /*html来源相对于root目录,建议放置在html文件夹中，可以细分到各个文件夹*/
            to: "./" + projectName + "/index",
            /*最后服务器访问的html地址*/
            required: ['book_entry']
            /*这是该页面依赖的模块@Array（entry中的模块名）*/
        }
    ],
    entry: {
             'book_entry': "./book/entry/main.js"
    },
    imagesLimit:1024,
    fontsLimit:10240,
};

module.exports = options
