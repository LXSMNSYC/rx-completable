/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
   *
   */
describe('#delaySubscription', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().delaySubscription(100);
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the amount is not a number.', () => {
    const source = Completable.complete();
    const completable = source.delaySubscription();
    assert(source === completable);
  });
  /**
   *
   */
  it('should signal complete.', (done) => {
    const completable = Completable.complete().delaySubscription(100);
    completable.subscribe(
      () => done(),
      x => done(x),
    );
  });
  /**
   *
   */
  it('should signal error with the given value.', (done) => {
    const completable = Completable.error(new Error('Hello')).delaySubscription(100);
    completable.subscribe(
      x => done(x),
      () => done(),
    );
  });
  /**
   *
   */
  it('should not signal complete if cancelled.', (done) => {
    const source = Completable.complete().delaySubscription(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
    );

    controller.cancel();
    if (controller.cancelled) {
      done();
    }
  });
  /**
   *
   */
  it('should not signal error if cancelled.', (done) => {
    const source = Completable.error(new Error('Hello')).delaySubscription(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
    );

    controller.cancel();
    if (controller.cancelled) {
      done();
    }
  });
});
