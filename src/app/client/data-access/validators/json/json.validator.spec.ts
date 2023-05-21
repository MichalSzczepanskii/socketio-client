import { jsonValidator } from './json.validator';
import { FormControl } from '@angular/forms';

describe('JsonValidator', () => {
  it('should pass if string input is valid json', () => {
    const input = '{"key": "value"}';
    expect(jsonValidator(new FormControl(input))).toEqual(null);
  });

  it('should not pass if string input is not valid json', () => {
    const input = '{"key": "value';
    expect(jsonValidator(new FormControl(input))).not.toEqual(null);
  });

  it('should pass if string is not passed', () => {
    expect(jsonValidator(new FormControl())).toEqual(null);
  });
});
