/**
 * Returns a promise that will be resolved in some milliseconds
 * use await sleep(some milliseconds)
 * @param ms milliseconds to sleep for
 * @return a promise that will resolve in ms milliseconds
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function staticUrl() {
  return window.location.protocol + "//" + window.location.host;
}

// This function may throw
export async function fetchApi(url: string, data: object): Promise<[number, any]> {
  // Catch all errors and always return a response
  const resp = await fetch(url, {
    method: 'POST',    // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',      // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',            // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data)     // body data type must match "Content-Type" header
  });

  const objResp = await resp.json();
  const code = await resp.status;
  return [code, objResp];
}

// from here:
// https://stackoverflow.com/questions/40929260/find-last-index-of-element-inside-array-by-certain-condition

/**
* Returns the index of the last element in the array where predicate is true, and -1
* otherwise.
* @param array The source array to search in
* @param predicate find calls predicate once for each element of the array, in descending
* order, until it finds one where predicate returns true. If such an element is found,
* findLastIndex immediately returns that element index. Otherwise, findLastIndex returns undefined.
*/
export function findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number | undefined {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array))
      return l;
  }
  return undefined;
}

/**
* Returns the index of the first element in the array where predicate is true, and -1
* otherwise.
* @param array The source array to search in
* @param predicate find calls predicate once for each element of the array, in ascending
* order, until it finds one where predicate returns true. If such an element is found,
* findFirstIndex immediately returns that element index. Otherwise, findFirstIndex returns undefined.
*/
export function findFirstIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number | undefined {
  let index = array.findIndex(predicate)
  if (index !== -1) {
    return index;
  } else {
    return undefined;
  }
}

export function isEmpty(o: object) {
  return Object.keys(o).length === 0
}

export type Ok<T> = { Ok: T }
export type Err<E> = { Err: E }
export type Result<T, E> = Ok<T> | Err<E>

export function isErr<T, E>(r: Result<T, E>): r is Err<E> {
  return 'Err' in r
}

export function isOk<T, E>(r: Result<T, E>): r is Ok<T> {
  return 'Ok' in r
}

export async function promiseToResult<T, E>(p: Promise<T>, handler: (e: unknown) => E): Promise<Result<T, E>> {
  try {
    return { Ok: await p }
  } catch (e) {
    return { Err: handler(e) }
  }
}

export function getNthOr<T, E>(a: T[], n:number, e:E): Result<T, E> {
  const x = a[n];
  if(x === undefined) {
      return { Err: e }
  } else {
      return { Ok: x }
  }
}

export function getFirstOr<T, E>(a: T[], e:E): Result<T, E> {
  return getNthOr(a, 0, e);
}

export function unwrap<T>(r: Result<T, string | undefined>): T {
  if (isErr(r)) {
    throw Error(r.Err);
  } else {
    return r.Ok
  }
}

export function unwrap_or<T>(r: Result<T, any>, errVal: T): T {
  if (isErr(r)) {
    return errVal;
  } else {
    return r.Ok
  }
}

export function throwException(e: any): never {
  throw e
}

export function nullToUndefined<T>(v: T | null): T | undefined {
  return v !== null
    ? v
    : undefined
}

export function undefinedToNull<T>(v: T | undefined): T | null {
  return v !== undefined
    ? v
    : null
}
