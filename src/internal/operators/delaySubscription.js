import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isNumber, defaultScheduler } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { amount, scheduler } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  controller.link(
    scheduler.delay(() => {
      controller.unlink();
      this.source.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete,
        onError,
      });
    }, amount),
  );
}
/**
 * @ignore
 */
export default (source, amount, scheduler) => {
  if (!isNumber(amount)) {
    return source;
  }
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.amount = amount;
  completable.scheduler = defaultScheduler(scheduler);
  return completable;
};
