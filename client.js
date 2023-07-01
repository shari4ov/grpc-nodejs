const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader')
const packageDef = protoLoader.loadSync("todo.proto",{})
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:4040",grpc.credentials.createInsecure())
const message = process.argv[2]
client.createTodo({id: -1, text: message},(err,resp)=> {
    if (err!=null) {
        console.error(`Received from server ${err}`)
    }
    console.log("Received from server createTodo", resp)
})

client.readTodos({},(err,resp)=> {
    if (err!=null) {
        console.error(`Received from server ${err}`)
    }
    console.log("readTodos items: ", resp.items)
})

const call = client.readTodosStream();

call.on("data",item => {
    console.log(`received item from server stream`, item);
})

call.on("end", e => console.log("Server done"))