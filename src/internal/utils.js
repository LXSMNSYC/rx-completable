import AbortController from 'abort-controller';
/**
 * @ignore
 */
export const isIterable = obj => typeof obj === 'object' && typeof obj[Symbol.iterator] === 'function';
/**
 * @ignore
 */
export const isObserver = obj => typeof obj === 'object' && typeof obj.onSubscribe === 'function';
/**
 * @ignore
 */
export const toCallable = x => () => x;
/**
 * @ignore
 */
export const isPromise = obj => (obj instanceof Promise) || (!!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function');
/**
 * @ignore
 */
export function onCompleteHandler() {
  const { onComplete, controller } = this;
  if (controller.signal.aborted) {
    return;
  }
  try {
    onComplete();
  } finally {
    controller.abort();
  }
}
/**
 * @ignore
 */
export function onErrorHandler(err) {
  const { onError, controller } = this;
  let report = err;
  if (!(err instanceof Error)) {
    report = new Error('onError called with a non-Error value.');
  }
  if (controller.signal.aborted) {
    return;
  }

  try {
    onError(report);
  } finally {
    controller.abort();
  }
}
/**
 * @ignore
 */
const identity = x => x;
/**
 * @ignore
 */
const throwError = (x) => { throw x; };
/**
 * @ignore
 */
export const cleanObserver = x => ({
  onSubscribe: x.onSubscribe,
  onComplete: typeof x.onComplete === 'function' ? x.onComplete : identity,
  onError: typeof x.onError === 'function' ? x.onError : throwError,
});
/**
 * @ignore
 */
export const immediateComplete = (o) => {
  // const disposable = new SimpleDisposable();
  const { onSubscribe, onComplete } = cleanObserver(o);
  const controller = new AbortController();
  onSubscribe(controller);

  if (!controller.signal.aborted) {
    onComplete();
    controller.abort();
  }
};
/**
 * @ignore
 */
export const immediateError = (o, x) => {
  const { onSubscribe, onError } = cleanObserver(o);
  const controller = new AbortController();
  onSubscribe(controller);

  if (!controller.signal.aborted) {
    onError(x);
    controller.abort();
  }
};