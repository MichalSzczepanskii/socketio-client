import { FormControl } from '@angular/forms';
import { wsAddressValidator } from './ws-address.validator';

describe('WsAddressValidator', () => {
  it('should pass if string is valid ws address', () => {
    const validAddresses = ['ws://localhost:3000', 'wss://localhost:3000'];
    validAddresses.forEach(address => {
      expect(wsAddressValidator(new FormControl(address))).toEqual(null);
    });
  });

  it('should pass if string is valid ws address', () => {
    const invalidAddresses = ['http://localhost:3000'];
    invalidAddresses.forEach(address => {
      expect(wsAddressValidator(new FormControl(address))).toEqual({
        invalidWsAddress: true,
      });
    });
  });

  it('should pass if string is not passed', () => {
    expect(wsAddressValidator(new FormControl())).toEqual(null);
  });
});
