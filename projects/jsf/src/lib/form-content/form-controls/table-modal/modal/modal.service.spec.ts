import { Component } from '@angular/core';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  @Component({ template: `` })
  class MockComponent {}

  let service: ModalService<string, number>;

  beforeEach(() => {
    service = new ModalService(MockComponent);
  });

  describe('open()', () => {
    it('opens', () => {
      service.open();

      expect(service.isOpen()).toBe(true);
    });

    it('emits open event with options', () => {
      const options = 'test';

      const resultNextSpy = jasmine.createSpy('next');
      service.getOpenEvents().subscribe(resultNextSpy);

      service.open(options);

      expect(resultNextSpy).toHaveBeenCalledWith(options);
    });
  });

  describe('close()', () => {
    it('closes', () => {
      service.open();

      service.close();

      expect(service.isOpen()).toBe(false);
    });

    it('emits close event with result', () => {
      const result = 123;

      const resultNextSpy = jasmine.createSpy('next');
      service.getCloseEvents().subscribe(resultNextSpy);

      service.open();

      service.close(result);

      expect(resultNextSpy).toHaveBeenCalledWith(result);
    });

    it('emits result', () => {
      const result = 123;

      const resultNextSpy = jasmine.createSpy('next');
      service.open().subscribe(resultNextSpy);

      service.close(result);

      expect(resultNextSpy).toHaveBeenCalledWith(result);
    });
  });

  describe('isOpen()', () => {
    it('returns false if never opened', () => {
      expect(service.isOpen()).toBe(false);
    });
  });
});
