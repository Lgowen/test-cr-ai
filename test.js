// export function add(a, b) {
//     return a + b
// }

function permute(nums, num) {

    const res = [] // 存放结果数组
    const track = [] // 存放当前路径
    let result = 0
    

    function findTrack(track, startIndex) {

        if (track.length === num) {
            result += track.reduce((a, b) => a * b)
            return
        }

        for (let i = startIndex; i < nums.length; i++) {
            
            if (track.includes(nums[i])) {
                continue
            }

            track.push(nums[i]) 

            findTrack(track, i + 1) 

            track.pop() 
        }
    }

    findTrack(track, 0)

    return result
}

funtion addOutputText() {

}

console.log(permute([1,2,3], 2))