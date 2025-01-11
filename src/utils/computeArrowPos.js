function computeArrowPos(x1,y1,x2,y2){
    const arrowLen = 8
    const alpha = Math.atan2((y2 - y1), (x2 - x1))
 
    let x3 = x2 - arrowLen * Math.cos(alpha + 30 * Math.PI/180); // θ=30
    let y3 = y2 - arrowLen * Math.sin(alpha + 30 * Math.PI/180);
    let x4 = x2 - arrowLen * Math.cos(alpha - 30 * Math.PI/180);
    let y4 = y2 - arrowLen * Math.sin(alpha - 30 * Math.PI/180);

    return [x3,y3,x4,y4]
}

export {computeArrowPos}