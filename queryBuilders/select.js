class SelectQuery {

  // eslint-disable-next-line class-methods-use-this
  joinColumnsAfterSelect(fields, joinWith = ', ') {
    return Reflect.ownKeys(fields).join(joinWith);
  }

  // eslint-disable-next-line class-methods-use-this
  select(fields = []) {
    if (fields.length === 0) {
      return 'SELECT * FROM';
    }
    return `SELECT ${fields} FROM`;
  }

  // eslint-disable-next-line class-methods-use-this
  selectDistinct(fields = []) {
    return `SELECT DISTINCT ${fields} FROM`;
  }
}

module.exports = new SelectQuery();
