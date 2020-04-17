const CommonRepository = require('../repositories/commonRepository');
const pgPool = require('../config/pgPool');

const Repo = new CommonRepository('users', pgPool);


describe('Common Repository performs CRUD', () => {

  describe('CRUD', () => {
    const data = {
      first_name: 'Dina',
      last_name: 'Rose',
      email: 'dinaRose@test.com',
      password: '12345678'
    };

    const data2 = {
      first_name: 'Major',
      last_name: 'Player',
      email: 'majorPlayer@test.com',
      password: '12345678'
    };

    let record;

    beforeEach(async () => {
      record = await Repo.create(data);
      await Repo.create(data2);
    });

    afterEach(async () => {
      await Repo.deleteRow('email', data.email);
      await Repo.deleteRow('email', data2.email);
    });

    it('findbyId: shows that the row was created and retrieved', async () => {
      expect(data.first_name).toBe(record.first_name);
      const result = await Repo.findById(record.id);
      expect(result.id).toBe(record.id);
      expect(record.first_name).toBe(result.first_name);
    });

    it('all: should retrieve all records', async () => {
      const rows = await Repo.all();
      expect(rows.length).toBeGreaterThan(1);
      const sameRecord = rows.find(row => row.id === record.id);
      expect(sameRecord.email).toBe(record.email);
    });

    it('delete: should successfully delete records', async () => {
      const result = await Repo.deleteRow('email', data.email);
      expect(result).toBe(1);
    });

    it('update: should successfully update records', async () => {
      const result = await Repo.update({
        email: data.email
      }, {
        first_name: 'Mellisa'
      });
      expect(record.id).toBe(result.id);
      expect(record.last_name).toBe(result.last_name);
      expect(result.first_name).toBe('Mellisa');
    });

    it('it finds objects by two or more fields', async () => {
      const result = await Repo.findByTwoOrMoreFields({
        first_name: 'Dina',
        last_name: 'Rose'
      });
      expect(result[0].first_name).toBe('Dina');
    });

    it('It updates the row based on the two supplied criteria', async () => {
      const result = await Repo.updateAnd({
        first_name: 'Dina',
        last_name: 'Rose'
      }, { last_name: 'Rose updated' });

      expect(result.last_name).toBe('Rose updated');
    });

  });
});