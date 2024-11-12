import { Router } from 'express';
import { ExpenseController } from './expense.controller';
import { CreateExpenseDTO } from './expense.dto';
import {
  validateContentType,
  validateDTO,
  validateObjectId,
} from '@/middleware/validation.middleware';

export const createExpenseRouter = (expenseController: ExpenseController) => {
  const router = Router();

  router.get('/', expenseController.sayHi);
  router.post(
    '/',
    validateContentType,
    validateDTO(CreateExpenseDTO),
    expenseController.createExpense
  );
  router.get('/:id', validateObjectId, expenseController.getExpenseById);

  return router;
};
