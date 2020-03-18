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

export interface OnChanged {
    (newStateName: string,
     result?: EventHandlerResult,
     error?: any): void
}