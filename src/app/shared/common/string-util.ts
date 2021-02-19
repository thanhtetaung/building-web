class _StringUtil {

  /**
   * converting string to byte
   * @param {String}str String
   * @returns {Array} byte array
   */
  public  stringToBytes(str: string) {
    if (!StringUtil.isValid(str)) {
      return [];
    }
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const cLen = Math.ceil(Math.log(charCode) / Math.log(256));
      for (let j = 0; j < cLen; j++) {
        bytes.push((charCode << (j * 8)) & 0xFF);
      }
    }
    return bytes;
  }


  /**
   * filling string in head or tail by specific character
   * @param {String} src original string
   * @param {String} fillChar character to fill
   * @param {Integer} totalLength
   * @param {Boolean} isPrefix optional prefix flag
   * @param {Boolean} force optional force flag. default false
   * @returns {String} filled string
   */
  public  fillString (src: string, fillChar: string, totalLength: number, isPrefix: boolean, force: boolean): string {
    if (!StringUtil.isValid(src) || !StringUtil.isValid(fillChar) || !StringUtil.isValid(totalLength)) {
      return '';
    }

    if (!StringUtil.isValid(force)) {
      force = false;
    }

    if (!StringUtil.isValid(isPrefix)) {
      isPrefix = false;
    }

    if (src.length > totalLength) {
      if (force) {
        if (isPrefix) {
          return src.substring(src.length - totalLength);
        } else {
          return src.substring(0, totalLength);
        }
      } else {
        return src;
      }
    }
    let sb = '';
    if (isPrefix) {
      while (sb.length < totalLength - src.length) {
        sb += fillChar;
      }
      sb += src;
      // console.log('prefix : ' + sb);
    } else {
      sb += src;
      while (sb.length < totalLength) {
        sb += fillChar;
      }
    }

    return sb;
  }


  /**
   * checking null or undefined
   * @param {*} str
   * @returns {Boolean}
   */
  public  isValid(str: any): boolean {
    return (str || str !== undefined) ? true : false;
  }


  /**
   * checking given parameter is string type or not
   * @param {*} str
   * @returns {boolean}
   */
  public  isString(str: any): boolean {
    return typeof str === 'string';
  }

  /**
   * checking given parameter is array or not
   * @param array
   * @returns {boolean}
   */
  public  isArray(array: any): boolean {
    return array instanceof Array;
  }

  /**
   * checking string is contain in array or not
   * @param {String} str
   * @param {Array} array
   * @returns {boolean}
   */
  public  isIn(str: string, array: string[]): boolean {
    if (!StringUtil.isValid(str) || !StringUtil.isArray(array)) {
      return false;
    }
    let flag = false;
    array.forEach(temp => {
      if (temp === str) {
        flag = true;
      }
    });

    return flag;
  }

  public  checkPermission (functionBit: string, permissions: string) {
    const bit = parseInt(functionBit, 2);
    const permission = parseInt(permissions, 2);
    const result = bit & permission;
    return result.toString(2).indexOf('1') !== -1;
  }

  /**
   * checking function bit is allowed on permission bit
   * @param {String} function bit string
   * @param {String} permissions bit string
   * @returns {boolean}
   */
  public  hasPermission (functionBit: string, permissions: string): boolean {
    if (functionBit.length !== permissions.length) {
      const max = (functionBit.length > permissions.length) ? functionBit.length : permissions.length;
      functionBit = StringUtil.fillString(functionBit, '0', max, true,false);
      permissions = StringUtil.fillString(permissions, '0', max, true,false);
    }

    if (functionBit.length > 32) {
      let bits = functionBit.match(/.{1,32}/g);
      let permissionList = permissions.match(/.{1,32}/g);
      if (bits == null || permissionList == null) {
        return false;
      }
      for (let i = 0; i < bits.length; i++) {
        if (StringUtil.checkPermission(bits[i], permissionList[i])) {
          return true;
        }
      }
    } else {
      if (StringUtil.checkPermission(functionBit, permissions)) {
        return true;
      }
    }
    return false;
  }
}


export const StringUtil = new _StringUtil();
