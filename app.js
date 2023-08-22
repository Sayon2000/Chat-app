const http = require('http');
const fs = require('fs')


const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('message.txt' , (err , data)=>{
            if(err){
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Internal Server Error');
            }

            let result = '<html><head><title>chat app</title></head>' +
            '<body><p>' + data +'<form action="/message" method="POST"><input type="text" name="message"/> <button type="submit" >send</button> </form></body></html>'
            return res.end(result)
        })

    }
    if (req.url === '/message' && req.method === 'POST') {

        const body = []
        req.on('data', (chunk) => {
            body.push(chunk);
        })
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1]
            fs.writeFile('message.txt', message , (err)=>{
                if(err)
                    console.log(err)
            })
            res.statusCode = 302
            res.setHeader('location', '/')
            return res.end()
        })

    }
})
server.listen(4000)