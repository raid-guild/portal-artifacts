// The gap is viewed from the near edge of the board, where screen-up is -Z.
// Other scenes use the camera orientation so their controls follow the view.
export function movementAxes(test,horizontal,vertical,right,forward){
  return test==='gap'?{x:horizontal,z:-vertical}:
    {x:right.x*horizontal+forward.x*vertical,
      z:right.z*horizontal+forward.z*vertical};
}
