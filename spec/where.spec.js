const whereProxy = require('../queryBuilders/where');

describe('The where queries', () => {
  let q;
  beforeEach(() => {
    q = whereProxy;
  });

  it('the instance has certain methods', () => {
    expect(Reflect.has(q, 'where')).toBe(true);
    expect(Reflect.has(q, 'whereAnd')).toBe(true);
    expect(Reflect.has(q, 'whereOr')).toBe(true);
  });

  it('where produces comma separated strings of key=$n pairs', () => {
    const query = q.where({
      a: 1
    });
    expect(query).toBe('WHERE a=$1');
  });

  it('whereAnd produces comma separated strings of key=$n pairs', () => {
    const query = q.whereAnd({
      a: 1,
      b: 2,
      c: 3
    });
    expect(query).toBe('WHERE a=$1 AND b=$2 AND c=$3');
  });

  it('whereOr produces comma separated strings of key=$n pairs', () => {
    const query = q.whereOr({
      a: 1,
      b: 2,
      c: 3
    });
    expect(query).toBe('WHERE a=$1 OR b=$2 OR c=$3');
  });

});