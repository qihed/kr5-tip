const fs = require('fs');
const path = require('path');

const contactsFilePath = path.join(__dirname, '../data/contacts.json');

// Вспомогательная функция для чтения контактов из файла
const readContacts = () => {
  try {
    const data = fs.readFileSync(contactsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Вспомогательная функция для записи контактов в файл
const writeContacts = (contacts) => {
  fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8');
};

// Получить все контакты (с поддержкой поиска через query параметры)
const getAllContacts = (req, res) => {
  let contacts = readContacts();
  
  // Обработка query параметра search
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    contacts = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.phone.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm)
    );
  }
  
  res.json({
    success: true,
    count: contacts.length,
    data: contacts
  });
};

// Получить контакт по ID (используя req.params)
const getContactById = (req, res) => {
  const contacts = readContacts();
  const id = parseInt(req.params.id);
  
  const contact = contacts.find(c => c.id === id);
  
  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Контакт не найден'
    });
  }
  
  res.json({
    success: true,
    data: contact
  });
};

// Создать новый контакт (обработка тела запроса через express.json())
const createContact = (req, res) => {
  const contacts = readContacts();
  const { name, phone, email, address } = req.body;
  
  // Валидация обязательных полей
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Имя и телефон являются обязательными полями'
    });
  }
  
  // Генерация нового ID
  const newId = contacts.length > 0 
    ? Math.max(...contacts.map(c => c.id)) + 1 
    : 1;
  
  const newContact = {
    id: newId,
    name,
    phone,
    email: email || '',
    address: address || ''
  };
  
  contacts.push(newContact);
  writeContacts(contacts);
  
  res.status(201).json({
    success: true,
    message: 'Контакт успешно создан',
    data: newContact
  });
};

// Обновить контакт по ID
const updateContact = (req, res) => {
  const contacts = readContacts();
  const id = parseInt(req.params.id);
  
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Контакт не найден'
    });
  }
  
  const { name, phone, email, address } = req.body;
  
  // Обновление полей контакта
  if (name) contacts[contactIndex].name = name;
  if (phone) contacts[contactIndex].phone = phone;
  if (email !== undefined) contacts[contactIndex].email = email;
  if (address !== undefined) contacts[contactIndex].address = address;
  
  writeContacts(contacts);
  
  res.json({
    success: true,
    message: 'Контакт успешно обновлен',
    data: contacts[contactIndex]
  });
};

// Удалить контакт по ID
const deleteContact = (req, res) => {
  const contacts = readContacts();
  const id = parseInt(req.params.id);
  
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Контакт не найден'
    });
  }
  
  const deletedContact = contacts.splice(contactIndex, 1)[0];
  writeContacts(contacts);
  
  res.json({
    success: true,
    message: 'Контакт успешно удален',
    data: deletedContact
  });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};

