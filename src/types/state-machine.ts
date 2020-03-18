import {OnChangedParams, State} from "./state";

export class StateMachine {
    private currentState: string;
    private readonly states: State[];
    private readonly onStateChange: (params: OnChangedParams) => void;


    constructor(initialState: string, states: State[],
                onStateChange: (params: OnChangedParams) => void) {
        this.currentState = initialState;
        this.states = states;
        this.onStateChange = onStateChange;
    }

    public async execute(eventName?: string, data?: any) {
        const state = await this.getState(this.currentState);
        if (!state) {
            throw new Error("No state found");
        }

        if (eventName) {
            const event = state.events[eventName];
            if (event && event.handler) {
                let result;
                try {
                    result = await event.handler(data);
                    this.currentState = event.nextState;
                    await this.onStateChange({newStateName: this.currentState, result});
                    await this.execute(result.newEvent, result);
                } catch (e) {
                    this.currentState = event.failedState;
                    await this.onStateChange({newStateName: this.currentState, result, error: e});
                }
            }
        }
    }

    private async getState(stateName: string) {
        const matchingStates = this.states.filter(x => x.name === stateName);
        return matchingStates.length > 0 ? matchingStates[0] : null;
    }
}
