export class HistoryService {
  historyList: string[] = [];

  isUserDetail(url: string): boolean {
    const pattern = new RegExp('users/[0-9]+$');
    return pattern.test(url);
  }

  isResetPassword(url: string): boolean {
    const pattern = new RegExp('resetpassword/[0-9]+$');
    return pattern.test(url);
  }

  get previous(): string | null {
    if (this.historyList.length > 1) {
      const current = this.historyList[this.historyList.length - 1];
      let index = this.historyList.length - 2;
      let previous = null;
      while (index >= 0) {
        previous = this.historyList[index];
        if ((this.isUserDetail(current) && this.isResetPassword(previous)) || current === previous) {
          previous = null;
        } else {
          break;
        }
        index--;
      }
      return previous;
    }
    return null;
  }

  set previous(previous: string | null) {
    if (previous) {
      this.historyList.push(previous);
    }
  }

}
