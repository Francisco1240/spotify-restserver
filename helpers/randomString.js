
const getRandonString = ( length ) => {
    
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let charLength = chars.length;
    let result = '';
 
    for ( var i = 0; i < length; i++ ) {
       result += chars.charAt( Math.floor( Math.random() * charLength ));
    }
 
    return result;
}

module.exports = {
    getRandonString
}