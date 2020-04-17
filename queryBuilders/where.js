class WhereQuery {
  // eslint-disable-next-line class-methods-use-this
  joinColumnsAfterWhere(fields, joinWith = ', ') {
    return Reflect.ownKeys(fields).map((key, index) => `${key}=$${index + 1}`).join(joinWith);
  }

  where(fields) {
    return `WHERE ${this.joinColumnsAfterWhere(fields)}`;
  }

  whereAnd(fields) {
    return `WHERE ${this.joinColumnsAfterWhere(fields, ' AND ')}`;
  }

  whereOr(fields) {
    return `WHERE ${this.joinColumnsAfterWhere(fields, ' OR ')}`;
  }
}

const whereProxy = new Proxy((new WhereQuery()), {
  get(target, prop, receiver) {
    if (typeof target[prop] === 'function') {
      return new Proxy(target[prop], {
        apply(targetFunc, thisArg, argumentsList) {
          // make sure a single argument is provided
          if (argumentsList.length === 0) {
            throw new TypeError('Please provide a valid parameter: it shouldn"t be empty or more than 1');
          }
          const fields = argumentsList[0];
          // make sure it's not null or undefined
          if (fields === null || fields === undefined) {
            throw new TypeError('Please provide a valid parameter: null or undefined is unacceptable');
          }
          // make sure the argument is an object, not and array and it's not empty
          if (typeof fields === 'object' && !Array.isArray(fields) && Reflect.ownKeys(fields).length > 0 /* lower bound */) {
            if (targetFunc.name === 'where') {
              if (Reflect.ownKeys(fields).length > 1 /* upper bound for a single where clause */) {
                throw new Error('field should contain an object with a single key-value pair');
              }
            }
            return Reflect.apply(targetFunc, thisArg, argumentsList);
          }
          throw new Error('Please provide a valid parameter: an object with key-value pair(s)');
        }
      });
    }
    return Reflect.get(target, prop, receiver);
  }
});

module.exports = Object.freeze(whereProxy);
