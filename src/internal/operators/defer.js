import Completable from '../../completable';
import { immediateError, cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  let result;

  let err;
  try {
    result = this.supplier();
    if (!(result instanceof Completable)) {
      throw new Error('Completable.defer: supplier returned a non-Completable.');
    }
  } catch (e) {
    err = e;
  }

  if (typeof err !== 'undefined') {
    immediateError(observer, err);
  } else {
    result.subscribeWith({
      onSubscribe,
      onComplete,
      onError,
    });
  }
}
/**
 * @ignore
 */
export default (supplier) => {
  const completable = new Completable();
  completable.supplier = supplier;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};