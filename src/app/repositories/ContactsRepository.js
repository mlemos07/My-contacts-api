const db = require('../../database');

class ContactsRepository {
  async create({
    name, email, phone, category_id,
  }) {
    const [row] = await db.query(`
      INSERT INTO contacts(name, email, phone, category_id)
      VALUES($1, $2, $3, $4)
      RETURNING *
      `, [name, email, phone, category_id]);
    return row;
  }

  async update(id, {
    name, email, phone, category_id,
  }) {
    const [row] = await db.query(`
      UPDATE contacts
      SET name = $1, email = $2, phone = $3, category_id = $4
      WHERE id = $5
      RETURNING *
    `, [name, email, phone, category_id, id]);
    return row;
  }

  async findAll(orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(`
      SELECT contacts.*, categories.name AS category_name
      FROM contacts
      LEFT JOIN categories ON contacts.category_id = categories.id
      ORDER BY name ${direction}`);
    const newRows = rows.map((currentRow) => {
      const { category_id, category_name, ...removedProps } = currentRow;
      return ({
        ...removedProps, category: {
          id: currentRow.category_id,
          name: currentRow.category_name,
        }
      })
    });
    return newRows;
  }

  async findByEmail(email) {
    const [row] = await db.query(`
      SELECT contacts.*, categories.name AS category_name
      FROM contacts
      LEFT JOIN categories ON contacts.category_id = categories.id
      WHERE contacts.email = $1`,
      [email]);
    const { category_id, category_name, ...newRows } = row;
    return ({
      ...newRows, category: {
        id: row.category_id,
        name: row.category_name,
      }
    })
  }

  async findById(id) {
    const [row] = await db.query(`
      SELECT contacts.*, categories.name AS category_name
      FROM contacts
      LEFT JOIN categories ON contacts.category_id = categories.id
      WHERE contacts.id = $1`,
      [id]);
    const { category_id, category_name, ...removedProps } = row;
    return ({
      ...removedProps, category: {
        id: row.category_id,
        name: row.category_name,
      }
    })
  }

  delete(id) {
    const deleteOp = db.query('DELETE FROM contacts WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ContactsRepository();
