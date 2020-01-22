import {StateMachine} from "../../src/types/state-machine";
import {State} from "../../src/types/state";

describe("state machine tests", () => {
    const initialState = "idle";
    const idle: State = {
        name: initialState,
        events: {
            start: {
                handler: jest.fn().mockImplementation(() => {
                    return {newEvent: "next", data: {}}
                }),
                nextState: "savedToDb",
                failedState: "failed"
            }
        }
    };

    const savedToDb: State = {
        name: "savedToDb",
        events: {
            next: {
                handler: jest.fn().mockImplementation(() => {
                    return {data: {}}
                }),
                nextState: "completed",
                failedState: "failed"
            }
        }
    };

    const completed: State = {
        name: "completed",
        events: {}
    };

    const failed: State = {
        name: "failed", events: {}
    };

    const states: State[] = [idle, savedToDb, completed, failed];
    const onChanged = jest.fn();
    const stateMachine = new StateMachine(initialState, states, onChanged);

    test("execute | no event sent | state is not changed", async () => {
        // act
        await stateMachine.execute();

        // assert
        expect(onChanged).not.toBeCalled();
    });

    test("execute | initial state does not exist in the states array | An exception is thrown", async () => {
        // arrange
        const stateMachine = new StateMachine("blabla", states, onChanged);

        // act + assert
        await expect(stateMachine.execute()).rejects.toThrowError("No state found");
    });

    test("execute | event does not exist on state | state is not changed", async () => {
        // act
        await stateMachine.execute("blabla");

        // assert
        expect(onChanged).not.toBeCalled();
    });

    test("execute | an exception is thrown during execution of an handler | the state is changed to the failed state", async () => {
        // arrange
        const state: State = {
            name: "exceptionState",
            events: {
                next: {
                    nextState: "s",
                    failedState: "fa",
                    handler: jest.fn().mockImplementation(() => {
                        throw new Error("error!");
                    })
                }
            }
        };
        const states: State[] = [state, {name: "s", events: {}}, {name: "fa", events: {}}];
        const onChanged = jest.fn();
        const stateMachine: StateMachine = new StateMachine(state.name, states, onChanged);

        // act
        await stateMachine.execute("next", {bla: "bla"});

        // assert
        expect(onChanged).toBeCalledWith("fa", undefined);
    });

    test("execute | handler execution is successful | the state is changed to success state", async () => {
        // act
        await stateMachine.execute("start");

        // assert
        expect(onChanged).toBeCalledTimes(2);
        expect(onChanged).toHaveBeenNthCalledWith(1, "savedToDb", {data: {}, newEvent: "next"});
        expect(onChanged).toHaveBeenNthCalledWith(2, "completed", {data: {}});
    });
});
