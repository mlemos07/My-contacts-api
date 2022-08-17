const contactsRepository = require('../repositories/ContactsRepository');
const isValidUUID = require('../utils/isValidUUID');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await contactsRepository.findAll(orderBy);
    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact id.' });
    }
    const contact = await contactsRepository.findById(id);
    if (!contact) {
      return response.status(404).json({ error: 'Contact not found.' });
    }
    const { category_id, category_name, ...removedProps } = contact;
    return response.json({
      ...removedProps,
      category: {
        id: category_id,
        name: category_name,
      },
    });
  }

  async store(request, response) {
    const {
      name, email, phone, category_id,
    } = request.body;
    if (!name) {
      return response.status(400).json({ error: 'Name is required.' });
    }
    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid category' });
    }
    if (email) {
      const contactAlreadyExists = await contactsRepository.findByEmail(email);
      if (contactAlreadyExists) {
        return response.status(400).json({ error: 'Contact already exists' });
      }
    }
    const contact = await contactsRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });
    return response.status(201).json(contact);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, email, phone, category_id,
    } = request.body;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact id.' });
    }
    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid category' });
    }
    if (!name) {
      return response.status(400).json({ error: 'Name is required.' });
    }
    const contactExists = await contactsRepository.findById(id);
    if (!contactExists) {
      return response.status(404).json({ error: 'Contact not found.' });
    }
    if (email) {
      const contactAlreadyExists = await contactsRepository.findByEmail(email);
      if (contactAlreadyExists && contactAlreadyExists.id !== id) {
        return response.status(400).json({ error: 'Contact already exists' });
      }
    }
    const contact = await contactsRepository.update(id, {
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });
    return response.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;
    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact id' });
    }
    await contactsRepository.delete(id);
    return response.sendStatus(204);
  }
}

module.exports = new ContactController();
