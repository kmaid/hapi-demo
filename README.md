# hapi-demo
A test project for the hapi framework 

# Webstorm Setup 
https://www.jetbrains.com/help/webstorm/2016.1/transpiling-typescript-to-javascript.html#d240690e50 
    Ubuntu Compiler Dir = /usr/local/lib/node_modules/typescript/lib
    
npm install -g typescript #install typescript 
npm install typings --global #Add type def for Hapi 
typings install dt~hapi --global --save
typings install dt~node --global --save
typings install dt~mocha --global --save