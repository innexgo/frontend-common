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

export function apiUrl() {
  return staticUrl() + '/api';
}

// This function may throw
export async function fetchApi(url: string, data: object) {
  // Catch all errors and always return a response
  let resp = await fetch(`${apiUrl()}/${url}`, {
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

  let objResp = await resp.json();
  return objResp;
}

// from here:
// https://stackoverflow.com/questions/40929260/find-last-index-of-element-inside-array-by-certain-condition

/**
* Returns the index of the last element in the array where predicate is true, and -1
* otherwise.
* @param array The source array to search in
* @param predicate find calls predicate once for each element of the array, in descending
* order, until it finds one where predicate returns true. If such an element is found,
* findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
*/
export function findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array))
      return l;
  }
  return -1;
}


export function assert(val: boolean, msg: string) {
  if (!val) {
    throw new Error(msg);
  }
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

export async function fromPromise<T, E>(p: Promise<T>, handler: (e: unknown) => E): Promise<Result<T, E>> {
  try {
    return { Ok: await p }
  } catch (e) {
    return { Err: handler(e) }
  }
}

export function unwrap<T>(r:Result<T, string | undefined>): T {
  if(isErr(r)) {
      throw Error(r.Err);
  } else {
      return r.Ok
  }
}
