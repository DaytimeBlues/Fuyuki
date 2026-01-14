import { createListenerMiddleware } from '@reduxjs/toolkit';
import { hpChanged } from '../slices/characterSlice';
import { concentrationCheckRequired } from '../slices/combatSlice';

export const createConcentrationMiddleware = () => {
    const listenerMiddleware = createListenerMiddleware();

    listenerMiddleware.startListening({
        actionCreator: hpChanged,
        effect: (action, listenerApi) => {
            const previousState = listenerApi.getOriginalState() as {
                character: { hp: { current: number } };
                combat: { activeConcentration: unknown };
            };
            const currentState = listenerApi.getState() as {
                character: { hp: { current: number } };
                combat: { activeConcentration: unknown };
            };

            if (!currentState.combat.activeConcentration) {
                return;
            }

            const previousHp = previousState.character.hp.current;
            const currentHp = currentState.character.hp.current;
            const damage = Math.max(0, previousHp - currentHp);

            if (damage <= 0 || currentHp <= 0) {
                return;
            }

            listenerApi.dispatch(concentrationCheckRequired({ damage }));
        },
    });

    return listenerMiddleware;
};
