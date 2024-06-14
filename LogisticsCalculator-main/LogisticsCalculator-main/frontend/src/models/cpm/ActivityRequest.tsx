export interface ActivityRequest {
    id: number
    name: string
    duration: number
    earlyStart: number
    earlyFinish: number
    lateStart: number
    lateFinish: number
    slackTime: number
    isCriticalActivity: string
    dependencyNames: string[]
}