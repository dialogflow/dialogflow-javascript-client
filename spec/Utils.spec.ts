import Utils from "../ts/Utils";
const expect = chai.expect;

describe("ApiAi.Utils", () => {
    describe("#cloneObject", () => {
        it ("should clone object", () => {
            let originalObject = {};
            let clonedObject = Utils.cloneObject(originalObject);

            expect(originalObject).not.to.eq(clonedObject);
            expect(JSON.stringify(originalObject)).to.eq(JSON.stringify(clonedObject));
        });
    });
});
