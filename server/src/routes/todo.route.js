import { Router } from 'express';
import { createTodo, getTodos , updateTodo , deleteTodo} from '../controllers/todo.controller.js';
import isAuthenticated from '../middleware/authentication.middleware.js';
// 
const router = Router()

router.route('/todoCreation').post(isAuthenticated , createTodo);
router.route('/').get(isAuthenticated , getTodos);
router.route('/:id').put(isAuthenticated , updateTodo).delete(isAuthenticated , deleteTodo); 

export default router;