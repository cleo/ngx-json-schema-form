import { SecuredStringDataItem } from './secured-string-data-item';

describe('SecuredStringDataItem', () => {
  const key = 'key';
  const label = 'label';
  const tooltip = 'tooltip';
  const helpText = 'helpText';
  const pathParts = ['parentKey', key];
  const value = undefined;
  const isEdit = false;
  const placeholder = 'placeholder';
  const isReadOnly = false;
  const isHidden = false;

  it('should set placeholder', () => {
    const result = new SecuredStringDataItem(key, label, tooltip, helpText, true, pathParts, value, isReadOnly, isHidden, isEdit, placeholder);
    expect(result.placeholder).toEqual(placeholder);
  });

  it('should set placeholder to an empty string if undefined', () => {
    const result = new SecuredStringDataItem(key, label, tooltip, helpText, true, pathParts, value, isReadOnly, isHidden, isEdit, undefined);
    expect(result.placeholder).toEqual('');
  });

  describe('when the form is NOT being edited', () => {
    it('should set wasRequired and required to true if required', () => {
      const result = new SecuredStringDataItem(key, label, tooltip, helpText, true, pathParts, value, isReadOnly, isHidden, false, placeholder);
      expect(result.required).toEqual(true);
      expect(result.wasRequired).toEqual(true);
    });

    it('should set wasRequired to false if not required', () => {
      const result = new SecuredStringDataItem(key, label, tooltip, helpText, false, pathParts, value, isReadOnly, isHidden, false, placeholder);
      expect(result.required).toEqual(false);
      expect(result.wasRequired).toEqual(false);
    });
  });

  describe('when the form is being edited', () => {
    it('should set wasRequired to true and required to false', () => {
      const result = new SecuredStringDataItem(key, label, tooltip, helpText, true, pathParts, value, isReadOnly, isHidden, true, placeholder);
      expect(result.required).toEqual(false);
      expect(result.wasRequired).toEqual(true);
    });

    it('should set wasRequired and required to false if not required', () => {
      const result = new SecuredStringDataItem(key, label, tooltip, helpText, false, pathParts, value, isReadOnly, isHidden, true, placeholder);
      expect(result.required).toEqual(false);
      expect(result.wasRequired).toEqual(false);
    });
  });

  it('should disable the secured field when no value is entered upon edit', () => {
    const result = new SecuredStringDataItem(key, label, tooltip, helpText, true, pathParts, value, isReadOnly, isHidden, true, placeholder);
    expect(result.disabledState.isDisabledOnSubmit).toEqual(true);
  });

  it('should not disable the secured field when a value is entered upon edit', () => {
    const result = new SecuredStringDataItem(key, label, tooltip, helpText, true, pathParts, 'value', isReadOnly, isHidden, true, placeholder);
    expect(result.disabledState.isDisabledOnSubmit).toEqual(false);
  });

  it('should not disable the secured field when not editing', () => {
    const result = new SecuredStringDataItem(key, label, tooltip, helpText, true, pathParts, value, isReadOnly, isHidden, false, placeholder);
    expect(result.disabledState.isDisabledOnSubmit).toEqual(false);
  });
});
