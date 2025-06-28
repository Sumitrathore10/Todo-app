import { Todo } from "../models/todo.model.js";

export const createTodo = async (req,res) => {
try {
    const {title, description} = req.body;
    if(!title || !description){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    const todo = await Todo.create({
        title,
        description,
    });
    return res.status(201).json({
        success:true,
        message:"Todo created successfully"
    })
} catch (error) {
    res.status(500).json({
        success:false,
        message:error.message
    })
    console.error(error);
}
}

export const getTodos = async (req,res)=>{
    try {
        const todos = await Todo.find();
        return res.status(200).json({
            success:true,
            todos
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
        console.error(error);
    }
}

export const updateTodo = async (req, res) => {
    try {
        const todoid = req.params.id;
        const {title, description} = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(todoid,{title,description},{new:true});
        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            Todo : updatedTodo
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        console.error(error);
    }
}

export const deleteTodo = async (req,res)=>{
    try {
        const todoid = req.params.id;
        const todo = await Todo.findByIdAndDelete(todoid);
        if(!todo){
            return res.status(404).json({
                success:false,
                message:"Todo not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Todo deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
        console.error(error)
    }
}