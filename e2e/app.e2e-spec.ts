import { ReallytourvrV4Page } from './app.po';

describe('reallytourvr-v4 App', () => {
  let page: ReallytourvrV4Page;

  beforeEach(() => {
    page = new ReallytourvrV4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
