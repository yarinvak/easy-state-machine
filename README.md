## easy-sm
An easy to use state machine.

![npm](https://img.shields.io/npm/v/easy-sm)

### Installation
```
npm i easy-sm
```

### How to

Each state contains a name and an array of events.
An event contains a handler, that will be performed when the event will occur on the state.

For example, lets say we have a car object, with an idle state.
The idle state has an event called "ignite", to ignite the car.
That's how our state is going to look:
```javascript
    const idle: State = {
        name: "idle",
        events: {
            ignite: {
                handler: igniteCar,
                nextState: "ignited",
                failedState: "failedIgniting"
            }
        }
    };
```

Now we shall create the ignited state:
```javascript
    const ignited: State = {
        name: "ignited",
        events: {
            move: {
                handler: moveCar,
                nextState: "carMoved",
                failedState: "failedMoving"
            }
        }
    };
```

We also have to create our failing states. For example:
```javascript
    const ignited: State = {
        name: "failedIgniting",
        events: {
            retry: {
                handler: igniteCar,
                nextState: "ignited",
                failedState: "failedIgniting"
            }           
        }
    };
```

An handler looks like this:
```javascript
    const igniteCar = async (carName: string): Promise<EventHandlerResult> => {
        //todo pythonexecutor createMosaicPython, args.gdbpath, args.mapname, args.srid.tostring
        console.log("Igniting...");
        return {data: carName, newEvent: 'moveCar'};
    };
```
The handler can return some data, and the next event that should be performed (after igniting, we would like to move the car).

You can also create an onChanged function, that will be called every time a state is changed:
```javascript
const onChanged = (newStateName: string, result: EventHandlerResult) => {
    console.log(`Transformed to ${newStateName}`);
};
```

Starting the machine:
```javascript
    const states: State[] = [idle, ignited, movedCar, completed];
    const stateMachine = new StateMachine(initialState, states, onChanged);
    await stateMachine.execute("start", "mazda"); // sending a start event to the machine, and some data
```


