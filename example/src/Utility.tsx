
/**
 * 
 * Remove underscore and make first letter capital letter of `str`
 * @param str 
 * @returns 
 */
export const textFormatter = function(str: string){
    str = str.replace(/_/g, ' ').toLowerCase();
    return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }
