import { MessageDataPipe } from './message-data.pipe';

describe('MessageDataPipe', () => {
  it('create an instance', () => {
    const pipe = new MessageDataPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a string if string passed', () => {
    const pipe = new MessageDataPipe();
    const input = 'string';
    expect(pipe.transform(input)).toEqual(input);
  });

  it('should return stringify object if passed', () => {
    const pipe = new MessageDataPipe();
    const input = { query: { bearerToken: 'abc' } };
    expect(pipe.transform(input)).toEqual(JSON.stringify(input));
  });
});
