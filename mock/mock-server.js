const chokidar = require('chokidar') // 檢查資料夾變動
const bodyParser = require('body-parser')
const Mock = require('mockjs')
const path = require('path')
const chalk = require('chalk')  // console樣式

const mockDir = path.join(process.cwd(), 'mock')

// 註冊路由到express
function registerRoutes(app) {
    let mockLastIndex
    const { default: mocks } = require('./index.js')
    const mocksForServer = mocks.map(route => {
        return responseFake(route.url, route.type, route.response)
    })
    for (const mock of mocksForServer) {
        app[mock.type](mock.url, mock.response)
        // express 4.x app._router.stack get all registered routes
        mockLastIndex = app._router.stack.length
    }
    const mockRoutesLength = Object.keys(mocksForServer).length
    return {
        mockRoutesLength: mockRoutesLength,
        mockStartIndex: mockLastIndex - mockRoutesLength
    }
}

// for mock server
const responseFake = (url, type, respond) => {
    return {
        url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
        type: type || 'get',
        response(req, res) {
            console.log('request invoke:' + req.path)
            res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
        }
    }
}

function unregisterRoutes() {
    Object.keys(require.cache).forEach(i => {
        if (i.includes(mockDir)) {
            delete require.cache[require.resolve(i)]
        }
    })
}


module.exports = app => {
    // es6 polyfill
    require('@babel/register')

    // parse app.body
    // https://expressjs.com/en/4x/api.html#req.body
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    const initMockStartIndex = app._router.stack.length
    const mockRoutes = registerRoutes(app)
    var mockRoutesLength = mockRoutes.mockRoutesLength
    var mockStartIndex = mockRoutes.mockStartIndex

    // watch files, hot reload mock server
    chokidar.watch(mockDir, {
        ignored: /mock-server.js/,
        ignoreInitial: true
    }).on('all', (event, path) => {
        if (event === 'change' || event === 'add') {
            try {
                // remove mock routes stack
                app._router.stack.splice(initMockStartIndex, mockRoutesLength)

                // clear routes cache
                unregisterRoutes()
                
                const mockRoutes = registerRoutes(app)
                mockRoutesLength = mockRoutes.mockRoutesLength
                mockStartIndex = mockRoutes.mockStartIndex
                const newRoutes = app._router.stack.splice(mockStartIndex, mockRoutesLength)
                app._router.stack.splice(initMockStartIndex, 0, ...newRoutes)

                console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
            } catch (error) {
                console.log(chalk.redBright(error))
            }
        }
    })
}