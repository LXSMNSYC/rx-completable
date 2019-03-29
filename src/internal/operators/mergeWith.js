import { cleanObserver } from '../utils';
import Completable from '../../completable';

function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const { source, other } = this;

  let flagA = false;
  let flagB = false;

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      flagA = true;

      if (flagB) {
        onComplete();
        controller.abort();
      }
    },
    onError(x) {
      onError(x);
      controller.abort();
    },
  });

  other.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      flagB = true;

      if (flagA) {
        onComplete();
        controller.abort();
      }
    },
    onError(x) {
      onError(x);
      controller.abort();
    },
  });
}

export default (source, other) => {
  if (!(other instanceof Completable)) {
    return source;
  }
  const completable = new Completable();
  completable.source = source;
  completable.other = other;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};