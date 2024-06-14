export interface Activity {
    id: number
    name: string
    duration: number
    earlyStart: number
    earlyFinish: number
    lateStart: number
    lateFinish: number
    slackTime: number
    isCriticalActivity: string
    childList: any[]
    parentList: any[]
    dependencyNames: string[]
}