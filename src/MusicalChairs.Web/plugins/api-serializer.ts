import { Record } from "~/utils/generated/fable_modules/fable-library-ts.4.24.0/Types";

export default definePayloadPlugin(() => {
    definePayloadReducer('ApiPOJOs', data => {
        console.log("Payload going out - ", data)
        if (data instanceof Record) {
            return data.toJSON();
        }

        return false;
    })
    definePayloadReviver('ApiPOJOs', (data) => {
        console.log("Paylod going in - ", data)
        return data;
    })
});