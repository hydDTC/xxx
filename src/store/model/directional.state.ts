export interface Directional {
  children?: Array<Directional>
  checked?: boolean
  checkState?: 0 | 1 | 2
}

export interface Audiences {
  age?: Directional
  education?: Directional
  sex?: Directional
}

export interface DirectionalState {
  areas?: Directional
  areasChildList?: Array<any>
  areasChild1?: Array<any>
  areasResult?: Array<any>

  audiences?: Array<any>
  audiencesResult?: Array<any>
  audiencesViewResult?: Array<any>

  device?: Array<any>
  deviceResult?: Array<any>
  deviceViewResult?: Array<any>

  lbsCity?: Directional
  lbsScenes?: Array<any>
  lbsCityList?:Array<Array<any>>
  lbsCityResult?: Array<any>
  lbsCityMapResult?: Array<any>
  lbsCityViewResult?: Array<any>

  audiencesAction?: Directional
  audiencesActionList?:Array<Array<any>>
  audiencesActionResult?: Array<any>

  audiencesAction2?: Directional
  audiencesAction2List?:Array<Array<any>>
  audiencesAction2Result?: Array<any>

  result?: any
}

export interface LbsCityState {
  lbsCity?: Directional
  lbsScenes?: Array<any>
  lbsCityList?:Array<Array<any>>
  lbsCityResult?: Array<any>
  lbsCityViewResult?: Array<any>
}

export interface AudiencesActionState {
  audiencesAction?: Directional
  audiencesActionList?:Array<Array<any>>
  audiencesActionResult?: Array<any>

  audiencesAction2?: Directional
  audiencesAction2List?:Array<Array<any>>
  audiencesAction2Result?: Array<any>
}
