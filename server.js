const express = require("express");

const app = express();

app.use(express.json());

let orders = [];


// criar pedido
app.post("/order", (req,res)=>{

    const data = req.body;

    // impedir duplicado
    const exists = orders.find(o => o.orderId === data.numeroPedido);

    if (exists) {
        return res.status(400).json({ message: "Pedido já existe" });
    }

    const order = {
        orderId: data.numeroPedido,
        value: data.valorTotal,
        creationDate: data.dataCriacao,
        items: data.items.map(item => ({
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };

    orders.push(order);

    res.status(201).json(order);
});


// listar pedidos
app.get("/order/list",(req,res)=>{
    res.json(orders);
});


// buscar pedido
app.get("/order/:id",(req,res)=>{

    const order = orders.find(o => o.orderId === req.params.id);

    if(!order){
        return res.status(404).json({message:"Pedido não encontrado"});
    }

    res.json(order);
});


// deletar pedido
app.delete("/order/:id",(req,res)=>{

    const index = orders.findIndex(o => o.orderId === req.params.id);

    if(index === -1){
        return res.status(404).json({message:"Pedido não encontrado"});
    }

    orders.splice(index,1);

    res.json({message:"Pedido deletado com sucesso"});
});


app.listen(3000,()=>{
    console.log("Servidor rodando na porta 3000");
});
