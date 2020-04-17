const whereproXy = require('./where');
const selectQuery = require('./select');


class QueryBuilder {
  constructor(tableName = '') {
    this.tableName = tableName;
    this.selQ = selectQuery;
    this.whereQ = whereproXy;

    if (!tableName) {
      throw Error('Provide a table name');
    }
  }

  select(fields = []) {
    return `${this.selQ.select(fields)} ${this.tableName}`;
  }

  selectWhere(whereField, fields = []) {
    return `${this.select(fields)} ${this.whereQ.where(whereField)}`;
  }

  selectWhereAnd(whereField, fields = []) {
    return `${this.select(fields)} ${this.whereQ.whereAnd(whereField)}`;
  }

  selectWhereOr(whereField, fields = []) {
    return `${this.select(fields)} ${this.whereQ.whereOr(whereField)}`;
  }

  selectDistinct(fields = []) {
    return `${this.selQ.selectDistinct(fields)} ${this.tableName}`;
  }

  selectDistinctWhere(fields, whereField) {
    return `${this.selectDistinct(fields)} ${this.whereQ.where(whereField)}`;
  }

  selectDistinctWhereAnd(fields, whereField) {
    return `${this.selectDistinct(fields)} ${this.whereQ.whereAnd(whereField)}`;
  }

  selectDistinctWhereOr(fields, whereField) {
    return `${this.selectDistinct(fields)} ${this.whereQ.whereOr(whereField)}`;
  }

  insert(columns) {
    const colNames = Object.keys(columns);
    const colPlaceholders = [];
    colNames.forEach((_, index) => {
      colPlaceholders.push(`$${index + 1}`);
    });
    return `INSERT INTO ${this.tableName} (${colNames}) VALUES (${colPlaceholders}) RETURNING *;`;
  }

  updateHelper(whereField = {}, columns = {}) {
    const reqNumber = Object.keys(whereField).length + 1;
    const colkeysEq$val = Object.keys(columns).map((key, index) => `${key}=$${index + reqNumber}`);
    return `UPDATE ${this.tableName} SET ${colkeysEq$val}`;
  }

  updateWhere(whereField = {}, columns = {}) {
    return `${this.updateHelper(whereField, columns)} ${this.whereQ.where(whereField)} RETURNING *;`;
  }

  updateWhereAnd(whereField = {}, columns = {}) {
    return `${this.updateHelper(whereField, columns)} ${this.whereQ.whereAnd(whereField)} RETURNING *;`;
  }

  updateWhereOr(whereField = {}, columns = {}) {
    return `${this.updateHelper(whereField, columns)} ${this.whereQ.whereOr(whereField)} RETURNING *;`;
  }

  deleteQuery() {
    return `DELETE FROM ${this.tableName}`;
  }

  deleteWhere(field) {
    return `${this.deleteQuery()} ${this.whereQ.where(field)};`;
  }

  deleteWhereAnd(field) {
    return `${this.deleteQuery()} ${this.whereQ.whereAnd(field)};`;
  }

  deleteWhereOr(field) {
    return `${this.deleteQuery()} ${this.whereQ.whereOr(field)};`;
  }
}

module.exports = QueryBuilder;