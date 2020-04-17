const QueryBuilder = require('../queryBuilders');

describe('The where queries', () => {
  let qB;
  beforeEach(() => {
    qB = new QueryBuilder('users');
  });

  it('the instance has certain methods', () => {
    expect(Reflect.has(qB, 'select')).toBe(true);
    expect(Reflect.has(qB, 'updateHelper')).toBe(true);
  });

  it('select produces the appropriate query but without semi-colon', () => {
    const query = qB.select();
    const query2 = qB.select(['name', 'email']);
    expect(query).toBe('SELECT * FROM users');
    expect(query2).toBe('SELECT name,email FROM users');
  });

  it(':selectwhere produces comma separated strings of key=$n pairs', () => {
    const query1 = qB.selectWhere({ a: 1 });
    const query2 = qB.selectWhere({ a: 1 }, ['name', 'email']);
    const query3 = qB.selectWhereAnd({ a: 1, b: 2 });
    const query4 = qB.selectWhereOr({ a: 1, b: 2 });

    expect(query1).toBe('SELECT * FROM users WHERE a=$1');
    expect(query2).toBe('SELECT name,email FROM users WHERE a=$1');

    expect(query3).toBe('SELECT * FROM users WHERE a=$1 AND b=$2');
    expect(query4).toBe('SELECT * FROM users WHERE a=$1 OR b=$2');
  });

  it('updateAnd and co produces the expected query', () => {
    const query1 = qB.updateWhere({ a: 1 }, { key: 'value' });
    const query2 = qB.updateWhereAnd({ a: 1, b: 2 }, { key: 'value', key2: 'value2' });
    const query3 = qB.updateWhereOr({ a: 1, b: 2 }, { key: 'value', key2: 'value2' });

    expect(query1).toBe('UPDATE users SET key=$2 WHERE a=$1 RETURNING *;');
    expect(query2).toBe('UPDATE users SET key=$3,key2=$4 WHERE a=$1 AND b=$2 RETURNING *;');
    expect(query3).toBe('UPDATE users SET key=$3,key2=$4 WHERE a=$1 OR b=$2 RETURNING *;');
  });

  it('deletes produces the appropriate delete clauses', () => {
    const query1 = qB.deleteWhere({ email: 'test@gmail.com' });
    const query2 = qB.deleteWhereAnd({ a: 1, b: 2 });
    const query3 = qB.deleteWhereOr({ a: 1, b: 2 });

    expect(query1).toBe('DELETE FROM users WHERE email=$1;');
    expect(query2).toBe('DELETE FROM users WHERE a=$1 AND b=$2;');
    expect(query3).toBe('DELETE FROM users WHERE a=$1 OR b=$2;');
  });

  it('Insert statement produces the right query', () => {
    const query = qB.insert({ a: 1, b: 2, c: 3 });
    expect(query).toBe('INSERT INTO users (a,b,c) VALUES ($1,$2,$3) RETURNING *;');
  });

  it('select distinct produces the appropriate clause', () => {
    const query1 = qB.selectDistinct(['first_name', 'last_name']);
    const query2 = qB.selectDistinctWhere(['first_name', 'last_name'], { a: 1 });
    const query3 = qB.selectDistinctWhereAnd(['first_name', 'last_name'], { a: 1, b: 2 });
    const query4 = qB.selectDistinctWhereOr(['first_name', 'last_name'], { a: 1, b: 2 });

    expect(query1).toBe('SELECT DISTINCT first_name,last_name FROM users');
    expect(query2).toBe('SELECT DISTINCT first_name,last_name FROM users WHERE a=$1');
    expect(query3).toBe('SELECT DISTINCT first_name,last_name FROM users WHERE a=$1 AND b=$2');
    expect(query4).toBe('SELECT DISTINCT first_name,last_name FROM users WHERE a=$1 OR b=$2');
  });
});
