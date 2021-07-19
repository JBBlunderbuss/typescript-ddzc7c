// Import stylesheets
import './style.css';

class Left {
  _val: any;
  constructor(val) {
    this._val = val;
  }
  map() {
    // Left is the sad path
    // so we do nothing
    return this;
  }
  join() {
    // On the sad path, we don't
    // do anything with join
    return this;
  }
  chain() {
    // Boring sad path,
    // do nothing.
    return this;
  }
  toString() {
    const str = this._val.toString();
    return `Left(${str})`;
  }

  static of(x) {
    return new Left(x);
  }
}

class Right {
  _val: any;
  constructor(val) {
    this._val = val;
  }
  map(fn) {
    return new Right(fn(this._val));
  }
  join() {
    if (this._val instanceof Left || this._val instanceof Right) {
      return this._val;
    }
    return this;
  }
  chain(fn) {
    return fn(this._val);
  }
  toString() {
    const str = this._val.toString();
    return `Right(${str})`;
  }

  static of(x) {
    return new Right(x);
  }
}

function either(leftFunc, rightFunc, e) {
  return e instanceof Left ? leftFunc(e._val) : rightFunc(e._val);
}

const status200 = response => {
  return response.status >= 200 && response.status < 300
    ? new Right(response)
    : new Left(new Error('status error'));
};

const isResponseOk = response => {
  return response.ok
    ? new Right(response)
    : new Left(new Error('response error'));
};

async function request(url: string) {
  // fetch
  const response = await fetch(url).catch(err => {
    console.log('err', err);
    return new Error('wrong blah');
  });

  console.log('res', (response as Response).ok);

  const validResponse = Right.of(response)
    .chain(status200)
    .chain(isResponseOk);
  // console.log(validResponse);

  return either(
    err => {
      console.log('err', err);
      throw err;
    },
    val => val.json(),
    validResponse
  );

  // check for errors
  // check for value errors

  // const fieldsEither = right(row).map(splitFields);
  // const rowObj = fieldsEither.chain(zipRow(headerFields));
  // const rowObjWithDate = rowObj.chain(addDateStr);
  // Slowly getting better... but what do we return?
}

const getVal = async url => {
  const val = await request(url);
  console.log(val);
  console.log('---------');
};

// getVal('https://sonplaceholder.typicode.com/todos/2');

getVal('https://mock.codes/500');

getVal('https://mock.codes/404');

// getVal('https://jsonplaceholder.typicode.com/todos/1');
