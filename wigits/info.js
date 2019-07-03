const os = require('os');
const contrib = require('blessed-contrib')
function builder(label,grid,y,x,height, width){
  const info = {
    os:process.platform+ " "+os.release() + " " + os.arch(),
    cpus:os.cpus()[0].model + " - x" + os.cpus().length +" cores"
  }
  3, 0, 1, 2
  var markdown = grid.set(y,x,height, width,contrib.markdown)

  return function inputLine(line){


        if(line.message.startsWith("MongoDB starting")){

        //  markdown.setMarkdown(line.message)

          Object.assign(info,
          line.message.slice("MongoDB starting : ".length)
          .split(" ")
          .map(par => par.split("="))
          .filter(x=>2==x.length)
          .reduce((all,[name,val])=>{
              all[name] = val
              return all
          },{}))

        }else if(line.message.startsWith("db version")){
          info.version = line.message.split(" ").pop()
        }else if(line.message.startsWith("git version")){
          info.commit = line.message.split(" ").pop()
        }else if(line.message.startsWith("options:")){
          const options =
        //  Object.assign(info,
            JSON.parse(
              line.message.slice("options:".length)
                          .split(":")
                          .map((x,i,{length})=>{
                          if(i+1 === length) return x
                                const inde = x.lastIndexOf(" ")
                                return x.substr(0,inde) + '"' + x.substr(inde+1) + '"';
                                })
                          .join(":")
              )// END JSON.parse
           // )// Object.assign

           options.net.bindIp.split(",").forEach((bindIp,i)=> info[`bindIp ${i}`] = bindIp)

        } // END options:






        markdown.setMarkdown(Object.keys(info).reduce((txt,infoName)=>{
                                if("version"===infoName){
                                  txt += `**mongo** ► ${info[infoName]}`
                                }else {
                                  txt += `**${infoName}** ► ${info[infoName]}`
                                }

                                return txt + "\n"
                              },""))


  }
}

module.exports = builder
