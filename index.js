var http = require('http');
var fs = require('fs');
var qs = require('querystring');

http.createServer(function(req, res){
    switch(req.method){
        
        case 'GET': 
            if(req.url === '/nodeJS_REST'){
                res.writeHead(200, {'Content-Type': "text/html"});
                res.end(`
                        <h1>Wellcome to my Users System</h1>`
                );          
            }else{
                if(req.url === '/nodeJS_REST/users'){
                    fs.readFile('names.json', function(err, data){
                        if(err){
                            throw new Error(err);
                        }
                        var names = JSON.parse(data);
                        var listOfNames = [];
                        for(var i = 0; i < names.length; i++){
                            listOfNames.push(`<p>${names[i]}</p>`);
                        }
                        res.writeHead(200, {'Content-Type': "text/html"});
                        res.end(`
                                <h1>All Users:</h1>
                                <div>${listOfNames.join("")}</div>`
                        );           
                    });
                }else{
                var UserPatters = "[0-9]+"
                var patt = new RegExp('/nodeJS_REST/users/' + UserPatters);
                if(patt.test(req.url)){
                    fs.readFile('names.json', function(err, data){
                        if(err){
                            throw new Error(err);
                        }
                        var Newpatt = new RegExp(UserPatters);
                        var userID = Newpatt.exec(req.url);
                        var names = JSON.parse(data);
                        if(names[userID[0]] == undefined){
                            console.log('undifiend user');
                            res.writeHead(200, {'Content-Type': "text/html"});
                            res.end(`
                                <h1>a User:</h1>
                                <div><p>user doesn't exist</p></div>`
                        ); 
                        }else{
                            res.writeHead(200, {'Content-Type': "text/html"});
                            res.end(`
                                <h1>a User:</h1>
                                <div><p>${names[userID[0]]}</p></div>`
                           ); 
                        }
                    })
                }    
            }
        }
            break;
            
        case 'POST':
            if(req.url === '/nodeJS_REST/users'){
                var body = '';
                req.on('data', function(data){
                    body += data;                    
                })
                req.on('end', function(){
                    var post = qs.parse(body);
                    if (post.name !== ""){
                        fs.readFile('names.json', function(err, data){
                            if(err){
                                throw new Error(err);
                            }
                            var names = JSON.parse(data);
                            names.unshift(post.name);
                            fs.writeFile('names.json',JSON.stringify(names), function(err){
                                if(err){
                                    throw new Error(err);
                                } 
                            })
                        });                           
                        res.writeHead(201, {'Content-Type': "text/html"});
                        res.end(`
                             <h1>New User:</h1>
                             <div><p>User named ${post.name} successfully added</p></div>`
                        );
                    }else{
                        res.writeHead(200, {'Content-Type': "text/html"});
                        res.end(`
                             <h1>New Users:</h1>
                             <div><p>please fill up user's name</p></div>`
                        );                        
                    }
                })
            }             
            break;
            
        case 'DELETE':
            var UserPatters = "[0-9]+"
            var patt = new RegExp('/nodeJS_REST/users/' + UserPatters);
            if(patt.test(req.url)){
                fs.readFile('names.json', function(err, data){
                    if(err){
                        throw new Error(err);
                    }
                    var Newpatt = new RegExp(UserPatters);
                    var userID = Newpatt.exec(req.url);
                    var names = JSON.parse(data);
                    if(names[userID[0]] == undefined){
                        console.log('undifiend user');
                        res.writeHead(200, {'Content-Type': "text/html"});
                        res.end(`
                            <h1>Delete User:</h1>
                            <div><p>user doesnt exist</p></div>`
                        ); 
                    }else{
                        var name = names[userID[0]];
                        names.splice(userID[0], 1);
                        fs.writeFile('names.json',JSON.stringify(names), function(err){
                            if(err){
                                throw new Error(err);
                            } 
                        })
                        res.writeHead(200, {'Content-Type': "text/html"});
                        res.end(`
                            <h1>Delete User:</h1>
                            <div><p>the user named ${name} was successfully deleted</p></div>`
                        ); 
                    };
                })
                break;    
            }
    }    
}).listen(3000);

