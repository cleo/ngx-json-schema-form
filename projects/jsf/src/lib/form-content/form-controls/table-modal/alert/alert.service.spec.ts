import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    service = new AlertService();
  });

  describe('show()', () => {
    it('shows alert', () => {
      const message = 'message';

      const resultNextSpy = jasmine.createSpy('next');
      service.getAlerts().subscribe(resultNextSpy);

      service.show(message);

      expect(resultNextSpy).toHaveBeenCalledWith({ message });
    });
  });

  describe('hide()', () => {
    it('hides alert', () => {
      const resultNextSpy = jasmine.createSpy('next');
      service.getAlerts().subscribe(resultNextSpy);

      service.hide();

      expect(resultNextSpy).toHaveBeenCalledWith(null);
    });
  });
});
