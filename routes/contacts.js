const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} = require('../controllers/contactsController');

// GET /api/contacts - получить все контакты (с поддержкой ?search=...)
router.get('/', getAllContacts);

// GET /api/contacts/:id - получить контакт по ID
router.get('/:id', getContactById);

// POST /api/contacts - создать новый контакт
router.post('/', createContact);

// PUT /api/contacts/:id - обновить контакт
router.put('/:id', updateContact);

// DELETE /api/contacts/:id - удалить контакт
router.delete('/:id', deleteContact);

module.exports = router;

