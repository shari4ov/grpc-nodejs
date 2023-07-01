const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader')
const packageDef = protoLoader.loadSync("todo.proto",{})
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server()
server.bindAsync("0.0.0.0:4040",grpc.ServerCredentials.createInsecure(),(err,port)=>{
    if (err!=null) {
        console.log(err);
    }
    console.log(port);
    server.start()

});

server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readTodos": readTodos,
    "readTodosStream": readTodosStream
});
const todos = []
function createTodo(call,cb) {
    console.log(`Request`, call.request);
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem)
    cb(null,todoItem)
}
function readTodos(call,cb) {
    console.log(call);
    cb(null,{"items": todos});
}

function readTodosStream(call,cb) { 
    todos.forEach(t => call.write(t))
    call.end()
}
