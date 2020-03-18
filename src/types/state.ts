export interface State {
    name: string;
    events: Events;
}

export interface Events {
    [event: string]: { handler: (param: any) => Promise<EventHandlerResult>, nextState: string, failedState: string };
}

export interface EventHandlerResult {
    newEvent?: string;
    data: any;
}

export interface OnChangedParams {
    newStateName: string;
    result?: EventHandlerResult;
    error?: any;
}