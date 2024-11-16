export const MOCKS = {
  MOCKUSER: {
    _id: '507f1f77bcf86cd799439011',
    auth0Id: 'auth0|1234567890',
    username: 'JohnDoe',
    email: 'john@example.com',
    expenses: [],
  },
  VALIDUSERINPUT: {
    auth0Id: 'auth0|1234567890',
    username: 'JohnDoe',
    email: 'john@example.com',
  },
  INCOMPLETEUSER: {
    username: 'JohnDoe',
  },
  MOCKEXPENSE: {
    title: 'jest test expense',
    cost: 5,
    type: 'OTHER',
  },
  VALIDEXPENSEINPUT: {
    title: 'jest test expense',
    cost: 5,
  },
  INCOMPLETEEXPENSE: {
    title: 'wrong test input',
  },
};
