const { createStore, applyMiddleware, combineReducers } = require('redux');
const { auto, reducers } = require('redux-auto');
const path = require('path');
const fs = require('fs');
// var storePath = path.join(path.dirname(fs.realpathSync(__filename)), 'store');
function nodeModules(storePath){

  let files = [];

  const webpackModules       = function(path){ return require(storePath+"/"+path) }
        webpackModules.keys  = () => files

        webpackModules.set = function(storeName,actionFileName){
          files.push(`./${storeName}/${actionFileName}`);
          return files;
        }

  fs.readdirSync(storePath,{withFileTypes:true}).forEach(dirent => {
    if(dirent.isDirectory()){
      fs.readdirSync(storePath+"/"+dirent.name).forEach(actionName => {
        if('_' !== actionName[0]){
          webpackModules.set(dirent.name,actionName)
        }
      })
    }
  })

  return webpackModules
}

const storePath = path.join(path.dirname(fs.realpathSync(__filename)), 'store');
const webpackModules = nodeModules(storePath)
const middleware = applyMiddleware( auto(webpackModules, webpackModules.keys()))
const store = createStore(combineReducers(reducers), middleware );
const callbacks = []

module.exports = function listen(callback){
  callbacks.push(callback)
}

const unsubscribe = store.subscribe(() => {
  const newState = store.getState()
  callbacks.forEach(callback => callback(newState))
})
