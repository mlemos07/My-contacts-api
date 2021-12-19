const categoriesRepository = require('../repositories/CategoriesRepository');

class CategoryController {
  async index(request, response) {
    const categories = await categoriesRepository.findAll();
    return response.json(categories);
  }

  async store(request, response) {
    const { name } = request.body;
    if (!name) {
      return response.status(400).send({ error: 'Name is required' });
    }
    const categoryAlreadyExists = await categoriesRepository.findByName(name);
    if (categoryAlreadyExists) {
      return response.status(400).send({ error: 'Category already exists' });
    }
    const category = await categoriesRepository.create(name);

    return response.json(category);
  }
}

module.exports = new CategoryController();
