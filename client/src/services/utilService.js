
export const utilService = {
    delay,
    getRandomInt,
    makeId,
    getNameInitials,
    getRandomPassword,
    getNameOfMonth,


}

function delay(ms = 1500) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function getNameInitials(name) {
    name = name.split(' ');
    const newName = name.map(word => word[0]).join('').toUpperCase();
    return newName.length > 3 ? newName.substring(0, 3) : newName;

}
function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}


function getNameOfMonth(month) {
    switch (month) {
        case 0:
            return 'Jan'
        case 1:
            return 'Feb'
        case 2:
            return 'Mar'
        case 3:
            return 'Apr'
        case 4:
            return 'May'
        case 5:
            return 'Jun'
        case 6:
            return 'Jul'
        case 7:
            return 'Aug'
        case 8:
            return 'Sep'
        case 9:
            return 'Oct'
        case 10:
            return 'Nov'
        case 11:
            return 'Dec'
        default:
            return ''
    }


}

function getRandomPassword() {

    var pass = ''
    var types = ['ABCDEFGHIJKLMNOPKRSTUVWXYZ', 'abcdefghijklmnopkrstuvwxyz', '@#$%^&*!', '1234567890']
    var counter = 0
    for (var i = 0; i < 8; i++) {
        var currType = types[counter]
        var randomChar = getRandomInt(0, currType.length)
        pass += currType.charAt(randomChar)
        counter++
        if (counter === 3) counter = 0
    }
    return pass
}
