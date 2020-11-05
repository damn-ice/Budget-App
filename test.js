let formatNumber = function(num){
    let reverseNumber = function(param) {
        let strToArray = param.split("");
        let reverseArray = strToArray.reverse();
        return reverseArray.join("")
    }
    // 12345now becomes 54321
    // 1234567 noe becomes 7654321
    num = reverseNumber(num)
    let n = '';
    let count = 0
    for (let i=0; i < num.length; i++){
        n += num[i]
        if (count === 2) {
            n += ',' 
            count = -1
        }
        count++
    }
    ans = reverseNumber(n);
    if (ans.charAt(0)=== ','){
        ans = ans.slice(1)
    }
    return ans;
}

let testLoop = function(num) {
    for (let i=num.length-1; i >=0; i--){
        console.log(num[i]);
    } 
}
let testLoop = function(num) {
    let n = '';
    for (let i=num.length-1; i >=0; i--){
        n += num[i];
    } 
}
